/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three.js et @react-three/* sont transpilés pour fonctionner avec le bundler de Next.
  transpilePackages: ["three"],
};

export default nextConfig;
