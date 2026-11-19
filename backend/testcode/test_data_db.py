import json
import unittest
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

from service import data_db


class MariaDBMenuTests(unittest.TestCase):
    def setUp(self):
        self.connection = MagicMock()
        self.cursor = self.connection.cursor.return_value.__enter__.return_value
        self.connect = patch.object(data_db.pymysql, "connect", return_value=self.connection)
        self.connect.start()
        self.addCleanup(self.connect.stop)

    def test_add_menu_with_attachment(self):
        self.cursor.lastrowid = 12
        menu = SimpleNamespace(model_dump=lambda: {
            "id": 99, "name": "김밥", "calories": 500, "description": "메뉴"
        })
        attachment = {"filename": "사진.png", "stored_filename": "abc"}

        result = data_db.add_menu(menu, attachment)

        self.assertEqual(result["id"], 12)
        self.assertEqual(result["recommendation"], 0)
        self.assertEqual(result["attachment"], attachment)
        params = self.cursor.execute.call_args.args[1]
        self.assertEqual(json.loads(params[3]), attachment)
        self.connection.commit.assert_called_once()
        self.connection.close.assert_called_once()

    def test_read_and_update_keep_optional_attachment(self):
        row = {
            "id": 1, "name": "김밥", "calories": 500, "description": "",
            "recommendation": 2, "attachment": None,
        }
        self.cursor.fetchone.return_value = row
        result = data_db.update_one(SimpleNamespace(
            id=1, name="김밥", calories=500, description=""
        ))
        self.assertNotIn("attachment", result)
        self.assertEqual(result["recommendation"], 2)

        self.cursor.fetchone.return_value = {
            **row, "attachment": '{"filename": "사진.png", "stored_filename": "abc"}'
        }
        self.assertEqual(data_db.get_one(1)["attachment"]["filename"], "사진.png")
        self.cursor.fetchone.return_value = None
        self.assertIsNone(data_db.get_one(999))

    def test_search_uses_literal_parameter_and_delete_reports_missing(self):
        self.cursor.fetchall.return_value = []
        self.assertEqual(data_db.search_Word("%_"), [])
        self.assertEqual(self.cursor.execute.call_args.args[1], ("%_",))
        self.assertIn("LOCATE(BINARY", self.cursor.execute.call_args.args[0])

        self.cursor.rowcount = 0
        self.assertIsNone(data_db.delete_menu(7))
        self.cursor.rowcount = 1
        self.assertEqual(data_db.delete_menu(7), 7)

    def test_database_error_rolls_back_and_propagates(self):
        self.cursor.execute.side_effect = RuntimeError("database error")
        with self.assertRaisesRegex(RuntimeError, "database error"):
            data_db.update_recommend(1)
        self.connection.rollback.assert_called_once()
        self.connection.commit.assert_not_called()
        self.connection.close.assert_called_once()


if __name__ == "__main__":
    unittest.main()
