/*
 * Promise와 then 문법
 * - axios 요청은 Promise를 반환하므로 async/await 없이도 처리할 수 있습니다.
 * - then(callback)은 요청이 성공하면 callback을 실행하고 응답을 전달합니다.
 * - callback이 반환한 값은 then 체인의 최종 Promise 결과가 됩니다.
 * - 요청이 실패하거나 callback에서 오류가 발생하면 반환된 Promise도 실패하며,
 *   호출한 쪽에서 catch()로 처리할 수 있습니다.
 * - Axios 응답에서 data는 서버 응답 본문이고, status는 HTTP 상태 코드입니다.
 */
import axios from "axios";

const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const apiClient = axios.create({
    baseURL: API_SERVER
});

// 전체 메뉴 조회
export function getAllMenus() {
    return apiClient.get("/menus")
        .then((response) => response.data);
}

// 메뉴 검색
export function searchMenus(keyword) {
    return apiClient.get("/menus/search", {
        params: { word: keyword }
    }).then((response) => response.data);
}

// 메뉴 한 건 조회
export function getMenuOne(id) {
    return apiClient.get(`/menus/${id}`)
        .then((response) => response.data);
}

// 메뉴 등록
export function addMenu(menuObject) {
    return apiClient.post("/menus", menuObject)
        .then((response) => response.data);
}

// 메뉴 수정
export function updateMenu(menuObject) {
    return apiClient.put("/menus", menuObject)
        .then((response) => response.data);
}

// 메뉴 삭제
export function deleteMenu(id) {
    return apiClient.delete(`/menus/${id}`).then((response) => {
        if (response.status === 204) {
            return null;
        }

        return response.data;
    });
}

// 메뉴 추천
export function recommendMenu(id) {
    return apiClient.post(`/menus/recommend/${id}`)
        .then((response) => response.data);
}

// AI 채팅
export function sendChat(question) {
    return apiClient.post("/chat", { question })
        .then((response) => response.data);
}
