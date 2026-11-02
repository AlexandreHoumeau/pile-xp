This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Node.js and Vercel

Use Node.js 26 (`nvm install && nvm use`), then run:

```bash
npm ci
npm run lint
npm run build
```

`package.json` pins the runtime major to `26.x`; `.nvmrc` uses the same major.
Next.js 16.2.3 requires Node.js >=20.9.0, which includes Node.js 26.
The migration was checked with Node.js 26.13.0 and npm 11.20.0:
installation, ESLint, compilation and TypeScript passed. The full build was
blocked at page-data collection because Supabase configuration was absent
(`supabaseUrl is required`). Authenticated and database-backed behavior still
requires validation with the actual environment configuration.

In Vercel Project Settings, check that Node.js Version is **26.x**, and that
any build/install command override uses `npm run build` / `npm ci` without
pinning an older Node version. Verify the target branch and Root Directory
point to this project. Preserve the existing Supabase and session environment
variables for the relevant Preview/Production environments:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY` (server only), and `SESSION_SECRET`.
Never commit their values. After these settings and this commit are available,
redeploy and verify the full build and application flows. No Vercel settings
or deployments were changed by this migration.
