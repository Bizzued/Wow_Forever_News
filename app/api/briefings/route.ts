import { env } from 'cloudflare:workers';
import { z } from 'zod';
export const dynamic = 'force-dynamic';
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const safeUrl=z.string().url().refine(v=>v.startsWith('https://'));
const schema=z.object({date,checkedAt:z.string().datetime({offset:true}),headline:z.string().min(1).max(160),intro:z.string().max(600),highlights:z.array(z.string().max(500)).max(5),coverageNote:z.string().max(1200),stories:z.array(z.object({id:z.string().min(1).max(100),category:z.enum(['official','patch','community']),region:z.enum(['KR','GLOBAL']),status:z.enum(['확인됨','유저 의견','보도·추가 확인']),title:z.string().min(1).max(200),summary:z.string().max(1200),impact:z.string().max(600),source:z.string().max(120),url:safeUrl,published:date.nullable(),details:z.array(z.string().max(1000)).max(8)})).max(24)}).refine(d=>new Set(d.stories.map(s=>s.id)).size===d.stories.length,'Duplicate story ids');
export async function GET(){
 try { if(!env.DB) throw new Error('Database unavailable');
 const result=await env.DB.prepare('SELECT payload FROM briefings ORDER BY date DESC LIMIT 365').all<{payload:string}>();
 return Response.json({briefings:result.results.map(r=>JSON.parse(r.payload))},{headers:{'Cache-Control':'no-store'}});
 } catch {return Response.json({error:'요약 기록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'},{status:503});}
}
// This shared writer relies on the confirmed owner-private Sites dispatch boundary.
// Before changing the Site audience, introduce explicit writer authorization.
export async function POST(request:Request){
 try {
 if(request.headers.get('origin') && new URL(request.headers.get('origin')!).origin!==new URL(request.url).origin) return Response.json({error:'Origin rejected'},{status:403});
 if(Number(request.headers.get('content-length')||0)>150000) return Response.json({error:'Too large'},{status:413});
 const text=await request.text();if(text.length>150000)return Response.json({error:'Too large'},{status:413});
 const data=schema.parse(JSON.parse(text));
 if(!env.DB) throw new Error('Database unavailable');
 await env.DB.prepare('INSERT INTO briefings (date,payload,updated_at) VALUES (?,?,?) ON CONFLICT(date) DO UPDATE SET payload=excluded.payload,updated_at=excluded.updated_at').bind(data.date,JSON.stringify(data),new Date().toISOString()).run();
 const row=await env.DB.prepare('SELECT payload FROM briefings WHERE date=?').bind(data.date).first<{payload:string}>();
 return Response.json({ok:true,date:data.date,storyCount:data.stories.length,persisted:JSON.parse(row!.payload)});
 }catch(error){if(error instanceof z.ZodError || error instanceof SyntaxError)return Response.json({error:'Invalid briefing',details:error instanceof z.ZodError?error.issues:undefined},{status:400});return Response.json({error:'Storage failed'},{status:503});}
}
