import { EventSchemas, Inngest } from 'inngest'

type UserSignup = {
    data: {
        subscription: string
    }
}
type Events = {
    'app/notify': UserSignup
}

export const inngest = new Inngest({
    id: 'leximory-en',
    schemas: new EventSchemas().fromRecord<Events>(),
},)
