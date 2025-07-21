# ⤧ Northbound • next.js starter

> **NB** is a simple template built with next.js and other modern technologies. it's designed for developers who want a fast, modern, and scalable foundation without reinventing the backend.

## stack

1. 🧱 **core**: [nextjs 15.3](https://nextjs.org) + [react 19.1](https://react.dev) + [ts 5.8](https://typescriptlang.org)
2. 🎨 **ui**: [tailwind 4.1](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
3. 🔒 **auth**: [better-auth](https://better-auth.com)
4. 🎬 **anims**: N/A
5. 📦 **storage**: N/A
6. 📊 **analytics**: [vercel](https://vercel.com/docs/analytics)
7. 🧬 **db**: [drizzle-orm](https://orm.drizzle.team) ([pg](https://neon.tech/postgresql/tutorial)) + [neon](https://neon.tech)/(🤔🔜)[supabase](https://supabase.com)
8. 🏗️ **dx**: [eslint](https://eslint.org) + [biome](https://biomejs.dev) + [knip](https://knip.dev)
9. 📝 **forms**: N/A
10. 📅 **tables**: N/A
11. 🌐 **i18n**: N/A
12. 💌 **email**: N/A
13. 💳 **payments**: N/A

## quick start

1. install [git](https://git-scm.com), [node.js](https://nodejs.org), [corepack](https://github.com/nodejs/corepack)
2. Create a next app:

```
npx create-next-app@latest --example "https://github.com/flow-northbound/nb-next-starter" [my-app-name]
```

3. Change directory:

```cd [my-app-name]

```

4. Install dependencies:

```bash
corepack enable pnpm
corepack use pnpm@latest
pnpm install
```

### commands

| command          | description                |
| ---------------- | -------------------------- |
| `pnpm dev`       | start local development    |
| `pnpm build`     | create a production build  |
| `pnpm latest`    | install latest deps        |
| `pnpm ui`        | add shadcn components      |
| `pnpm db:push`   | apply db schema changes    |
| `pnpm db:auth`   | update auth-related tables |
| `pnpm db:studio` | open visual db editor      |
