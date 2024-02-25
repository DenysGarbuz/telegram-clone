/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "testimagetelegrambucket.s3.eu-north-1.amazonaws.com",
        pathname: "/images/**",
      },
    ],
  },
};
module.exports = nextConfig;
