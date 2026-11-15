const CACHE='game-making-tools-pwa-v2';
const ASSETS=[
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon.svg","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png",
  "./browser-utils.js",
  "./pixel_grid_editor_v10_scriptable.html",
  "./%E8%89%B2%E5%A1%97%E3%82%8B%E5%90%9B.html",
  "./%E9%AA%A8%E7%B5%84%E3%81%BF%E3%81%8F%E3%82%93.html",
  "./%E7%AB%8B%E3%81%A1%E7%B5%B5-%E3%83%89%E3%83%83%E3%83%88%E5%A4%89%E6%8F%9B.html",
  "./png%E3%81%AE%E8%83%8C%E6%99%AF%E3%82%92%E9%80%8F%E9%81%8E.html",
  "./JS%E3%81%8F%E3%82%93.html",
  "./%E3%83%AA%E3%82%BD%E3%83%BC%E3%82%B9%E3%81%8F%E3%82%93.html",
  "./%E3%81%BE%E3%81%A8%E3%82%81%E3%81%A6%E3%83%AA%E3%83%8D%E3%83%BC%E3%83%A0%E4%BF%9D%E5%AD%98.html"
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('game-making-tools-pwa-')&&key!==CACHE).map(key=>caches.delete(key)))),self.clients.claim()]));});
self.addEventListener('fetch',event=>{const request=event.request;if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;if(!request.url.startsWith(self.registration.scope))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);if(request.mode==='navigate'){try{const r=await fetch(request);if(r.ok)cache.put(request,r.clone());return r;}catch{return(await cache.match(request))||(await cache.match('./index.html'))||Response.error();}}const cached=await cache.match(request);if(cached)return cached;try{const r=await fetch(request);if(r.ok)cache.put(request,r.clone());return r;}catch{return Response.error();}})());});