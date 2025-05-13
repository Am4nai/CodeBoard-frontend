import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/', // Корневой URL
        destination: '/auth', // Перенаправление на страницу /auth
        permanent: false, // Временное перенаправление (302)
      },
    ];
  },
};

export default nextConfig;