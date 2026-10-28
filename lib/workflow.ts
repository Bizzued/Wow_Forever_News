export const workflow = {
 version:1,
 purpose:'와우 포에버 국내외 소식의 한국어 일일 요약을 갱신한다.',
 sourceAccess:'웹 검색 도구로 공개 출처를 조사한다. 로그인·유료 콘텐츠·스크래핑 우회는 하지 않는다.',
 sources:['https://worldofwarcraft.blizzard.com/ko-kr/news','https://worldofwarcraft.blizzard.com/en-us/news','https://us.forums.blizzard.com/en/wow/c/wow-forever/346','https://eu.forums.blizzard.com/en/wow/','https://www.inven.co.kr/board/wow/6567','https://www.reddit.com/r/classicwow/','https://www.wowhead.com/forever/news','https://www.icy-veins.com/wow-forever/news/'],
 research:'최근 24시간을 우선 확인하고 필요하면 72시간까지 넓힌다. WoW Forever/와우 포에버와 다른 와우 버전을 구분한다. 공식 공지·개발자 글은 우선 원문 확인. 커뮤니티는 개별 글의 의견으로 표시하고 전체 여론, 임의 비율, 확인하지 않은 추천수 등은 쓰지 않는다. 지역별 일정·시간대는 KST로 명시하고 EU/NA 소식을 한국으로 일반화하지 않는다. 확인 실패는 명시한다. 오래된 참고 자료는 발행일을 유지하며 새 소식처럼 재사용하지 않는다. 광고·골드 판매·스폰서 홍보는 제외한다. 원문은 짧게 의역하고 장문 전재하지 않는다.',
 access:'Sites get_site(project_id)에서 해당 Site가 owner-private임을 확인한다. access_policy가 custom이고 owner 이외 allowed_users/allowed_groups가 없을 때만 현재 writer 사용. private 서비스 접근 토큰 siwc_bypass_bearer_token을 매번 새로 조회해 OAI-Sites-Authorization: Bearer <token> 헤더로 해당 Site 원점에만 보낸다. 토큰은 출력하거나 저장하지 않는다. 공개 또는 공유 대상으로 변경되었다면 이 writer를 사용하지 말고 권한 설계 보완이 필요하다고 보고한다.',
 read:'GET /api/briefings 로 기존 날짜와 내용을 읽는다. GET /api/workflow 로 이 지침 및 입력 스키마를 읽는다.',
 write:'POST /api/briefings 에 JSON 객체 1개를 보낸다. date는 실행 시점 한국 날짜, checkedAt은 실제 확인 완료 시각(ISO 8601). 같은 날짜는 upsert되어 중복되지 않고 과거 날짜는 보존된다. 소식이 없으면 stories=[] 및 새로 확인된 주요 소식 없음이라는 headline, 조사 범위를 coverageNote에 쓴다. 검색 실패를 소식 없음으로 처리하지 않는다. 일부 출처 실패는 coverageNote에 명시하고 전부 실패하면 기존 날짜를 덮어쓰지 않는다.',
 verify:'POST 응답의 persisted와 GET /api/briefings의 해당 날짜를 비교하여 저장을 확인한다. 실패 시 같은 date로 한 번만 재시도하고 여전히 실패하면 기존 데이터를 보존한 채 보고한다. 콘텐츠 갱신에 소스 수정이나 재배포는 필요 없다.',
 schema:{date:'YYYY-MM-DD',checkedAt:'ISO 8601 with offset',headline:'string <=160',intro:'string <=600',highlights:'string[] <=5',coverageNote:'string <=1200',stories:[{id:'unique string <=100',category:'official | patch | community',region:'KR | GLOBAL',status:'확인됨 | 유저 의견 | 보도·추가 확인',title:'string <=200',summary:'string <=1200',impact:'string <=600',source:'string <=120',url:'https:// source URL',published:'YYYY-MM-DD source publication date or null if unverified',details:'string[] <=8'}]}
};
