/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignora errores de ESLint durante el build
    ignoreDuringBuilds: true,
  },
  images: {
    // Si usas imágenes externas (YouTube, etc)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;