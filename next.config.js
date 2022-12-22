/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/_next/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://api.goldstandard.org/credits" },
        ],
      },
    ]
  },
}

module.exports = nextConfig
