<img alt="Neuronauts logo" height="64" width="64" src="https://github.com/majicmaj/neuronauts/blob/main/public/android-chrome-192x192.png?raw=true">

# Neuronauts

A cooperative, real-time semantic word game. A crew shares guesses, charts them around a hidden target in vector space, and tries to find the target word together.

Production: <https://neuronauts.hobbyhood.app>

## Gameplay

- Every valid guess shows its cosine similarity to the target and its position on a shared semantic map.
- Guesses are attributed to unique, editable Neuronaut call signs.
- A shared hint returns the dictionary word nearest the embedding midpoint between the crew's best guess and the target. Hints have a server-enforced 60-second lobby cooldown.
- A correct guess reveals the target to everyone in the lobby with an in-page celebration.

## Local development

Requirements: Node.js 22 or newer and a running [`neuronauts-be`](https://github.com/majicmaj/neuronauts-be) server.

```bash
npm ci
cp .env.example .env
npm run dev
```

Set the backend URL in `.env`:

```dotenv
VITE_API_URL=http://localhost:3000
```

Quality checks:

```bash
npm run lint
npm run build
npm audit --omit=dev
```

## Architecture

- React 19 + TypeScript + Vite
- Tailwind CSS
- One app-wide Socket.IO connection with reconnect/rejoin behavior
- Lazy-loaded game route to keep the landing-page bundle smaller
- Server-calculated semantic positions; target embeddings never reach browsers

## Production deployment

Cloudflare Workers Static Assets serves `dist/` directly at
<https://neuronauts.hobbyhood.app>; Netlify is no longer in the request path.
The configuration lives in `wrangler.jsonc` and preserves client-side routes
such as `/game/GKG0Y0` with the SPA fallback.

After `npm ci`, authenticate with `npx wrangler login` if needed, then run:

```bash
npm test
npm run lint
npm run deploy
```

The deploy command builds with `VITE_API_URL=https://semantle.hobbyhood.app`
and publishes to the existing `neuronauts-web-edge` Worker and custom domain.
Deployment is explicit; a Git push alone does not publish a release. The
backend remains a separately deployed service, so a frontend release does
not restart the backend or clear its rooms. The old Netlify URL is a legacy
deployment and will no longer receive updates from this flow.

Cooperative missions use `PostGameRecap` for player awards and mission grades.
VS missions use the separate `VersusResults` in `VersusExperience.tsx` for
team standings and adjusted-time scoring.
