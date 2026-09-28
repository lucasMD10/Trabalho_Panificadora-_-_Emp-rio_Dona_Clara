// Dados ilustrativos para demonstrar o fluxo. Substituir após validação com a padaria.
const products = [
  {id:'paonatural',name:'Pão de fermentação natural',category:'paes',description:'Casca crocante, miolo macio e preparo com tempo.',price:24.90,color:'#e7d4b4',shape:'loaf'},
  {id:'paoqueijo',name:'Pão de queijo artesanal',category:'paes',description:'Porção com 6 unidades, quentinha para acompanhar o café.',price:18.00,color:'#e6e1c7',shape:'round'},
  {id:'bolo',name:'Bolo para compartilhar',category:'doces',description:'Uma escolha para o café da tarde ou para celebrar.',price:58.00,color:'#e8d6cc',shape:'cake',options:['Cenoura com chocolate','Laranja','Chocolate']},
  {id:'cookie',name:'Cookie da casa',category:'doces',description:'Massa macia, bordas douradas e gotas de chocolate.',price:11.90,color:'#ddd8bf',shape:'cookie'},
  {id:'tabua',name:'Tábua de frios',category:'encomendas',description:'Para dividir com calma em encontros e celebrações.',price:89.00,color:'#d8dfce',shape:'board',options:['Tradicional','Vegetariana']},
  {id:'coffee',name:'Coffee break',category:'encomendas',description:'Seleção para reuniões. Valor ilustrativo por pessoa.',price:35.00,color:'#e5ddd2',shape:'coffee',options:['Tradicional','Vegetariano']}
];
const categoryNames={paes:'Pães artesanais',doces:'Doces da casa',encomendas:'Sob encomenda'};
const formatMoney=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value);
const $=selector=>document.querySelector(selector);
const cart=new Map();
let previousFocus=null;
const artwork={
  loaf:'<ellipse cx="100" cy="102" rx="76" ry="50" fill="#a65d30"/><ellipse cx="95" cy="92" rx="70" ry="46" fill="#d6a464"/><path d="M58 57l18 24m21-31 16 27m24-14 13 19" stroke="#f5e3be" stroke-width="8" stroke-linecap="round"/>',
  round:'<circle cx="70" cy="100" r="38" fill="#c6813e"/><circle cx="127" cy="89" r="37" fill="#dea353"/><circle cx="109" cy="130" r="37" fill="#c9843f"/><path d="M49 92c9-20 22-24 37-15m26-9c12-7 23-4 30 9m-54 51c11-14 22-17 37-10" stroke="#f1cf8e" stroke-width="5" fill="none" stroke-linecap="round"/>',
  cake:'<path d="M30 101h140l-12 57H42z" fill="#b76a3f"/><path d="M30 102c0-24 22-38 70-38s70 14 70 38c-16 15-24 2-37 8-20 12-28-6-48 4-17 10-29-11-55-12" fill="#f5dfb9"/><path d="M44 154h112" stroke="#f2c89e" stroke-width="7"/>',
  cookie:'<circle cx="100" cy="100" r="72" fill="#b57641"/><circle cx="100" cy="94" r="68" fill="#d6a26a"/><g fill="#70452e"><circle cx="58" cy="77" r="9"/><circle cx="126" cy="57" r="8"/><circle cx="103" cy="103" r="11"/><circle cx="143" cy="120" r="7"/><circle cx="75" cy="135" r="8"/></g>',
  board:'<rect x="18" y="40" width="164" height="125" rx="19" fill="#865537"/><rect x="27" y="47" width="146" height="110" rx="15" fill="#b78658"/><circle cx="70" cy="93" r="25" fill="#f6d28d"/><circle cx="133" cy="86" r="24" fill="#bd6452"/><path d="M79 131c20-24 45-23 66-1" stroke="#efdfad" stroke-width="13" fill="none"/><circle cx="119" cy="114" r="8" fill="#697d4b"/>',
  coffee:'<path d="M42 69h104l-10 86H54z" fill="#f7eed8"/><path d="M47 70h94v15H47z" fill="#ad6e43"/><path d="M150 91c37-4 34 37-8 39" fill="none" stroke="#f7eed8" stroke-width="13"/><path d="M75 46c-11-14 7-17-1-28m29 28c-11-14 7-17-1-28" fill="none" stroke="#fff9ec" stroke-width="6" stroke-linecap="round"/>'
};
function renderProducts(filter='todos'){
  const visible=products.filter(p=>filter==='todos'||p.category===filter);
  $('#product-grid').innerHTML=visible.map(p=>`<article class="product"><div class="product-visual" style="--tile:${p.color}"><svg viewBox="0 0 200 200" aria-hidden="true">${artwork[p.shape]}</svg></div><div class="product-body"><span class="product-tag">${categoryNames[p.category]}</span><h3>${p.name}</h3><p>${p.description}</p>${p.options?`<label>Escolha uma opção<select aria-label="Opção para ${p.name}" data-option="${p.id}">${p.options.map(o=>`<option>${o}</option>`).join('')}</select></label>`:''}<div class="product-bottom"><strong>${formatMoney(p.price)}</strong><button class="add-button" type="button" data-add="${p.id}" aria-label="Adicionar ${p.name} ao pedido">Adicionar +</button></div></div></article>`).join('');
}
function addProduct(id){
  const product=products.find(p=>p.id===id);
  const option=$(`[data-option="${id}"]`)?.value||'';
  const key=`${id}:${option}`;
  const item=cart.get(key)||{product,option,quantity:0};
  item.quantity+=1;cart.set(key,item);renderCart();
  const button=$(`[data-add="${id}"]`);if(button){button.textContent='Adicionado ✓';setTimeout(()=>{if(button.isConnected)button.textContent='Adicionar +'},1200)}
}
function renderCart(){
  const items=[...cart.entries()];
  const count=items.reduce((sum,[,item])=>sum+item.quantity,0);
  $('#bag-count').textContent=count;
  $('#open-bag').setAttribute('aria-label',`Abrir pedido, ${count} ${count===1?'item':'itens'}`);
  $('#cart-empty').hidden=count>0;$('#order-form').hidden=count===0;
  $('#cart-items').innerHTML=items.map(([key,item])=>`<div class="cart-row"><div><strong>${item.product.name}</strong>${item.option?`<small>${item.option}</small>`:''}<small>${formatMoney(item.product.price)} cada</small></div><div class="cart-controls"><button type="button" data-change="${key}" data-delta="-1" aria-label="Remover uma unidade de ${item.product.name}">−</button><span>${item.quantity}</span><button type="button" data-change="${key}" data-delta="1" aria-label="Adicionar uma unidade de ${item.product.name}">+</button></div></div>`).join('')+(count?`<div class="cart-total"><span>Total estimado</span><span>${formatMoney(items.reduce((sum,[,item])=>sum+item.product.price*item.quantity,0))}</span></div>`:'');
}
function openDrawer(){previousFocus=document.activeElement;$('#drawer-backdrop').hidden=false;$('#order-drawer').inert=false;$('#order-drawer').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('#close-bag').focus()}
function closeDrawer(){$('#order-drawer').setAttribute('aria-hidden','true');$('#order-drawer').inert=true;$('#drawer-backdrop').hidden=true;document.body.style.overflow='';previousFocus?.focus()}
function buildSummary(form){
  const data=new FormData(form);
  const date=new Date(`${data.get('data')}T12:00:00`).toLocaleDateString('pt-BR');
  const lines=[...cart.values()].map(item=>`• ${item.quantity}× ${item.product.name}${item.option?` (${item.option})`:''} — ${formatMoney(item.product.price*item.quantity)}`);
  const total=[...cart.values()].reduce((sum,item)=>sum+item.product.price*item.quantity,0);
  return [`SOLICITAÇÃO DE PRÉ-ENCOMENDA — DONA CLARA`,`Nome: ${data.get('nome').trim()}`,`Contato: ${data.get('telefone').trim()}`,`Retirada desejada: ${date} às ${data.get('hora')}`,``,`Itens:`,...lines,``,`Total estimado: ${formatMoney(total)}`,`Observações: ${data.get('observacoes').trim()||'Nenhuma'}`,``,`Aguardando confirmação de disponibilidade, valor e horário.`].join('\n');
}
document.addEventListener('click',event=>{
  const add=event.target.closest('[data-add]');if(add){addProduct(add.dataset.add);return}
  const change=event.target.closest('[data-change]');if(change){const item=cart.get(change.dataset.change);if(!item)return;item.quantity+=Number(change.dataset.delta);if(item.quantity<=0)cart.delete(change.dataset.change);renderCart();return}
  const filter=event.target.closest('[data-filter]');if(filter){document.querySelectorAll('.filter').forEach(b=>{const selected=b===filter;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))});renderProducts(filter.dataset.filter)}
});
$('#open-bag').addEventListener('click',openDrawer);
$('#close-bag').addEventListener('click',closeDrawer);
$('#drawer-backdrop').addEventListener('click',closeDrawer);
$('#empty-link').addEventListener('click',closeDrawer);
document.addEventListener('keydown',event=>{if($('#order-drawer').getAttribute('aria-hidden')==='true')return;if(event.key==='Escape')closeDrawer();if(event.key==='Tab'){const focusable=[...$('#order-drawer').querySelectorAll('button:not([hidden]),a[href],input:not([hidden]),textarea:not([hidden]),select:not([hidden])')].filter(el=>el.offsetParent!==null);const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}});
$('#order-form').addEventListener('submit',async event=>{event.preventDefault();const summary=buildSummary(event.currentTarget);try{await navigator.clipboard.writeText(summary);$('#form-status').textContent='Resumo copiado. Esta demonstração não envia pedidos à padaria.'}catch{const status=$('#form-status');status.textContent='Cópia automática indisponível. Selecione e copie o resumo abaixo:';const area=document.createElement('textarea');area.value=summary;area.readOnly=true;area.rows=9;area.setAttribute('aria-label','Resumo do pedido para copiar');status.after(area);area.focus();area.select()}});
const today=new Date();const localDate=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
$('#order-form [name="data"]').min=localDate;
$('#year').textContent=today.getFullYear();
renderProducts();renderCart();
