/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  // Exclude better-sqlite3 from webpack bundling (it's a native module)
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('better-sqlite3');
    }
    return config;
  },
}

module.exports = nextConfig
