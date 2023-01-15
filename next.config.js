/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["gateway.ipfscdn.io", "arweave.net"],
  },
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
