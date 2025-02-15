<img alt="neuronauts logo" height="64px" width="64px" src="https://github.com/majicmaj/neuronauts/blob/main/public/android-chrome-192x192.png?raw=true">

# Neuronauts


[![GitHub stars](https://img.shields.io/github/stars/majicmaj/neuronauts?style=social)](https://github.com/majicmaj/neuronauts/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/majicmaj/neuronauts?style=social)](https://github.com/majicmaj/neuronauts/network)

A real-time multiplayer word guessing game powered by semantic word embeddings.

<img alt="Made with React" src="https://img.shields.io/badge/React-20232A?logo=react&amp;logoColor=61DAFB"> <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&amp;logoColor=white"> <img alt="Socket.IO" src="https://img.shields.io/badge/Socket.io-010101?logo=socket.io&amp;logoColor=white">

## Demo

Note: The backend might be down / restarted frequently
Experience the game live: [https://semantle.netlify.app/](https://semantle.netlify.app/)

<img width="1512" alt="image" src="https://github.com/user-attachments/assets/7c81cc32-684f-43a7-9b8f-a80eff106389" />


## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Self-Hosting](#self-hosting)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Real-Time Multiplayer:** Engage in word guessing challenges with players from around the world.
- **Responsive Design:** Enjoy a seamless experience on desktops and mobile devices.
- **Theme Support:** Automatic dark/light mode syncing with your system preferences.
- **Instant Semantic Checks:** Benefit from fast, semantic word similarity calculations.

## Getting Started

Set up your local development environment in just a few steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/neuronauts.git
   cd neuronauts
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file by copying the example:

   ```bash
   cp .env.example .env
   ```

   Then, update the `VITE_API_URL` in your `.env` file with the URL of your backend server:

   ```dotenv
   VITE_API_URL=https://your-backend-url.com
   ```

4. **Run the Development Server:**

   ```bash
   npm run dev
   ```

   Open your browser and navigate to the provided local URL to see the application in action.

5. Set up the neuronauts-be!
Instructions here: [https://github.com/majicmaj/neuronauts-be](https://github.com/majicmaj/neuronauts-be)

## Self-Hosting

If you’d like to deploy and run Neuronauts on your own infrastructure, follow these additional steps:

1. **Build for Production:**

   Generate an optimized production build:

   ```bash
   npm run build
   ```

2. **Preview the Production Build Locally:**

   Test your build with:

   ```bash
   npm run preview
   ```

3. **Deploy Your Build:**

   - **Static File Server:** Serve the contents of the `dist` folder using any static server (e.g., [serve](https://www.npmjs.com/package/serve)).
   - **Docker:** While a Docker setup isn’t provided out-of-the-box, you can easily create a `Dockerfile` to containerize the app. Contributions for official Docker support are welcome!
   - **Cloud Platforms:** Deploy on services like Netlify, Vercel, or AWS S3 + CloudFront for global reach.

4. **Customize Your Deployment:**

   - Ensure that your environment variables (especially `VITE_API_URL`) are correctly configured for your production backend.
   - Integrate with any additional custom backend or middleware as needed.

## Contributing

We welcome contributions from the community!

1. **Fork the Repository**
2. **Create a Feature Branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit Your Changes:**

   ```bash
   git commit -m "Add: Description of your feature"
   ```

4. **Push to Your Branch:**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request:**

   Provide a clear description of your changes and the problem they solve.

For detailed guidelines, please review our [Code of Conduct](CODE_OF_CONDUCT.md) and [Contribution Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).
