/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Mudado de 'export' para standalone para melhor compatibilidade com Railway
  output: 'standalone',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
