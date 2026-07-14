/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // Permite subir PDFs de hasta ~10 MB vía Server Actions.
      // Ojo: en Vercel plan Hobby el body de una request tiene tope ~4.5 MB.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
