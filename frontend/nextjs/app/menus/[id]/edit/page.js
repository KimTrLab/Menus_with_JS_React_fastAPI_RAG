
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MenuModifyForm from "@/components/MenuModifyForm";

import {
    getMenuOne,
    updateMenu
} from "@/services/api";

export default function EditMenuPage() {
    const { id } = useParams();  //현재 URL에 포함된 동적 경로의 값을 가져오는 코드
    const router = useRouter();

    const [menu, setMenu] = useState(null);

    useEffect(() => {
        async function loadMenu() {
            try {
                const data = await getMenuOne(id);
                setMenu(data);
            } catch (error) {
                alert(error.message);
            }
        }

        loadMenu();
    }, [id]);

    async function handleSave(menuObject) {
        try {
            await updateMenu(menuObject);
            alert("메뉴가 수정되었습니다.");
            router.push("/menus");
        } catch (error) {
            alert(error.message);
        }
    }

    if (!menu) return <p>메뉴 정보를 불러오는 중입니다.</p>;

    return (
        <section>
            <h2>메뉴 수정</h2>
            <MenuModifyForm
                initialData={menu}
                onSave={handleSave}
            />
        </section>
    );
}
