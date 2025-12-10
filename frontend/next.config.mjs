/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    outputFileTracingRoot: '/app',
    webpack: (config, context) => {
        config.watchOptions = {
            poll: 500,
            aggregateTimeout: 300
        }
        return config
    },
}

export default nextConfig;