// Tombstone for the old gatsby-plugin-offline service worker.
//
// The blog used to run on Gatsby, which registered a precaching worker at this
// path. Browsers that visited back then still have it installed and keep
// serving the cached Gatsby shell instead of the Astro site, rendering a blank
// page. This no-op worker takes over that registration, drops the caches and
// unregisters itself.
//
// Safe to delete once traffic from those browsers has stopped.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();

      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.navigate(client.url));
    })(),
  );
});
