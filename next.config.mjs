/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img-s-msn-com.akamaized.net",
        port: "",
        pathname: "/tenant/amp/entityid/*",
      },
    ],
  },
};

export default nextConfig;

//https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB1msKEv.img
