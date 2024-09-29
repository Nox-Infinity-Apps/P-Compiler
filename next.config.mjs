/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        typedRoutes: true,
    },
    output: "standalone",
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
