const {chromium}=require('playwright');
const {spawn}=require('node:child_process');const fs=require('node:fs');const os=require('node:os');const path=require('node:path');const crypto=require('node:crypto');const assert=require('node:assert/strict');
(async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dc-test-')),password=crypto.randomBytes(20).toString('hex');
 const server=spawn(process.execPath,['server.js'],{env:{...process.env,PORT:'3189',DATA_DIR:dir,ADMIN_PASSWORD:password},stdio:'ignore'});
 let browser;
 try{
  for(let i=0;i<50;i++){try{if((await fetch('http://localhost:3189/api/config')).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
  browser=await chromium.launch();const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:1440,height:1000});await page.goto('http://localhost:3189');await page.locator('.product').first().waitFor();assert.equal(await page.locator('.product').count(),6);
  await page.getByRole('button',{name:'Adicionar Bolo para compartilhar ao pedido'}).click();await page.getByRole('button',{name:/Abrir pedido/}).click();
  await page.locator('[name=nome]').fill('Cliente de teste');await page.locator('[name=telefone]').fill('41999999999');
  const date=new Date(Date.now()+4*86400000).toISOString().slice(0,10);await page.locator('[name=data]').fill(date);await page.locator('[name=hora]').fill('10:00');await page.getByRole('button',{name:/Solicitar encomenda/}).click();await page.getByText('Encomenda recebida.',{exact:true}).waitFor();
  const admin=await context.newPage();await admin.goto('http://localhost:3189/admin.html');await admin.locator('#password').fill(password);await admin.getByRole('button',{name:'Entrar',exact:true}).click();await admin.locator('.admin-order').waitFor();await admin.locator('[data-status="Confirmado"]').click();await admin.locator('[data-status="Em preparo"]').waitFor();
  await page.getByRole('button',{name:'Fechar pedido'}).click();await page.locator('#refresh-orders').click();await page.getByText('Confirmado',{exact:true}).waitFor();
  fs.mkdirSync('screenshots',{recursive:true});await page.screenshot({path:'screenshots/desktop.png',fullPage:true,animations:'disabled'});await admin.screenshot({path:'screenshots/gestao.png',fullPage:true,animations:'disabled'});
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'screenshots/mobile.png',fullPage:true,animations:'disabled'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
  const local=await browser.newContext();await local.route('**/api/config',route=>route.fulfill({status:404,body:'{}'}));const localPage=await local.newPage();await localPage.goto('http://localhost:3189');await localPage.getByRole('button',{name:'Adicionar Cookie da casa ao pedido'}).click();await localPage.getByRole('button',{name:/Abrir pedido/}).click();await localPage.locator('[name=nome]').fill('Cliente local');await localPage.locator('[name=telefone]').fill('41999999999');await localPage.locator('[name=data]').fill(date);await localPage.locator('[name=hora]').fill('10:00');await localPage.getByRole('button',{name:/Solicitar encomenda/}).click();await localPage.getByText('Encomenda recebida.',{exact:true}).waitFor();await localPage.reload();await localPage.locator('.tracking-order').waitFor();const localAdmin=await local.newPage();await localAdmin.goto('http://localhost:3189/admin.html');await localAdmin.locator('[data-status="Confirmado"]').click();await localAdmin.locator('[data-status="Em preparo"]').waitFor();await localPage.locator('#refresh-orders').click();await localPage.getByText('Confirmado',{exact:true}).waitFor();await local.close();
  console.log('Fluxo centralizado e local, persistência e largura mobile: OK');
 }finally{if(browser)await browser.close();server.kill();fs.rmSync(dir,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exit(1)});
