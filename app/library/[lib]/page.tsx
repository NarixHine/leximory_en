import Main from '@/components/main'
import Nav from '@/components/nav'
import Options from '@/components/options'
import Text from '@/components/text'
import H from '@/components/title'
import { authRead, authWrite } from '@/lib/auth'
import { getXataClient } from '@/lib/xata'
import { Button } from '@nextui-org/button'
import { Card, CardBody } from '@nextui-org/card'
import { revalidatePath } from 'next/cache'

async function getData(lib: string) {
    const xata = getXataClient()
    const { rec, isReadOnly } = await authRead(lib)
    const { name } = rec
    const texts = await xata.db.texts.filter({
        $all: [{ lib: { $is: lib } },]
    }).sort('xata.updatedAt').select(['lib.language', 'title', 'lib.name', 'topics']).getAll()
    return { texts, name, isReadOnly }
}

export default async function Page({ params }: LibParams) {
    const { lib } = params
    const { texts, name, isReadOnly } = await getData(lib)
    const save = async (id: string, form: FormData) => {
        'use server'
        const xata = getXataClient()
        await authWrite(lib)
        await xata.db.texts.createOrUpdate(id, {
            lib: lib,
            title: form.get('title') as string
        })
        revalidatePath('/library')
    }
    const del = async (id: string) => {
        'use server'
        const xata = getXataClient()
        await authWrite(lib)
        await xata.db.texts.delete(id)
        revalidatePath('/library')
    }

    return <Main className='flex flex-col gap-10' maxWidth={700}>
        <Nav lib={{ id: lib, name }}></Nav>
        <H>{name}</H>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {texts.map(({ lib, title, id, topics }) => (
                <Text
                    libId={lib!.id}
                    id={id}
                    key={title}
                    title={title}
                    lang={lib!.language}
                    save={save.bind(null, id)}
                    del={del.bind(null, id)}
                    isReadOnly={isReadOnly}
                    topics={topics ?? []}
                ></Text>
            ))}
        </div>
        <Options
            trigger={
                texts.length > 0
                    ? <Button className='mx-auto block' color='primary' isDisabled={isReadOnly}>新增文本</Button>
                    : <Card className='sm:w-1/2 mx-auto w-2/3 aspect-square border-dashed border-3' shadow='sm' isPressable isBlurred>
                        <CardBody className='p-3 justify-center items-center flex'>
                            <a className='text-3xl text-balance opacity-70'>新建文本</a>
                        </CardBody>
                    </Card>
            }
            action={save.bind(null, crypto.getRandomValues(new Uint32Array(1))[0].toString(16))}
            inputs={[{
                name: 'title',
                label: '标题',
            }]}></Options>
    </Main>
}
