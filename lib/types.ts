export type Story = {id:string; category:'official'|'patch'|'community';region:'KR'|'GLOBAL';status:'확인됨'|'유저 의견'|'보도·추가 확인';title:string;summary:string;impact:string;source:string;url:string;published:string|null;details:string[]};
export type Briefing = {date:string;checkedAt:string;headline:string;intro:string;highlights:string[];stories:Story[];coverageNote:string;};
