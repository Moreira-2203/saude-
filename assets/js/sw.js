const CACHE_NAME = 'meu-app-v1';​

const urlsToCache = [​

'/',​

'../pages/index.html',​

'../assets/css/main.css',​

'../assets/js/main.js'​

];​

​


self.addEventListener('install', event => {​

event.waitUntil(​

caches.open(CACHE_NAME)​

.then(cache => cache.addAll(urlsToCache))​

);​

});​

​



self.addEventListener('fetch', event => {​

event.respondWith(​

caches.match(event.request)​

.then(response => response || fetch(event.request))​

);​

});