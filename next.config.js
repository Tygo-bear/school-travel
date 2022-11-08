/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {esmExternals: 'loose'},
  output: 'standalone',
}

const withTranspile = require('next-transpile-modules')(['ol', 'rlayers']);
module.exports = withTranspile(nextConfig);
