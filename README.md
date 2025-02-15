# Neuronauts

A real-time multiplayer word guessing game powered by semantic word embeddings.

<img alt="Made with React" src="https://img.shields.io/badge/React-20232A?logo=react&amp;logoColor=61DAFB"> <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&amp;logoColor=white"> <img alt="Socket.IO" src="https://img.shields.io/badge/Socket.io-010101?logo=socket.io&amp;logoColor=white">

## Demo
[semantle.netlify.app](https://semantle.netlify.app/)

## Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/neuronauts.git

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

## Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory by copying the `.env.example` file:

```bash
cp .env.example .env
```

4. Update the `VITE_API_URL` in `.env` with your backend server URL

```
VITE_API_URL=your_backend_url
```

5. Development
   Run the development server:

```bash
npm run dev
```

6. Production
   Create a production build:

```bash
npm run build
```

## Features

🎮 Real-time multiplayer gameplay
🌓 Dark/Light theme with system sync
📱 Responsive + mobile orientation support
⚡️ Fast semantic word similarity checks

## Contributing

- Fork the repository
- Create feature branch

```bash
git checkout -b feature/amazing-feature
```

- Commit changes

```bash
git commit -m 'Add amazing feature'
```

- Push to branch

```bash
git push origin feature/amazing-feature
```

- Open Pull Request

## License

MIT
