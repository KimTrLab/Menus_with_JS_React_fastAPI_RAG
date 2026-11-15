
/*
 * 이 파일은 Next.js 앱 전체에 공통으로 적용되는 최상위 레이아웃입니다.
 * 공통 CSS, 헤더, 채팅 사이드바를 배치하고 현재 페이지를 children 위치에 표시합니다.
 */

// 앱 전체에 적용할 전역 CSS 파일을 불러옵니다.
import "./globals.css";

// 모든 페이지 위쪽에 표시할 공통 헤더입니다.
import Header from "@/components/Header";
// 모든 페이지 옆에 표시할 채팅 사이드바입니다.
import ChatSidebar from "@/components/ChatSidebar";

// export default는 이 파일의 대표 컴포넌트를 내보내며, Next.js는 app/layout.js 규칙에 따라 루트 레이아웃으로 사용합니다.
// children은 현재 URL에 해당하는 페이지 내용이 Next.js로부터 전달되는 prop입니다.
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Header />

        <div className="app-layout">
          <ChatSidebar />

          <main className="main-area">
            {/* 페이지마다 달라지는 내용은 공통 레이아웃의 이 자리에 들어옵니다. */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
