const staticCacheName = 'site-static-v4';
const dynamicCacheName = 'site-dynamic-v4';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html'
];

//limit cache size
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
}

//Install event - service worker
self.addEventListener('install', event => {
    console.log('service worker installed');
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(assets);
        }).catch((err) => {
            console.log(err, 'error');
        })
    );
});

//Activate service worker - litsining to the activating event(activate event)
self.addEventListener('activate', (event) => {
    //console.log('service worker has been activated', event);
    event.waitUntil(
        caches.keys()
        .then((keys) => {
            //console.log(keys);
            return Promise.all(keys.filter(
                    key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )
        })
    )
});

//fetch event
self.addEventListener('fetch', (event) => {
    // console.log('fetch event', event);
    if (event.request.url.indexOf('firestore.googleapis.com') === -1) {
        event.respondWith(
            caches.match(event.request).then(cacheRes => {
                return cacheRes || fetch(event.request).then(fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(event.request.url, fetchRes.clone());
                        limitCacheSize(dynamicCacheName, 50);
                        return fetchRes;
                    })
                });
            }).catch(() => {
                if (event.request.url.indexOf('.html') > -1) {
                    return caches.match('/pages/fallback.html');
                }
            })
        )
    }
});