/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "i.scdn.co"],
  },
  async redirects() {
    return [
      {
        source: "/auth/signup",
        destination: "/auth/signin",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
