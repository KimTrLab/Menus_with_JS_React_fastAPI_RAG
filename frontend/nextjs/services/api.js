
/*
 * 이 파일은 fetch를 사용해 프런트엔드와 백엔드 사이의 HTTP 통신을 처리합니다.
 * 메뉴 조회/검색/등록/수정/삭제/추천과 AI 채팅 함수들을 컴포넌트에 제공합니다.
 */

// 서버 주소는 공개 가능한 NEXT_PUBLIC_ 환경 변수에서 읽습니다.
const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER;


// 전체 메뉴 조회
// export function은 이름을 지정해 내보내는 함수입니다. 가져올 때 같은 이름을 중괄호 안에 씁니다.
export async function getAllMenus() {
    // fetch는 HTTP 요청의 Promise를 반환하고, await은 응답이 올 때까지 기다립니다.
    const response = await fetch(`${API_SERVER}/menus`);
    // response.json()도 Promise를 반환하므로 await으로 JSON 본문을 가져옵니다.
    return response.json();
}

// 메뉴 검색
export async function searchMenus(keyword) {
    // URLSearchParams가 검색어를 URL 쿼리 문자열에 맞게 인코딩합니다.
    const params = new URLSearchParams({ word: keyword });
    const response = await fetch(`${API_SERVER}/menus/search?${params}`);
    return response.json();
}

// 메뉴 한 건 조회
export async function getMenuOne(id) {
    const response = await fetch(`${API_SERVER}/menus/${id}`);
    return response.json();
}

// 메뉴 등록
export async function addMenu(menuObject) {
    const response = await fetch(`${API_SERVER}/menus`, {
        // POST는 새 데이터를 서버에 등록하는 요청입니다.
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 객체를 JSON 문자열로 바꾸어 요청 본문(body)에 담습니다.
        body: JSON.stringify(menuObject)
    });

    return response.json();
}

// 메뉴 수정
export async function updateMenu(menuObject) {
    const response = await fetch(`${API_SERVER}/menus`, {
        // PUT은 기존 데이터를 수정하는 요청입니다.
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuObject)
    });

    return response.json();
}

// 메뉴 삭제
export async function deleteMenu(id) {
    const response = await fetch(`${API_SERVER}/menus/${id}`, {
        method: "DELETE"
    });

    // 204 No Content 응답에는 JSON 본문이 없으므로 파싱하지 않고 null을 반환합니다.
    if (response.status === 204) {
        return null;
    }

    return response.json();
}

// 메뉴 추천
export async function recommendMenu(id) {
    const response = await fetch(`${API_SERVER}/menus/recommend/${id}`, {
        method: "POST"
    });

    return response.json();
}

// AI 채팅
export async function sendChat(question) {
    const response = await fetch(`${API_SERVER}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // { question }은 { question: question }과 같은 객체 축약 문법입니다.
        body: JSON.stringify({ question })
    });

    return response.json();
}


// // 공통 API 요청 함수
// async function request(url, options = {}) {
//     const response = await fetch(`${API_SERVER}${url}`, options);

//     if (!response.ok) {
//         throw new Error(`서버 요청 실패: ${response.status}`);
//     }
//     // DELETE 요청에서 응답 본문이 없는 경우
//     if (response.status === 204) {
//         return null;
//     }
//     return response.json();
// }

// // 전체 메뉴 조회
// export async function getAllMenus() {
//     return request("/menus");
// }

// // 메뉴 검색
// export async function searchMenus(keyword) {
//     const params = new URLSearchParams({ word: keyword });
//     return request(`/menus/search?${params}`);
// }

// // 메뉴 한 건 조회
// export async function getMenuOne(id) {
//     return request(`/menus/${id}`);
// }

// // 메뉴 등록
// export async function addMenu(menuObject) {
//     return request("/menus", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(menuObject)
//     });
// }

// // 메뉴 수정
// export async function updateMenu(menuObject) {
//     return request("/menus", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(menuObject)
//     });
// }

// // 메뉴 삭제
// export async function deleteMenu(id) {
//     return request(`/menus/${id}`, {
//         method: "DELETE"
//     });
// }

// // 메뉴 추천
// export async function recommendMenu(id) {
//     return request(`/menus/recommend/${id}`, {
//         method: "POST"
//     });
// }

// // AI 채팅
// export async function sendChat(question) {
//     return request("/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ question })
//     });
// }
