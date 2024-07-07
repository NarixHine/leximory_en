import { randomID } from '@/lib/utils'
import { FaRegFileAudio } from 'react-icons/fa6'
import { PluginProps } from 'react-markdown-editor-lite'

const Reader = (props: PluginProps) => {
    const handleClick = () => {
        const select = props.editor.getSelection().text
        props.editor.insertText(`:::${randomID()}\n${select}\n:::`, true)
    }

    return (
        <span
            className='button flex justify-center items-center'
            title='Audio'
            onClick={handleClick}
        >
            <FaRegFileAudio />
        </span>
    )
}

Reader.defaultConfig = {}
Reader.align = 'left'
Reader.pluginName = 'audio'

export default Reader
