import { Readable } from 'stream'

export function stringToColor(input: string): 'primary' | 'warning' | 'danger' {
    // Simple hash function to convert a string to a number
    let hash = 0
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash // Convert to 32bit integer
    }
    return ['secondary', 'warning', 'danger'][Math.abs(hash % 3)] as any
}

export const randomID = () => crypto.getRandomValues(new Uint32Array(1))[0].toString(16)

export async function convertReadableToBinaryFile(readable: Readable) {
    let dataBuffer = Buffer.alloc(0)
    readable.on('data', (chunk) => {
        dataBuffer = Buffer.concat([dataBuffer, chunk])
    })
    await new Promise((resolve, reject) => {
        readable.on('end', resolve)
        readable.on('error', reject)
    })
    return dataBuffer
}
