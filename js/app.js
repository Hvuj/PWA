if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log(reg, 'service worker registered');
    }).catch((err) => {
        console.log(err, 'service worker not registered');
    });
}