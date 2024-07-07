'use client'

import Markdown from '@/components/markdown'
import ImportModal from './modal'
import { useCompletion } from 'ai/react'
import { Spacer } from '@nextui-org/spacer'
import { Divider } from '@nextui-org/divider'
import { useContext, useEffect, useState } from 'react'
import { Button } from '@nextui-org/button'
import { RadioGroup, Radio } from '@nextui-org/radio'
import save from './save'
import { FaBookOpenReader, FaPrint } from 'react-icons/fa6'
import { ReaderModeContext } from '@/lib/contexts'
import { Tooltip } from '@nextui-org/tooltip'
import { Snippet } from '@nextui-org/snippet'
import MdEditor from '@/components/editor'
import Topics from '@/components/topics'
import { Input } from '@nextui-org/input'
import { IoIosAddCircleOutline } from 'react-icons/io'

export default function Digest({ id, lib, content: defaultContent, isReadOnly, lang, topics }: {
  id: string
  lib: string
  content: string
  isReadOnly: boolean
  lang: string
  topics: string[]
}) {
  const {
    completion,
    input,
    handleInputChange,
    setCompletion,
    setInput,
  } = useCompletion()
  const [isLoading, setIsLoading] = useState(false)

  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(defaultContent)
  useEffect(() => {
    setContent(defaultContent)
  }, [defaultContent])
  const md = isLoading ? completion : content

  const [modifiedMd, setModifiedMd] = useState(md)
  useEffect(() => {
    setModifiedMd(md)
  }, [md])

  const [customLexicon, setCustomLexicon] = useState<CustomLexicon>('none')

  const { toggleReaderMode, isReaderMode } = useContext(ReaderModeContext)

  const [modifiedTopics, setModifiedTopics] = useState<string[]>(topics ?? [])
  useEffect(() => {
    setModifiedTopics(topics)
  }, [topics])
  const [newTopic, setNewTopic] = useState('')

  const typographyStyles = lang === 'zh' || lang === 'ja' ? 'max-w-[600px]' : 'max-w-[650px]'

  return (<>
    <div className='sm:mt-4 sm:flex sm:justify-center sm:items-center sm:mb-4'>
      <div className='sm:flex sm:justify-center sm:items-center sm:space-x-4'>
        <div className={isReaderMode ? 'w-full flex justify-center' : 'w-full flex justify-center mb-1 mt-3 sm:mt-0 sm:mb-0 sm:w-fit'}>
          <Tooltip content={
            <Snippet hideCopyButton symbol='' className='bg-transparent'>
              Ctrl + P
            </Snippet>
          }>
            <Button onPress={() => {
              toggleReaderMode()
            }} className='mx-auto' variant={'light'} color={isReaderMode ? 'default' : 'danger'} radius='sm' endContent={<FaPrint></FaPrint>} startContent={<FaBookOpenReader></FaBookOpenReader>}>
              读者模式／印刷模式
            </Button>
          </Tooltip>
        </div>
        {lang === 'en' && !isReaderMode && <div className='flex justify-center items-center mb-1 sm:mb-0'>
          <RadioGroup
            value={customLexicon}
            orientation='horizontal'
            color='danger'
            onValueChange={(value) => { setCustomLexicon(value as CustomLexicon) }}
          >
            <Radio value='none'>无</Radio>
            <Radio value='chuzhong'>初中</Radio>
            <Radio value='gaozhong'>高中</Radio>
            <Radio value='cet6'>六级</Radio>
          </RadioGroup>
        </div>}
      </div>
    </div>
    <Spacer y={4}></Spacer>
    {
      editing
        ? <>
          <div
            className='flex space-x-3'
          >
            <Topics topics={modifiedTopics} remove={(topicToRemove) => {
              setModifiedTopics(modifiedTopics.filter(topic => topic !== topicToRemove))
            }}></Topics>
            <div className='flex-1'>
              <Input className='w-full' variant='underlined' color='secondary' value={newTopic} onChange={(e) => {
                setNewTopic(e.target.value)
              }}></Input>
            </div>
            <Button variant='flat' color='secondary' startContent={<IoIosAddCircleOutline></IoIosAddCircleOutline>} onClick={() => {
              setModifiedTopics([...modifiedTopics, newTopic])
              setNewTopic('')
            }}>添加</Button>
          </div>
          <Spacer y={2}></Spacer>
          <div className='sm:hidden'>
            <MdEditor
              value={modifiedMd}
              view={{ menu: true, md: true, html: false }}
              className='h-[500px]'
              renderHTML={(md) => <Markdown lib={lib} md={`<article>\n${md}\n</article>`}></Markdown>}
              onChange={(e) => {
                setModifiedMd(e.text)
              }}></MdEditor>
          </div>
          <div className='hidden sm:block'>
            <MdEditor
              value={modifiedMd}
              className='h-[500px]'
              renderHTML={(md) => <Markdown lib={lib} md={`<article>\n${md}\n</article>`}></Markdown>}
              onChange={(e) => {
                setModifiedMd(e.text)
              }}></MdEditor>
          </div>

          <Spacer y={2}></Spacer>
          {editing && <Button fullWidth variant='flat' color='secondary' onClick={async () => {
            await save(id, modifiedMd, modifiedTopics, lib)
            setEditing(false)
          }}>保存更改</Button>}
        </>
        : <Markdown className={!isReaderMode ? `${typographyStyles} mx-auto block` : 'lg:w-3/5 block'} md={`<article>\n${md}\n</article>`} lib={lib} lexicon={customLexicon} disableSave={isReadOnly}></Markdown>
    }
    <div className={isReaderMode ? '' : `${typographyStyles} mx-auto`}>
      {
        !isReaderMode && <>
          <Spacer y={3}></Spacer>
          <Divider></Divider>
          <Spacer y={3}></Spacer>
          <ImportModal text={id} setContent={setContent} setIsLoading={setIsLoading} isReadOnly={isReadOnly} lang={lang} editing={editing} setEditing={setEditing} isLoading={isLoading} input={input} setInput={setInput} handleInputChange={handleInputChange} lib={lib} setCompletion={setCompletion}></ImportModal>
        </>
      }
    </div>
  </>)
}
