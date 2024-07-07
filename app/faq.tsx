'use client'

import { Accordion, AccordionItem } from '@nextui-org/accordion'

export default function Faq() {
    return (<Accordion>
        <AccordionItem key={1} title={'有些页面似乎加载不出？'}>
            服务器距离较远，网页加载速度可能会受到影响。请耐心等待或刷新页面。
        </AccordionItem>
        <AccordionItem key={2} title={'现在支持哪些语言？'}>
            我们已对英文、文言文、日文完成优化，但理论上支持包含西班牙语、法语在内的大多数语言。目前，你可以在创建文库时语言栏选择“其他”选项。
        </AccordionItem>
        <AccordionItem key={3} title={'注解是如何生成的？'}>
            部分注解通过 AI 自动生成，以特定语法（<span>{`{{原文形式||原形||释义||语源||语根}}`}</span>）注入原文并渲染，有时因 AI 输出的不确定性可能会出现故障，若重试仍然失败请换一段文本。此外，英语文库还内置初中、高中、四六级等考纲词汇高亮功能，当你点击对应词汇时会在我们的词典中动态查询释义。
        </AccordionItem>
        <AccordionItem key={4} title={'Leximory 完全免费吗？'}>
            是的！Leximory 是依靠捐款维系的非营利平台。我们需要你的支持提供更好的服务！
        </AccordionItem>
    </Accordion>)
}
