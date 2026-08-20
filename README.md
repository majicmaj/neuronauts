<img alt="Neuronauts logo" height="64" width="64" src="https://github.com/majicmaj/neuronauts/blob/main/public/android-chrome-192x192.png?raw=true">

# Neuronauts

A cooperative, real-time semantic word game. A crew shares guesses, charts them around a hidden target in vector space, and tries to find the target word together.

Production: <https://semantle.netlify.app>

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

Netlify builds `main` and publishes `dist/`. `VITE_API_URL` is a build-time variable and must point at the public backend.
