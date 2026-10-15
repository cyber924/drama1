const assert=require('node:assert/strict');
process.env.VERCEL='1';process.env.VERCEL_URL='private-preview.example.vercel.app';process.env.NODE_ENV='production';
const imported=require('../dist/server.cjs'),app=imported.default||imported;
const origin='https://dramahub.co.kr';
(async()=>{
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base='http://127.0.0.1:'+server.address().port;
 try{
  const home=await fetch(base);assert.equal(home.status,200);const html=await home.text();assert.match(html,/<link rel="canonical" href="https:\/\/dramahub.co.kr\/"/);assert.match(html,/<meta property="og:type" content="website"/);assert.ok(!html.includes(process.env.VERCEL_URL));
  const detailPaths=[...new Set([...html.matchAll(/<a[^>]+href="(\/blog\/[^\"]+)"/g)].map(m=>m[1]))];assert.ok(detailPaths.length>0);console.log('PASS initial HTML:',detailPaths.length,'article links');
  const r=await fetch(base+'/sitemap.xml');assert.equal(r.status,200);const xml=await r.text(),urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);assert.equal(urls.length,detailPaths.length+1);assert.ok(urls.every(u=>u.startsWith(origin+'/')));assert.deepEqual(new Set(urls.slice(1).map(u=>new URL(u).pathname)),new Set(detailPaths));console.log('PASS sitemap:',urls.length,'URLs, complete match with list, only production domain');
  const robots=await(await fetch(base+'/robots.txt')).text();assert.match(robots,/Sitemap: https:\/\/dramahub.co.kr\/sitemap.xml/);
  for(const path of [detailPaths[0],detailPaths.at(-1)]){
   const r=await fetch(base+path);assert.equal(r.status,200);const s=await r.text();assert.ok(s.includes('href="'+origin+path+'"'));assert.ok(s.includes('<h1'));assert.ok(s.includes('"BlogPosting"'));assert.ok(s.includes('"BreadcrumbList"'));assert.ok(!s.includes(process.env.VERCEL_URL));for(const match of s.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)){const d=JSON.parse(match[1]);if(d.mainEntityOfPage)assert.equal(d.mainEntityOfPage['@id'],origin+path);}console.log('PASS detail metadata/body/schema:',path);
  }
  for(const path of ['/unknown-seo-test','/blog/nonexistent-domain-test','/blog/a/nested']){const r=await fetch(base+path);assert.equal(r.status,404,path);const s=await r.text();assert.match(s,/noindex/);assert.ok(!s.includes('rel="canonical"'));}console.log('PASS missing article and unknown routes: true 404 with noindex');
  let red=await fetch(base+'/blog',{redirect:'manual'});assert.equal(red.status,308);assert.equal(red.headers.get('location'),'/');
  red=await fetch(base+'/blog?source=old',{headers:{'X-Forwarded-Host':'www.dramahub.co.kr'},redirect:'manual'});assert.equal(red.status,308);assert.equal(red.headers.get('location'),origin+'/blog?source=old');
  process.env.DRAMA_REDIRECT_LEGACY='1';red=await fetch(base+detailPaths[0]+'?from=old',{headers:{'X-Forwarded-Host':'drama1-brown.vercel.app'},redirect:'manual'});assert.equal(red.status,308);assert.equal(red.headers.get('location'),origin+detailPaths[0]+'?from=old');delete process.env.DRAMA_REDIRECT_LEGACY;
  console.log('PASS www and opt-in legacy redirects preserve path/query; /blog duplicate consolidated');
 }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
})().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
