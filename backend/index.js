import postgres from 'postgres';
const sql=postgres(process.env.DATABASE_URL,{ssl:'require'});
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,OPTIONS','Access-Control-Allow-Headers':'content-type,x-app-secret','Content-Type':'application/json'};
const text=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:cors});
export default async function handler(req){
  if(req.method==='OPTIONS')return new Response('',{headers:cors});
  if(req.headers.get('x-app-secret')!==process.env.APP_SECRET)return text({error:'forbidden'},403);
  const id=process.env.STATE_ID;
  if(!id)return text({error:'misconfigured'},500);
  if(req.method==='GET'){const [r]=await sql`select data,updated_at from trip_state where trip_id=${id}`;return r?text(r):text({error:'not_found'},404);}
  if(req.method==='PUT'){const data=await req.json();const [r]=await sql`insert into trip_state(trip_id,data,updated_at) values (${id},${sql.json(data)},now()) on conflict(trip_id) do update set data=excluded.data,updated_at=now() returning data,updated_at`;return text(r);}
  return new Response('',{status:405,headers:cors});
}
