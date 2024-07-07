import { auth } from '@clerk/nextjs/server'

const getPlan = () => auth().sessionClaims?.plan

export const maxCommentaryQuota = () => {
    const plan = getPlan()
    if (plan === 'communicator') {
        return 999
    }
    else if (plan === 'interlocutor') {
        return 200
    }
    return 100
}

export const maxAudioQuota = () => {
    const plan = getPlan()
    if (plan === 'communicator') {
        return 99
    }
    else if (plan === 'interlocutor') {
        return 10
    }
    return 5
}

export const maxArticleLength = (lang: string) => {
    if (lang === 'en')
        return 20000
    else if (lang === 'ja')
        return 5000
    else if (lang === 'zh')
        return 5000
    return 7000
}
