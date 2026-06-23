/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three.js et @react-three/* sont transpilés pour fonctionner avec le bundler de Next.
  transpilePackages: ["three"],
  // Photos d'illustration servies par le CDN Unsplash (next/image).
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
