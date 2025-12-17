/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/how-much-does-:slug([a-z0-9-]+)-really-cost',
        destination: '/how-much-does/:slug',
      },
    ];
  },
};

export default nextConfig;

