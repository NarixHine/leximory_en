import { auth } from '@clerk/nextjs/server'
import { maxCommentaryQuota, maxAudioQuota } from './tier'
import { redis } from './redis'

export default async function incrCommentaryQuota() {
    const { userId } = auth()
    const quotaKey = `user:${userId}:commentary_quota`

    const quota = await redis.incr(quotaKey)

    if (quota === 1) {
        await redis.expire(quotaKey, 60 * 60 * 24 * 30)
    }

    return quota > maxCommentaryQuota()
}

export async function getCommentaryQuota() {
    const { userId } = auth()
    const quotaKey = `user:${userId}:commentary_quota`

    const quota: number = await redis.get(quotaKey) ?? 0

    return { quota, max: maxCommentaryQuota(), percentage: Math.floor(100 * quota / maxCommentaryQuota()) }
}

export async function incrAudioQuota() {
    const { userId } = auth()
    const quotaKey = `user:${userId}:audio_quota`

    const quota = await redis.incr(quotaKey)

    if (quota === 1) {
        await redis.expire(quotaKey, 60 * 60 * 24 * 30)
    }

    return quota > maxAudioQuota()
}

export async function getAudioQuota() {
    const { userId } = auth()
    const quotaKey = `user:${userId}:audio_quota`

    const quota: number = await redis.get(quotaKey) ?? 0

    return { quota, max: maxAudioQuota(), percentage: Math.floor(100 * quota / maxAudioQuota()) }
}
