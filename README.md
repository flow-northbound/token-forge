# ⚒︎ \* UI Token Forge

> **UI Token Forge** - A tool to generate base UI design tokens, based on choices of colors and fonts, following the principles from the Practical UI design book. The tool will output an overview, Figma file, and CSS for a React web app.

## how to use the tool

1. **Choose Colors**: Select your primary and secondary colors.
2. **Select Fonts**: Pick your preferred font families for headings and body text.
3. **Select component styles**: Define the radius and spacing styles for your UI components, including buttons, inputs, and cards. Preview the styles as you make changes.
4. **Generate Tokens**: Click the "Generate Tokens" button to create your design tokens.

## Getting Started

This project uses [Next.js](https://nextjs.org/) and [Shadcn UI](https://ui.shadcn.com/). It is designed to be a starting point for building modern web applications with a focus on design systems.

## Installation

To get started, clone the repository and install the dependencies:

```bash
corepack enable pnpm
corepack use pnpm@latest
pnpm install
```

## Development

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
