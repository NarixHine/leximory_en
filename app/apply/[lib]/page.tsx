import Main from '@/components/main'
import { authAccess } from '@/lib/auth'
import { applicationAccessMap, applicationStatusMap, colorMap, langMap } from '@/lib/config'
import { Button } from '@nextui-org/button'
import { Card, CardBody } from '@nextui-org/card'
import { Chip } from '@nextui-org/chip'
import { Spacer } from '@nextui-org/spacer'
import { redirect } from 'next/navigation'
import { xw } from '@/lib/fonts'
import AccessSelector from './select'
import { getXataClient } from '@/lib/xata'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { Input } from '@nextui-org/input'

async function getData(lib: string) {
    const { rec, isAccessible, isReadOnly, isPrivate } = await authAccess(lib)
    if (isAccessible && !isReadOnly) {
        redirect(`/library/${lib}`)
    }

    const xata = getXataClient()
    const application = await xata.db.applications.filter({
        lib,
        applicant: auth().userId!,
    }).select(['access', 'status']).getFirst()
    return { rec, isPrivate, isReadOnly, application }
}

export default async function Page({ params }: LibParams) {
    const { lib } = params
    const { rec, isReadOnly, isPrivate, application } = await getData(lib)
    const { name, language } = rec

    const apply = async (form: FormData) => {
        'use server'
        const xata = getXataClient()
        const access = form.get('access') as string
        const note = form.get('note') as string
        await xata.db.applications.create({
            lib,
            access,
            note,
            applicant: auth().userId as string,
        })
        revalidatePath(`/apply/${lib}`)
    }
    const deleteApplication = async () => {
        'use server'
        const xata = getXataClient()
        const application = await xata.db.applications.filter({
            lib,
            applicant: auth().userId as string,
        }).select([]).getFirst()
        if(application) {
            await application.delete()
        }
        revalidatePath(`/apply/${lib}`)
    }

    return (<Main className='flex justify-center items-center'>
        <div className='flex flex-col space-y-5 items-cente w-full'>
            <Card className='w-2/3 mx-auto'>
                <CardBody className='p-6'>
                    <a className='text-4xl'>{name}</a>
                    <Spacer y={5}></Spacer>
                    <div className='flex space-x-2'>
                        <Chip variant='flat' color={colorMap[language]}>{langMap[language]}</Chip>
                    </div>
                </CardBody>
            </Card>
            {
                isPrivate
                    ? <p className={`text-2xl text-center ${xw.className}`}>本私有文库不接受权限申请。</p>
                    : (application
                        ? <form className={`items-center flex-col flex ${xw.className} w-1/2 mx-auto`} action={deleteApplication}>
                            <p className='text-2xl text-center'>
                                {applicationAccessMap[application.access]}
                                权限请求
                                <span className='underline underline-offset-4'>{applicationStatusMap[application.status]}</span>。
                            </p>
                            <Spacer y={4}></Spacer>
                            <Button color='danger' type='submit' variant='flat' className='w-full'>撤销请求</Button>
                        </form>
                        : <form className='flex flex-col space-y-2 mx-auto w-1/2' action={apply}>
                            <Input variant='underlined' name='note' label='备注' color='secondary'></Input>
                            <AccessSelector isReadOnly={isReadOnly}></AccessSelector>
                            <Button variant='flat' color='secondary' type='submit'>申请权限</Button>
                        </form>)
            }
        </div>
    </Main>)
}
