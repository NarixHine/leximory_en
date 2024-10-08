export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never

export const supportedLangs = ['zh', 'en', 'ja', 'nl']
export const langMap: {
    [key: ArrayElement<typeof supportedLangs>]: '文言文' | 'English' | 'Japanese' | '其他'
} = {
    'zh': '文言文',
    'en': 'English',
    'ja': 'Japanese',
    'nl': '其他'
}

export const welcomeMap: {
    [key: ArrayElement<typeof supportedLangs>]: string
} = {
    'zh': '{{欢迎||欢迎||欢迎来到你的新文言文文库！}}',
    'en': '{{Welcome||welcome||Welcome to your new English library!}}',
    'ja': '{{ようこそ||ようこそ||新しい日本語ライブラリへようこそ！}}',
    'nl': '{{Welcome||welcome||Welcome to your new library!}}'
}

export const colorMap: {
    [key: ArrayElement<typeof supportedLangs>]: 'primary' | 'warning' | 'danger'
} = {
    '文言文': 'primary',
    '英文': 'primary',
    '日文': 'primary',
    '其他': 'primary',
    '共享': 'warning',
    '只读': 'danger'
}

export enum ApplicationStatus {
    Pending = 0,
    Approved,
    Rejected,
}

export const libAccessStatusMap: {
    [key: string]: number
} = {
    private: 0,
    public: 1,
    review: 2
}

export const applicationAccessMap: {
    [key: string]: string
} = {
    read: '只读',
    write: '读写'
}

export const applicationStatusMap: {
    [key: number]: string
} = {
    0: '处理中',
    1: '已批准',
    2: '被拒绝'
}

export const UrlPrefix = 'https://leximory.com'
export const prefixUrl = (url: string) => `${UrlPrefix}${url}`

export const accessOptions = [{
    name: 'private',
    label: 'Private'
}, {
    name: 'public',
    label: 'Public'
}, {
    name: 'review',
    label: 'Applicaple'
}]
