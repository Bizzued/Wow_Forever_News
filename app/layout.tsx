import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'포에버 데일리 — 아제로스의 오늘',description:'와우 포에버 국내외 공식 소식, 업데이트와 커뮤니티 반응을 한국어로 읽는 일일 브리핑',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
