(function(root){
const statuses=['Recebido','Confirmado','Em preparo','Pronto','Retirado','Cancelado'];
function validateOrder(input,products,now=Date.now()){
 if(!input||typeof input!=='object')throw Error('Pedido inválido.');
 const name=String(input.nome||'').trim(),phone=String(input.telefone||'').replace(/\D/g,'');
 if(name.length<2||name.length>80)throw Error('Informe seu nome completo.');
 if(phone.length<10||phone.length>13)throw Error('Informe um telefone válido com DDD.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(input.data)||!/^\d{2}:\d{2}$/.test(input.hora))throw Error('Informe data e horário válidos.');
 const pickup=Date.parse(input.data+'T'+input.hora+':00-03:00');
 if(!Number.isFinite(pickup)||new Date(pickup).toISOString().slice(0,10)!==input.data)throw Error('Data inválida.');
 const weekday=new Date(input.data+'T12:00:00-03:00').getUTCDay();
 if(input.hora<'07:00'||input.hora>(weekday===0?'13:00':'19:00'))throw Error('Retirada: segunda a sábado, 7h às 19h; domingo, 7h às 13h.');
 if(!Array.isArray(input.items)||!input.items.length||input.items.length>30)throw Error('Adicione produtos ao pedido.');
 const amounts={},keys=new Set();
 const items=input.items.map(line=>{
  const product=products.find(p=>p.id===line.id);
  if(!product||!Number.isInteger(line.quantity)||line.quantity<1||line.quantity>100)throw Error('Quantidade ou produto inválido.');
  if(line.quantity<product.minQty)throw Error(product.name+': quantidade mínima de '+product.minQty+'.');
  const option=String(line.option||'');
  if(product.options.length?!product.options.includes(option):option!=='')throw Error('Escolha uma opção válida.');
  const key=product.id+':'+option;if(keys.has(key))throw Error('Item repetido.');keys.add(key);
  amounts[product.id]=(amounts[product.id]||0)+line.quantity;
  if(amounts[product.id]>product.stock)throw Error(product.name+': quantidade indisponível.');
  if(pickup<now+product.leadHours*3600000)throw Error(product.name+': peça com pelo menos '+product.leadHours+' horas de antecedência.');
  return {id:product.id,name:product.name,option,quantity:line.quantity,cents:product.cents};
 });
 const notes=String(input.observacoes||'').trim();if(notes.length>350)throw Error('Observações: máximo de 350 caracteres.');
 return {nome:name,telefone:phone,data:input.data,hora:input.hora,observacoes:notes,items,total:items.reduce((sum,i)=>sum+i.cents*i.quantity,0),status:'Recebido'};
}
function setStatus(order,next,products){
 const allowed={'Recebido':['Confirmado','Cancelado'],'Confirmado':['Em preparo','Cancelado'],'Em preparo':['Pronto','Cancelado'],'Pronto':['Retirado','Cancelado'],'Retirado':[],'Cancelado':[]};
 if(!allowed[order.status]?.includes(next))throw Error('Mudança de status inválida.');
 if(next==='Cancelado')order.items.forEach(i=>{const p=products.find(p=>p.id===i.id);if(p)p.stock+=i.quantity});
 order.status=next;return order;
}
const api={validateOrder,setStatus,statuses};if(typeof module!=='undefined')module.exports=api;else root.DonaDomain=api;
})(typeof window!=='undefined'?window:globalThis);
