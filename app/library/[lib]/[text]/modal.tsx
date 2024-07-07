'use client'

import { Button } from '@nextui-org/button'
import { Divider } from '@nextui-org/divider'
import { readStreamableValue } from 'ai/rsc'
import { Input, Textarea } from '@nextui-org/input'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from '@nextui-org/modal'
import ky from 'ky'
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import isUrl from 'is-url'
import { Switch } from '@nextui-org/switch'
import { generate, save } from './gen'
import { maxArticleLength } from '@/lib/tier'
import { toast } from 'sonner'
import { Select, SelectItem } from '@nextui-org/select'
import { IoFlashOutline } from 'react-icons/io5'
import { MdAutoFixNormal } from 'react-icons/md'

export default function ImportModal({ isReadOnly, lang, input, setContent, handleInputChange, setIsLoading, setInput, lib, setCompletion, isLoading, editing, setEditing, text }: {
    input: string
    handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void
    setInput: Dispatch<SetStateAction<string>>
    isLoading: boolean
    editing: boolean
    setEditing: Dispatch<SetStateAction<boolean>>
    isReadOnly: boolean
    setCompletion: (completion: string) => void
    setContent: Dispatch<SetStateAction<string>>
    setIsLoading: Dispatch<SetStateAction<boolean>>
    lib: string
    lang: string
    text: string
}) {
    const { isOpen, onOpenChange, onOpen } = useDisclosure()
    const [mode, setMode] = useState(new Set(['flash']))
    const [url, setUrl] = useState('')
    const populate = async () => {
        const res = await ky.get(url, { prefixUrl: 'https://r.jina.ai' }).text()
        const markdown = (/Markdown Content:\n([\s\S]*)/.exec(res) as string[])[1]
        setInput(markdown.replace(/(?<!\!)\[([^\[]+)\]\(([^)]+)\)/g, '$1') /* remove links */)
    }
    const exceeded = input.length > maxArticleLength(lang)
    return (<>
        <div className='px-3 flex gap-3'>
            <Button isDisabled={isReadOnly} onPress={onOpen} className='flex-1' variant='flat' color='primary' isLoading={isLoading}>导入文本</Button>
            <Switch isDisabled={isReadOnly || isLoading} isSelected={editing} onValueChange={setEditing} color='secondary'>
                修正模式
            </Switch>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
            <ModalContent>
                {(onClose) => (
                    <form className='w-full'>
                        <ModalHeader className="flex flex-col gap-1">导入文本</ModalHeader>
                        <ModalBody>
                            <div className='flex'>
                                <Input
                                    className='flex-1'
                                    label='网址'
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    variant='underlined' />
                                <div className='flex flex-col-reverse'>
                                    <Button onPress={populate} variant='light' isDisabled={!isUrl(url)}>一键读取</Button>
                                </div>
                            </div>
                            <Divider className='my-2'></Divider>
                            {/* @ts-ignore */}
                            <Select label='生成模式' description='如果极速模式不尽人意，试试标准模式' selectedKeys={mode} onSelectionChange={setMode} startContent={mode.has('flash') ? <IoFlashOutline></IoFlashOutline> : <MdAutoFixNormal></MdAutoFixNormal>}>
                                <SelectItem key={'flash'} value='flash' startContent={<IoFlashOutline></IoFlashOutline>}>极速模式</SelectItem>
                                <SelectItem key={'standard'} value='standard' startContent={<MdAutoFixNormal></MdAutoFixNormal>}>标准模式</SelectItem>
                            </Select>
                            <Textarea
                                errorMessage={exceeded ? `文本长度超过 ${maxArticleLength(lang)} 字符` : undefined}
                                isInvalid={exceeded}
                                value={input}
                                label='文本'
                                description='AI 注解可能含有错误，超过上限或触发特定阈值会自动停止'
                                rows={8}
                                onChange={handleInputChange}
                                disableAutosize />
                        </ModalBody>
                        <ModalFooter>
                            <Button color='primary' isDisabled={isLoading || exceeded} onPress={async () => {
                                setIsLoading(true)
                                const { object, error } = await generate(input, lib, mode.has('flash'))
                                onClose()

                                if (error) {
                                    toast.error(error)
                                    setIsLoading(false)
                                }
                                else if (object) {
                                    let commentary = '', topics = []
                                    try {
                                        for await (const partialObject of readStreamableValue(object)) {
                                            if (partialObject) {
                                                commentary = partialObject.commentary
                                                setCompletion(partialObject.commentary)
                                                topics = partialObject.topics
                                            }
                                        }
                                        setContent(commentary)
                                        await save(commentary, topics, text, lib)
                                        setIsLoading(false)
                                    } catch (e) {
                                        await save(commentary, topics, text, lib)
                                        toast.error('生成中止。')
                                        setIsLoading(false)
                                    }
                                }
                            }}>
                                生成
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    </>)
}