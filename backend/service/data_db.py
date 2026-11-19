# """data.py와 같은 메뉴 기능을 MariaDB에 저장합니다.
# CREATE TABLE menus (
#     id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
#     name TEXT NOT NULL,
#     calories BIGINT NOT NULL,
#     description LONGTEXT NOT NULL,
#     recommendation BIGINT NOT NULL DEFAULT 0,
#     attachment LONGTEXT NULL
# ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
# """
import json
import os  # 환경변수를 읽습니다.
from contextlib import contextmanager  # with 문에서 사용할 함수를 만듭니다.
from pathlib import Path  # 현재 파일을 기준으로 환경 파일의 경로를 찾습니다.

import pymysql  # Python에서 MariaDB에 연결하고 SQL을 실행합니다.
from dotenv import load_dotenv  # .env 파일의 설정을 환경변수로 불러옵니다.
from pymysql.cursors import DictCursor  # 조회 결과를 컬럼 이름을 키로 하는 딕셔너리로 받습니다.

# 실행 위치와 관계없이 backend 폴더의 .env.mariadb를 읽습니다.
# 이미 설정된 환경변수는 덮어쓰지 않습니다.
load_dotenv(Path(__file__).resolve().parent.parent / ".env.mariadb")


# yield 전에는 연결을 준비하고, with 블록이 끝나면 yield 이후의 정리 코드를 실행합니다.
@contextmanager
def db_cursor():
    connection = pymysql.connect(
        # get은 설정이 없을 때 두 번째 값을 사용합니다.
        host=os.environ.get("MARIADB_HOST", "127.0.0.1"),
        port=int(os.environ.get("MARIADB_PORT", "3306")),
        # 필수 설정이 없으면 기본값 대신 오류가 발생합니다.
        user=os.environ["MARIADB_USER"],
        password=os.environ["MARIADB_PASSWORD"],
        database=os.environ["MARIADB_DATABASE"],
        charset="utf8mb4",  # 한글과 이모지 등을 주고받을 수 있는 문자 인코딩
        cursorclass=DictCursor,
    )
    try:
        # 커서는 SQL을 실행하고 결과를 가져오는 도구입니다.
        with connection.cursor() as cursor:
            yield cursor
        # with 블록이 성공하면 변경 내용을 확정합니다.
        connection.commit()
    except Exception:
        # 오류가 나면 확정되지 않은 변경을 취소하고 오류를 호출한 곳에 전달합니다.
        connection.rollback()
        raise
    finally:
        # 성공과 실패 모두 연결을 닫습니다.
        connection.close()


def _menu_from_row(row):
    # DB의 한 행을 기존 data.py와 같은 메뉴 딕셔너리 형태로 바꿉니다.
    if row is None:
        return None  # 조회 결과가 없는 경우
    attachment = row.pop("attachment")  # DB 컬럼을 잠시 꺼냅니다.
    if attachment is not None:
        # DB에 저장된 JSON 문자열을 다시 Python 딕셔너리로 변환합니다.
        # 첨부파일이 없으면 기존 data.py처럼 attachment 키를 넣지 않습니다.
        row["attachment"] = json.loads(attachment)
    return row


def get_all():
    # SELECT는 행을 조회하며 ORDER BY id는 ID 오름차순으로 정렬합니다.
    with db_cursor() as cursor:
        cursor.execute(
            "SELECT id, name, calories, description, recommendation, attachment "
            "FROM menus ORDER BY id"
        )
        # fetchall은 조회된 모든 행을 가져옵니다.
        return [_menu_from_row(row) for row in cursor.fetchall()]


def search_Word(word):
    # LOCATE는 이름에 검색어가 있는 위치를 반환하고, 없으면 0을 반환합니다.
    # BINARY 비교로 대소문자를 구분하고 %, _도 와일드카드가 아닌 일반 문자로 검색합니다.
    with db_cursor() as cursor:
        # %s에 값을 직접 이어 붙이지 않고 별도 인자로 전달해 SQL 인젝션을 방지합니다.
        cursor.execute(
            "SELECT id, name, calories, description, recommendation, attachment "
            "FROM menus WHERE LOCATE(BINARY %s, BINARY name) > 0 ORDER BY id",
            (word,),
        )
        return [_menu_from_row(row) for row in cursor.fetchall()]


def add_menu(menu, attachment=None):
    values = menu.model_dump()  # Pydantic 메뉴 객체를 딕셔너리로 바꿉니다.
    # 딕셔너리인 첨부파일 정보는 문자열로 저장하고, 없으면 SQL NULL로 저장합니다.
    attachment_json = json.dumps(attachment, ensure_ascii=False) if attachment is not None else None
    with db_cursor() as cursor:
        # id는 테이블의 AUTO_INCREMENT가 생성하고, 추천 수는 0으로 시작합니다.
        cursor.execute(
            "INSERT INTO menus (name, calories, description, recommendation, attachment) "
            "VALUES (%s, %s, %s, 0, %s)",
            (values["name"], values["calories"], values["description"], attachment_json),
        )
        new_menu = {
            "id": cursor.lastrowid,  # 방금 INSERT한 행에 DB가 부여한 ID
            "name": values["name"],
            "calories": values["calories"],
            "description": values["description"],
            "recommendation": 0,
        }
        if attachment is not None:
            new_menu["attachment"] = attachment
        return new_menu


def delete_menu(menu_id):
    with db_cursor() as cursor:
        cursor.execute("DELETE FROM menus WHERE id = %s", (menu_id,))
        # rowcount는 삭제된 행의 수입니다. 대상이 없으면 None을 반환합니다.
        return menu_id if cursor.rowcount else None


def get_one(id):
    # 기본 키인 ID로 메뉴 한 건을 조회합니다.
    with db_cursor() as cursor:
        cursor.execute(
            "SELECT id, name, calories, description, recommendation, attachment "
            "FROM menus WHERE id = %s",
            (id,),
        )
        # fetchone은 결과가 없을 때 None을 반환합니다.
        return _menu_from_row(cursor.fetchone())


def update_one(menudata):
    with db_cursor() as cursor:
        # 이름, 칼로리, 설명만 변경하므로 추천 수와 첨부파일은 유지됩니다.
        cursor.execute(
            "UPDATE menus SET name = %s, calories = %s, description = %s WHERE id = %s",
            (menudata.name, menudata.calories, menudata.description, menudata.id),
        )
        # 값이 이전과 같아도 메뉴가 존재하면 결과를 반환하도록 다시 조회합니다.
        cursor.execute(
            "SELECT id, name, calories, description, recommendation, attachment "
            "FROM menus WHERE id = %s",
            (menudata.id,),
        )
        return _menu_from_row(cursor.fetchone())


def update_recommend(id):
    with db_cursor() as cursor:
        # DB에서 바로 1을 더하므로 동시 요청도 각각 반영할 수 있습니다.
        cursor.execute(
            "UPDATE menus SET recommendation = recommendation + 1 WHERE id = %s",
            (id,),
        )
