import axios from "axios";

const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const apiClient = axios.create({
    baseURL: API_SERVER
});

// 전체 메뉴 조회
export async function getAllMenus() {
    const response = await apiClient.get("/menus");
    return response.data;
}

// 메뉴 검색
export async function searchMenus(keyword) {
    const response = await apiClient.get("/menus/search", {
        params: { word: keyword }
    });
    return response.data;
}

// 메뉴 한 건 조회
export async function getMenuOne(id) {
    const response = await apiClient.get(`/menus/${id}`);
    return response.data;
}

// 메뉴 등록
export async function addMenu(menuObject) {
    console.log("menuObject", menuObject); // 디버깅용 로그 추가
    const response = await apiClient.post("/menus", menuObject);
    return response.data;
}

// 메뉴 수정
export async function updateMenu(menuObject) {
    const response = await apiClient.put("/menus", menuObject);
    return response.data;
}

// 메뉴 삭제
export async function deleteMenu(id) {
    const response = await apiClient.delete(`/menus/${id}`);

    if (response.status === 204) {
        return null;
    }

    return response.data;
}

// 메뉴 추천
export async function recommendMenu(id) {
    const response = await apiClient.post(`/menus/recommend/${id}`);
    return response.data;
}

// AI 채팅
export async function sendChat(question) {
    const response = await apiClient.post("/chat", { question });
    return response.data;
}
