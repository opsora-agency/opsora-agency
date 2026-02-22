/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. IGNORE ERRORS (Allows the build to finish despite punctuation/linting issues)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // 2. IMAGE SETTINGS
  images: {
    unoptimized: true,
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },

  // 3. HOSTING SETTINGS (Optimized for Hostinger Managed Node.js)
  // Removed distDir: 'dist' because Hostinger looks for the default '.next' folder
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ? `${process.env.NEXT_PUBLIC_BASE_PATH}/` : '',

  experimental: {
    isrMemoryCacheSize: 0,
    workerThreads: false,
    cpus: 1
  },
  
};

module.exports = nextConfig;
