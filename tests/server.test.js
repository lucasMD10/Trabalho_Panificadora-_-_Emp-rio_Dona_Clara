const {test}=require('node:test');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const fs=require('node:fs');const os=require('node:os');const path=require('node:path');const crypto=require('node:crypto');
test('API centraliza encomenda, protege gestão e persiste dados',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dc-api-')),password=crypto.randomBytes(20).toString('hex'),base='http://127.0.0.1:3190';
 let server;
 async function start(){server=spawn(process.execPath,['server.js'],{cwd:path.join(__dirname,'..'),env:{...process.env,PORT:'3190',DATA_DIR:dir,ADMIN_PASSWORD:password},stdio:'ignore'});for(let i=0;i<50;i++){try{if((await fetch(base+'/api/config')).ok)return}catch{}await new Promise(r=>setTimeout(r,50))}throw Error('Servidor não iniciou')}
 async function stop(){const current=server;await new Promise(resolve=>{current.once('exit',resolve);current.kill()})}
 async function post(route,data,cookie){return fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:JSON.stringify(data)})}
 try{
  await start();assert.equal((await fetch(base+'/api/admin/orders')).status,401);
  const date=new Date(Date.now()+4*86400000).toISOString().slice(0,10);
  const response=await post('/api/orders',{nome:'Cliente Teste',telefone:'41999999999',data:date,hora:'10:00',items:[{id:'bolo',quantity:2,option:'Laranja'}],total:1});
  assert.equal(response.status,201);const order=await response.json();assert.equal(order.total,11600);
  assert.equal((await(await fetch(base+'/api/products')).json()).find(p=>p.id==='bolo').stock,10);
  assert.equal((await(await fetch(base+'/api/order/'+order.token)).json()).id,order.id);
  assert.equal((await fetch(base+'/data/store.json')).status,404);
  assert.equal((await post('/api/admin/status',{id:order.id,status:'Confirmado'})).status,401);
  const login=await post('/api/login',{password});assert.equal(login.status,200);const cookie=login.headers.get('set-cookie').split(';')[0];
  assert.equal((await post('/api/admin/status',{id:order.id,status:'Confirmado'},cookie)).status,200);
  await stop();await start();assert.equal((await(await fetch(base+'/api/order/'+order.token)).json()).status,'Confirmado');
  const again=await post('/api/login',{password}),newCookie=again.headers.get('set-cookie').split(';')[0];
  await post('/api/admin/status',{id:order.id,status:'Cancelado'},newCookie);
  assert.equal((await(await fetch(base+'/api/products')).json()).find(p=>p.id==='bolo').stock,12);
 }finally{if(server&&!server.killed)await stop();fs.rmSync(dir,{recursive:true,force:true})}
});
