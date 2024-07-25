import Comment from '@/components/comment'
import wrap from '@/lib/lang'
import Markdown from 'markdown-to-jsx'
import MdImg from './mdimg'

export type CommentedProps = {
    md: string,
    lib?: string,
    disableSave?: boolean
    deleteId?: string,
    lexicon?: CustomLexicon
    className?: string
    asCard?: boolean
}

function Commented({ md, lib = '', disableSave, deleteId, lexicon, className, asCard }: CommentedProps) {
    const result = wrap(md.trim(), lexicon)
        .replace(/\{\{([^|}]+)(?:\|\|([^|}]+))?(?:\|\|([^|}]+))?(?:\|\|([^|}]+))?(?:\|\|([^|}]+))?\}\}/g, (match, p1, p2, p3, p4, p5) => {
            const portions = [p1, p2, p3, p4, p5].filter(Boolean).map((portion) => portion.replaceAll('"', '\\"'))
            return '<Comment params={["' + portions.join('","') + '"]} lib="' + lib + '" disableSave={' + disableSave + '} ' + 'deleteId={' + deleteId + '} asCard={' + asCard + '}></Comment>'
        })
        .replaceAll(' <Comment', '&nbsp;<Comment')
        .replaceAll('<Comment', '‎<Comment')
        .replaceAll('&gt;', '>')
    return (<Markdown
        options={{
            overrides: {
                Comment: {
                    component: Comment,
                },
                img: (props) => (<MdImg {...props} />),
                p: (props) => (<div {...props} className='mb-5' />),
            },
        }}
        className={`heti ${className ?? ''}`}
    >{result}</Markdown>)
}

export default Commented
