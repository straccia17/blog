# Carlo Straccialini's blog

A technical blog about frontend architecture, compilers, reactivity, and web performance. Built with Astro.

## Development

```bash
npm install
npm run dev
```

Create posts in `src/content/posts`. Site metadata, navigation, and social links live in `src/site.config.ts`.

## Deployment

The site is deployed to Cloudflare Pages from the `main` branch. Configure the project with:

- Build command: `npm run build`
- Build output directory: `dist`

The production URL is `https://blog.straccia17.com`.

### Custom domain and DNS

The `straccia17.com` zone is managed by Cloudflare, while the domain registration and email service remain with Aruba.

In the Cloudflare Pages project, add `blog.straccia17.com` under **Custom domains**. Its DNS record must be:

- `CNAME` `blog` &rarr; `carlo-straccialini-blog.pages.dev` (proxied)

Do not change the apex (`straccia17.com`) or `www` records for the blog. Keep Aruba mail records (MX, SPF, DMARC and the mail-related A/CNAME/SRV records) in Cloudflare and set them to **DNS only**; proxying mail records breaks email delivery.

## Licence

The original template is available under the [MIT License](LICENSE.txt).
