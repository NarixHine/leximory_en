import { GetEvents } from 'inngest'
import { inngest } from './client'
import webpush from 'web-push'
import { PrismaClient } from '@prisma/client'

type Events = GetEvents<typeof inngest>

webpush.setVapidDetails(
    'https://en.leximory.com/',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

const prisma = new PrismaClient()

export const fanNotification = inngest.createFunction(
    { id: 'load-subscribed-users' },
    { cron: '0 22 * * *' },
    async ({ step }) => {
        const users = await step.run('fetch-users', async () => {
            return prisma.subs.findMany()
        })

        const events = users.map<Events['app/notify']>(
            (user) => {
                return {
                    name: 'app/notify',
                    data: {
                        subscription: user.subscription!,
                    },
                    user,
                }
            }
        )

        await step.sendEvent('fan-out-notifications', events)
    }
)

export const notify = inngest.createFunction(
    { id: 'notify' },
    { event: 'app/notify' },
    async ({ event, step }) => {
        const { subscription } = event.data
        webpush.sendNotification(JSON.parse(subscription), JSON.stringify({
            title: 'Leximory 日报',
            body: '回顾昨日、四日前、七日前记忆的语汇。',
            icon: '/android-chrome-192x192.png',
            badge: '/android-chrome-192x192.png',
            data: {
                url: 'https://leximory.com/daily'
            },
        }))
    }
)
