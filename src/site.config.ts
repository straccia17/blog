import type { SiteConfig } from '~/types'

const config: SiteConfig = {
  site: 'https://blog.straccia17.com',
  title: 'Carlo Straccialini',
  description: 'Essays on frontend architecture, compilers, reactivity, and the web.',
  author: 'Carlo Straccialini',
  authorHandle: 'straccia17',
  tags: ['JavaScript', 'Frontend Architecture', 'Compilers', 'Reactivity'],
  // Add a square JPEG path here when an avatar is available.
  socialCardAvatarImage: '',
  // Font imported from @fontsource or elsewhere, used for the entire site.
  // To change this see src/styles/global.css and import a different font.
  font: 'JetBrains Mono Variable',
  // For pagination, the number of posts to display per page.
  // The homepage will display half this number in the "Latest Posts" section.
  pageSize: 6,
  // Whether Astro should resolve trailing slashes in URLs or not.
  // This value is used in the astro.config.mjs file and in the "Search" component to make sure pagefind links match this setting.
  // It is not recommended to change this, since most links existing in the site currently do not have trailing slashes.
  trailingSlashes: false,
  // The navigation links to display in the header.
  navLinks: [
    {
      name: 'Home',
      url: '/',
    },
    {
      name: 'Archive',
      url: '/posts',
    },
    {
      name: 'About',
      url: '/about',
    },
  ],
  // The theming configuration for the site.
  themes: {
    // The theming mode. One of "single" | "select" | "light-dark-auto".
    mode: 'light-dark-auto',
    // The default theme identifier, used when themeMode is "select" or "light-dark-auto".
    // Make sure this is one of the themes listed in `themes` or "auto" for "light-dark-auto" mode.
    default: 'auto',
    // Shiki themes to bundle with the site.
    // https://expressive-code.com/guides/themes/#using-bundled-themes
    // These will be used to theme the entire site along with syntax highlighting.
    // To use light-dark-auto mode, only include a light and a dark theme in that order.
    // include: [
    //   'github-light',
    //   'github-dark',
    // ]
    include: ['github-light', 'github-dark'],
    // Optional overrides for specific themes to customize colors.
    // Their values can be either a literal color (hex, rgb, hsl) or another theme key.
    // See themeKeys list in src/types.ts for available keys to override and reference.
    overrides: {
      'github-light': {
        background: '#f7f8fc',
        foreground: '#30354a',
        accent: '#6877a8',
        heading1: '#30354a',
        heading2: '#3f4968',
        heading3: '#536184',
        heading4: '#536184',
        heading5: '#536184',
        heading6: '#536184',
        link: '#58699b',
        list: '#8a77a8',
        separator: '#dfe3ef',
      },
      'github-dark': {
        background: '#171922',
        foreground: '#e5e7f0',
        accent: '#aeb9e7',
        heading1: '#f0f1f7',
        heading2: '#d9def3',
        heading3: '#c8d0ed',
        heading4: '#c8d0ed',
        heading5: '#c8d0ed',
        heading6: '#c8d0ed',
        link: '#b9c5f2',
        list: '#cbbbe0',
        separator: '#313544',
      },
      // Improve readability for aurora-x theme
      // 'aurora-x': {
      //   background: '#292929FF',
      //   foreground: '#DDDDDDFF',
      //   warning: '#FF7876FF',
      //   important: '#FF98FFFF',
      //   note: '#83AEFFFF',
      // },
      // Make the GitHub dark theme a little cuter
      // 'github-light': {
      //   accent: 'magenta',
      //   heading1: 'magenta',
      //   heading2: 'magenta',
      //   heading3: 'magenta',
      //   heading4: 'magenta',
      //   heading5: 'magenta',
      //   heading6: 'magenta',
      //   separator: 'magenta',
      //   link: 'list',
      // },
    },
  },
  // Social links to display in the footer.
  socialLinks: {
    github: 'https://github.com/straccia17',
    linkedin: 'https://www.linkedin.com/in/carlostraccialini/',
    rss: true, // Set to true to include an RSS feed link in the footer
  },
  // Configuration for Giscus comments.
  // To set up Giscus, follow the instructions at https://giscus.app/
  // You'll need a GitHub repository with discussions enabled and the Giscus app installed.
  // Take the values from the generated script tag at https://giscus.app and fill them in here.
  // IMPORTANT: Update giscus.json in the root of the project with your own website URL
  // If you don't want to use Giscus, set this to undefined.
  giscus: undefined,
  // These are characters available for the character chat feature.
  // To add your own character, add an image file to the top-level `/public` directory
  // Make sure to compress the image to a web-friendly size (<100kb)
  // Try using the excellent https://squoosh.app web app for creating small webp files
  characters: {},
}

export default config
