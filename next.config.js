// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  disable: false, // Enable PWA for all environments
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["lh3.googleusercontent.com", "i.scdn.co"], // Add your image domains here
  },
};

module.exports = withPWA(nextConfig);
