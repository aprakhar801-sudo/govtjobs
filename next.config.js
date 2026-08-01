/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // SET THIS to your repo name, e.g. if repo is github.com/yourname/govtjobs
  // your site will be at: yourname.github.io/govtjobs
  // When you move to custom domain later, just set this back to ''
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
}

module.exports = nextConfig
