import dynamic from 'next/dynamic'
import './editor.css'
import DefaultEditor, { Plugins } from 'react-markdown-editor-lite'

const MdEditor = dynamic(
    // @ts-ignore
    () => {
        return new Promise((resolve) => {
            Promise.all([
                import('react-markdown-editor-lite'),
            ]).then((res) => {
                const Editor: typeof DefaultEditor = res[0].default
                Editor.unuse(Plugins.Table)
                Editor.unuse(Plugins.BlockCodeBlock)
                Editor.unuse(Plugins.Clear)
                Editor.unuse(Plugins.FullScreen)
                Editor.unuse(Plugins.BlockCodeInline)
                Editor.unuse(Plugins.FontStrikethrough)
                Editor.unuse(Plugins.FontUnderline)
                Editor.unuse(Plugins.Logger)
                Editor.unuse(Plugins.BlockWrap)
                Editor.unuse(Plugins.TabInsert)
                Editor.unuse(Plugins.Image)
                resolve(Editor)
            })
        })
    },
    {
        ssr: false
    }
)

export default MdEditor as typeof DefaultEditor
