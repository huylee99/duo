import "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com", "cdn.discordapp.com", "cloud.deuxlabs.dev"],
  },
};

export default nextConfig;
