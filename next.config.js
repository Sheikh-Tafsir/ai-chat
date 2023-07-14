/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: true
  },
  async headers() {
    return [
      {
        source: '/api/pdf',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }]
      }
    ]
  }
}
