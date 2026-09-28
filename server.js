const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {validateOrder,setStatus}=require('./domain');
const root=__dirname,dir=process.env.DATA_DIR||path.join(root,'data');fs.mkdirSync(dir,{recursive:true});
const file=path.join(dir,'store.json');
let db=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{products:JSON.parse(fs.readFileSync(path.join(root,'catalog.json'),'utf8')),orders:[]};
const save=()=>{fs.writeFileSync(file+'.tmp',JSON.stringify(db));fs.renameSync(file+'.tmp',file)};
const password=process.env.ADMIN_PASSWORD||crypto.randomBytes(16).toString('hex');
if(!process.env.ADMIN_PASSWORD)console.log('Senha temporária da gestão (válida até reiniciar): '+password);
const sessions=new Map(),attempts=new Map();
function reply(res,status,body){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(body))}
function body(req){return new Promise((resolve,reject)=>{let s='';req.on('data',c=>{s+=c;if(s.length>20000){reject(Error('Pedido muito grande'));req.destroy()}});req.on('end',()=>{try{resolve(JSON.parse(s||'{}'))}catch{reject(Error('JSON inválido'))}})})}
function authenticated(req){const token=(req.headers.cookie||'').match(/(?:^|; )dc_session=([^;]+)/)?.[1];return token&&sessions.get(token)>Date.now()}
const publicFiles=new Set(['index.html','styles.css','script.js','catalog.json','domain.js','api.js','admin.html','admin.js','assets/favicon.svg','docs/wireframe.svg']);
const server=http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Frame-Options','DENY');
 try{
  const url=new URL(req.url,'http://localhost'),route=url.pathname;
  if(route.startsWith('/api/')&&req.method!=='GET'&&req.headers.origin){if(new URL(req.headers.origin).host!==req.headers.host)return reply(res,403,{error:'Origem não permitida.'})}
  if(route==='/api/config')return reply(res,200,{mode:'server'});
  if(route==='/api/products'&&req.method==='GET')return reply(res,200,db.products);
  if(route==='/api/login'&&req.method==='POST'){
   const ip=req.socket.remoteAddress,a=attempts.get(ip)||{n:0,at:Date.now()};if(Date.now()-a.at>900000){a.n=0;a.at=Date.now()}
   if(a.n>=10)return reply(res,429,{error:'Muitas tentativas. Tente novamente em 15 minutos.'});
   const data=await body(req);const hash=x=>crypto.createHash('sha256').update(x).digest();
   if(!crypto.timingSafeEqual(hash(String(data.password||'')),hash(password))){a.n++;attempts.set(ip,a);return reply(res,401,{error:'Senha incorreta.'})}
   attempts.delete(ip);const token=crypto.randomBytes(32).toString('hex');sessions.set(token,Date.now()+8*3600000);
   res.setHeader('Set-Cookie',`dc_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${process.env.NODE_ENV==='production'?'; Secure':''}`);return reply(res,200,{ok:true});
  }
  if(route==='/api/logout'&&req.method==='POST'){const token=(req.headers.cookie||'').match(/(?:^|; )dc_session=([^;]+)/)?.[1];sessions.delete(token);res.setHeader('Set-Cookie','dc_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');return reply(res,200,{ok:true})}
  if(route==='/api/orders'&&req.method==='POST'){
   const input=await body(req),order=validateOrder(input,db.products);
   Object.assign(order,{id:'DC-'+crypto.randomBytes(4).toString('hex').toUpperCase(),token:crypto.randomBytes(24).toString('hex'),createdAt:new Date().toISOString()});
   order.items.forEach(i=>db.products.find(p=>p.id===i.id).stock-=i.quantity);db.orders.unshift(order);save();return reply(res,201,order);
  }
  if(route.startsWith('/api/order/')&&req.method==='GET'){const token=route.split('/').pop(),order=db.orders.find(o=>o.token===token);return reply(res,order?200:404,order||{error:'Pedido não encontrado.'})}
  if(route.startsWith('/api/admin/')){
   if(!authenticated(req))return reply(res,401,{error:'Entre para acessar a gestão.'});
   if(route==='/api/admin/orders'&&req.method==='GET')return reply(res,200,db.orders);
   if(route==='/api/admin/status'&&req.method==='POST'){const data=await body(req),order=db.orders.find(o=>o.id===data.id);if(!order)throw Error('Pedido não encontrado.');setStatus(order,data.status,db.products);save();return reply(res,200,order)}
   if(route==='/api/admin/stock'&&req.method==='POST'){const data=await body(req),product=db.products.find(p=>p.id===data.id);if(!product||!Number.isInteger(data.stock)||data.stock<0||data.stock>10000)throw Error('Estoque inválido.');product.stock=data.stock;save();return reply(res,200,product)}
  }
  if(route.startsWith('/api/'))return reply(res,404,{error:'Recurso não encontrado.'});
  let name=decodeURIComponent(route).replace(/^\//,'')||'index.html';if(!publicFiles.has(name))return reply(res,404,{error:'Página não encontrada.'});
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json'};
  res.writeHead(200,{'Content-Type':(types[path.extname(name)]||'text/plain')+'; charset=utf-8'});fs.createReadStream(path.join(root,name)).pipe(res);
 }catch(e){reply(res,400,{error:e.message||'Não foi possível concluir a ação.'})}
});
server.listen(Number(process.env.PORT)||3000,()=>console.log('Dona Clara: http://localhost:'+(process.env.PORT||3000)));
