
"use client";

import { addMenu } from "@/services/api";
import { useRouter } from "next/navigation";

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

        // 폼 데이터 가져오기
        const formData = new FormData(event.target);

        // 폼 데이터를 객체로 변환
        const menuObject = {
            id: 0,  // 새 메뉴이므로 ID는 0으로 설정
            name: formData.get("name"),
            calories: Number(formData.get("calories")),
            description: formData.get("description")
        };

        try {
            // 메뉴 등록 API 호출
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
