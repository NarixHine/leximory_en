import createMDX from '@next/mdx'
import withSerwistInit from '@serwist/next'

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.*.*',
                port: '',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/try',
                destination: '/library/3e4f1126',
                permanent: true,
            },
        ]
    }
}

const withSerwist = withSerwistInit({
    swSrc: 'app/sw.ts',
    swDest: 'public/sw.js',
})

const withMDX = createMDX({})

export default withSerwist(withMDX(nextConfig))
