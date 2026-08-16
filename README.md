# Carlo Straccialini's blog

A technical blog about frontend architecture, compilers, reactivity, and web performance. Built with Astro.

## Development

```bash
npm install
npm run dev
```

Create posts in `src/content/posts`. Site metadata, navigation, and social links live in `src/site.config.ts`.

## Deployment

Use Cloudflare Workers' Git integration to deploy the `main` branch. This project is a static-assets Worker, so Astro pre-renders the entire site before deployment. Configure it with:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Build output directory: `dist`

After you add the custom domain, update `site` in `src/site.config.ts` with its canonical URL and push the change.

Keep the domain registered with Aruba. For a root domain, change the domain's authoritative nameservers at Aruba to the pair assigned by Cloudflare, then recreate the existing mail records in Cloudflare before switching. For a subdomain, leave Aruba DNS in place and create the CNAME record Cloudflare Pages supplies after you add the subdomain in the Pages dashboard.

## Licence

The original template is available under the [MIT License](LICENSE.txt).
