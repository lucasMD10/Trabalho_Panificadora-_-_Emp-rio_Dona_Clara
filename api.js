window.DonaAPI={
 mode:'local',
 async init(){try{const r=await fetch('api/config');if(r.ok&&(await r.json()).mode==='server')this.mode='server'}catch{}
 if(this.mode==='local'&&!localStorage.getItem('dc-store-v1')){const products=await(await fetch('catalog.json')).json();localStorage.setItem('dc-store-v1',JSON.stringify({products,orders:[]}))}return this.mode},
 store(){return JSON.parse(localStorage.getItem('dc-store-v1'))},
 save(db){localStorage.setItem('dc-store-v1',JSON.stringify(db))},
 async request(route,data){const r=await fetch('api/'+route,{method:data?'POST':'GET',headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined});const result=await r.json();if(!r.ok)throw Error(result.error||'Falha ao conectar.');return result},
 async products(){return this.mode==='server'?this.request('products'):this.store().products},
 async create(input){if(this.mode==='server')return this.request('orders',input);const db=this.store(),order=DonaDomain.validateOrder(input,db.products);Object.assign(order,{id:'DC-'+crypto.randomUUID().slice(0,8).toUpperCase(),token:crypto.randomUUID(),createdAt:new Date().toISOString()});order.items.forEach(i=>db.products.find(p=>p.id===i.id).stock-=i.quantity);db.orders.unshift(order);this.save(db);return order},
 async order(token){if(this.mode==='server')return this.request('order/'+encodeURIComponent(token));const order=this.store().orders.find(o=>o.token===token);if(!order)throw Error('Pedido não encontrado neste navegador.');return order},
 async orders(){return this.mode==='server'?this.request('admin/orders'):this.store().orders},
 async login(password){if(this.mode==='server')return this.request('login',{password});return {ok:true}},
 async logout(){if(this.mode==='server')return this.request('logout',{})},
 async status(id,status){if(this.mode==='server')return this.request('admin/status',{id,status});const db=this.store(),order=db.orders.find(o=>o.id===id);DonaDomain.setStatus(order,status,db.products);this.save(db);return order},
 async stock(id,stock){if(this.mode==='server')return this.request('admin/stock',{id,stock});if(!Number.isInteger(stock)||stock<0||stock>10000)throw Error('Quantidade inválida.');const db=this.store();db.products.find(p=>p.id===id).stock=stock;this.save(db)}
};
