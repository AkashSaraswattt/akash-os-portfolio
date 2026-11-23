# AKASH.OS

Akash Saraswat’s portfolio is an interactive desktop. Open the dock apps to browse projects, work experience, and contact details. Mini Me walks visitors through the dock, which also links to the Minecraft portfolio and opens a three-level Tic-Tac-Toe game.

## Run locally

Use Node.js 22 and npm.

```sh
npm ci
npm run dev
```

Open [localhost:4317](http://localhost:4317/).

## Build

```sh
npm run typecheck
npm run build
```

Next.js writes the static site to `out/`. To deploy from GitHub in Vercel, import the repository and use the Next.js framework preset. The site runs without API keys or a database.

Edit profile, experience, and project details in [`content/portfolio.ts`](content/portfolio.ts). Wallpaper, avatar, and icon assets live in [`public/assets/`](public/assets/).
