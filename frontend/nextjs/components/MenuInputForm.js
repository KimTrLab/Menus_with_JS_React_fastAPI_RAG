
"use client";

/*
 * 이 파일은 새 메뉴를 입력하고 등록하는 폼 컴포넌트입니다.
 * 제출 이벤트에서 FormData로 입력값을 읽어 API에 보내고, 성공하면 목록으로 이동합니다.
 */

// 메뉴 등록 요청을 담당하는 프로젝트 내부 API 함수입니다.
import { addMenu } from "@/services/api";
// Next.js 클라이언트 내비게이션으로 등록 완료 후 페이지를 이동하는 기능입니다.
import { useRouter } from "next/navigation";

// default export는 이 폼 컴포넌트를 다른 파일에서 대표 이름으로 가져오게 합니다.
export default function MenuInputForm() {

    const router = useRouter();

    async function handleSave(event) {
        // 기본 페이지 새로고침 방지
        event.preventDefault();

         // 입력값 가져오기
        // const menuObject = {
        //     name: event.target.name.value,
        //     calories: Number(event.target.calories.value),
        //     description: event.target.description.value
        // };

        // FormData는 제출된 form 안에서 name 속성이 지정된 입력값들을 읽게 해 줍니다.
        const formData = new FormData(event.target);

        // 서버 API가 받을 메뉴 객체를 만듭니다.
        // formData.get()의 값은 문자열이므로 칼로리는 Number()로 숫자로 변환합니다.
        const menuObject = {
            id: 0,  // 새 메뉴이므로 ID는 0으로 설정
            name: formData.get("name"),
            calories: Number(formData.get("calories")),
            description: formData.get("description")
        };

        try {
            // 메뉴 등록 API를 기다린 뒤, 성공하면 알림을 띄우고 메뉴 목록으로 이동합니다.
            console.log("menuObject_menuinputform.js", menuObject); // 디버깅용 로그 추가
            await addMenu(menuObject);
            alert("메뉴가 등록되었습니다.");
            // 메뉴 목록 페이지로 이동
            router.push("/menus");

        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div>
            <h2>메뉴 등록</h2>
            <form onSubmit={handleSave}>
                <div>
                    <label htmlFor="name">메뉴 이름:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="calories">칼로리:</label>
                    <input
                        type="number"
                        id="calories"
                        name="calories"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description">설명:</label>
                    <textarea
                        id="description"
                        name="description"
                    />
                </div>

                <button type="submit">등록</button>
            </form>
        </div>
    );
}
