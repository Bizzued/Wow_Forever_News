# Wow Forever News · 포에버 데일리

와우 포에버의 공식 뉴스, 업데이트와 국내외 커뮤니티 반응을 한국어로 정리하는 개인 브리핑 사이트입니다.

## 기능

- 일일 핵심 요약 및 원문 링크
- 공식 발표 / 패치 / 커뮤니티 의견 구분
- 한국 / 해외 지역 필터와 검색
- 브라우저에 저장하는 북마크
- Cloudflare D1에 저장하는 날짜별 브리핑
- 마지막 확인 시각과 오래된 자료 경고

## 구성

React 19, TypeScript, Vinext/Vite, Cloudflare Workers, D1, Drizzle을 사용합니다.

| 경로 | 역할 |
| --- | --- |
| `app/page.tsx` | 대시보드와 클라이언트 상호작용 |
| `app/globals.css` | 반응형 스타일 |
| `app/api/briefings/route.ts` | 브리핑 조회·저장 API와 입력 검증 |
| `app/api/workflow/route.ts` | 갱신 지침 제공 |
| `lib/workflow.ts` | 수집 출처, 검증 원칙, 저장 스키마 |
| `lib/initial.ts` | 데이터가 없을 때 표시할 안내용 콘텐츠 |
| `db/schema.ts`, `drizzle/` | D1 스키마와 마이그레이션 |
| `.openai/hosting.json` | Sites 바인딩 선언 |

## 로컬 실행

Node.js 22.13 이상과 pnpm이 필요합니다. 저장소 루트에서 실행하세요.

```bash
pnpm install --frozen-lockfile
pnpm build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_living_network.sql
pnpm dev
```

서버가 출력하는 주소를 여세요. 생성된 `.wrangler`, `.sites-runtime`, `dist`는 커밋하지 않습니다. 최초 로컬 데이터베이스에는 실제 브리핑이 없습니다.

```bash
pnpm exec tsc --noEmit
pnpm build
```

추가 실행·플랫폼 안내는 [스타터 문서](docs/STARTER.md)를 참고하세요.

## 자동 갱신

운영 사이트의 ChatGPT 예약 작업은 한국 시간 기준 매일 오후 4시, 토·일요일 오전 6시에 추가로 실행하도록 설정되어 있습니다. 예약은 GitHub Actions가 아니며, 이 저장소를 복제한다고 생성되지는 않습니다.

예약 작업은 공개 웹 자료를 확인하고 한국어 요약을 `POST /api/briefings`로 저장한 뒤 재조회로 검증합니다. 같은 날짜는 갱신하고 다른 날짜는 보존합니다. 주말 오전·오후 요약은 해당 날짜의 최신 내용으로 갱신됩니다.

## 접근 권한과 배포

**현재 저장 API는 소유자 전용 비공개 Sites의 접근 제어를 전제로 합니다.** 공개 서버에 그대로 배포하면 저장 API가 보호되지 않습니다. 친구에게 공개하거나 독립 호스팅으로 옮기기 전에 서버 측 쓰기 권한 검증을 추가해야 합니다.

GitHub 저장소의 공개 여부와 운영 사이트의 공개 여부는 서로 별개입니다. GitHub에 코드를 올려도 운영 사이트의 비공개 설정은 바뀌지 않습니다. 현재 GitHub push와 Sites 배포 사이에는 자동 동기화가 없습니다. 변경 내용은 별도 검증·배포가 필요합니다.

운영 사이트 ID, 인증 토큰, 로컬 데이터베이스, 실제 브리핑 데이터는 이 저장소에서 제외했습니다. `.openai/hosting.json`에는 바인딩 이름만 포함되어 있습니다. 새 Sites로 배포할 때는 발급받은 프로젝트 ID를 설정해야 합니다. 인증 토큰을 소스·URL·커밋 기록에 넣지 마세요.

## 요약 원칙

공식 사실, 개별 유저 의견, 간접 보도·미확인 내용을 구분합니다. 일부 게시글을 전체 여론으로 일반화하지 않습니다. 지역과 발행일·확인 시각을 명시하고, 확인 실패를 새 소식 없음으로 처리하지 않습니다.

독립 팬 프로젝트이며 Blizzard 공식 서비스가 아닙니다. 포함된 스타터 및 서드파티 코드의 라이선스 고지는 각 파일에 유지했습니다.
