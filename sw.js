const staticCacheName = "site-static";
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    '/https://fonts.googleapis/icon?family=Materialize+Icons',
];

//Install event - service worker
self.addEventListener('install', (event) => {
    //console.log('service worker as been installed', event);
    caches.open(staticCacheName).then((cache)=>{
        cache.addAll()
    }).catch((err)=>{

    })
});

//Activate service worker - litsining to the activating event(activate event)
self.addEventListener('activate', (event) => {
    //console.log('service worker has been activated', event);
});

//fetch event
self.addEventListener('fetch', (event) => {
    //console.log('fetch event', event);
});