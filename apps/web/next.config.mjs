/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // API base for client fetches; set NEXT_PUBLIC_API_URL in the environment.
  env: { NEXT_PUBLIC_API_URL: process.env.PUBLIC_API_URL ?? 'http://localhost:3000' },
};
export default nextConfig;
