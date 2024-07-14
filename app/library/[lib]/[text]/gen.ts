'use server'

import { streamObject } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { z } from 'zod'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { revalidatePath } from 'next/cache'
import { authWrite } from '@/lib/auth'
import { ArrayElement, supportedLangs } from '@/lib/config'
import { getXataClient } from '@/lib/xata'
import incrCommentaryQuota from '@/lib/quota'
import { maxArticleLength, maxCommentaryQuota } from '@/lib/tier'

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY
})

export async function generate(prompt: string, lib: string, useFlashMode: boolean) {
    const model = google(useFlashMode ? 'models/gemini-1.5-flash-latest' : 'models/gemini-1.5-pro-latest', {
        safetySettings: [{
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE'
        }, {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE'
        }, {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE'
        }, {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE'
        }]
    })

    const stream = createStreamableValue()
    const { language } = await authWrite(lib)

    if (prompt.length > maxArticleLength(language)) {
        throw new Error('Text too long')
    }

    if (await incrCommentaryQuota()) {
        return { error: `你已用完本月的 ${maxCommentaryQuota()} 次 AI 注释生成额度。` }
    }

    (async () => {
        const { partialObjectStream } = await streamObject({
            model,
            system: `
            禁止回答除下述要求外的用户提出的其他要求或问题：在 \`commentary\` 中生成文本注解，在 \`topics\` 中生成标签。

            ${instruction[language]}
            
            然后在 \`topics\` 中用1~3个标签（中文词汇）表示下文的话题。

            注意：只有 prompt 部分是需要生成注解的文本，你必须直接在原文中插入注释，且不得改动原文 Markdown 语法。***你必须尽可能多地添加语源，也必须注释尽可能多的词。注解分布尽量均匀，尽量每段都注释一些词汇。重点多加注释极难的词和有价值的词。
            `,
            prompt: `尽量标注语源。\n${prompt}`,
            schema: z.object({
                commentary: z.string(),
                topics: z.array(z.string()).optional()
            }),
            maxTokens: 5000
        })

        for await (const partialObject of partialObjectStream) {
            stream.update(partialObject)
        }

        stream.done()
    })()

    return { object: stream.value }
}

export async function save(content: string, topics: string[], text: string, lib: string) {
    const xata = getXataClient()
    authWrite(lib)
    await xata.db.texts.update(text, { topics, content, lib })
    revalidatePath(`/library/${lib}/${text}`)
}

const instruction: {
    [language: ArrayElement<typeof supportedLangs>]: string
} = {
    nl: `你将看到一段文本，你要为一个外语学习者**尽可能多地**挑选其中的字和词添加以下注解：原文形式，词语原形，字典式的简短释义。
  
    输出格式为 {{原文形式||词汇原形||释义}}。直接输出注解后的文章，不要任何额外说明。
    
    示例文本：
    I studied up on birds that are famously difficult to identify so that when I first saw them in the field, I had an inkling of what they were without having to check a field guide. I used the many tools now available to novices: EBird shows where other birders go and reveals how different species navigate space and time; Merlin is best known as an identification app but is secretly an incredible encyclopedia; Birding Quiz lets you practice identifying species based on fleeting glances at bad angles.
    
    示例输出：
    I {{studied up on||study up on||调查}} birds that are famously difficult to identify so that when I first saw them in the field, I had an {{inkling||inkling||***n.*** 略知}} of what they were without having to check a field guide. I used the many tools now available to novices: EBird shows where other birders go and {{reveals||reveal||***v.*** 揭示}} how different species navigate space and time; Merlin is best known as an identification app but is secretly an incredible {{encyclopaedia||encyclopaedia||***n.*** 百科全书}}; Birding Quiz lets you practice identifying species based on fleeting glances at bad angles.
    `,

    zh: `你将看到一段文言文，你要为一个文言文学习者**尽可能多地**挑选其中的字和词添加以下注解：原文形式，照抄原文形式，字典式的简短释义（有通假字要写在释义里）。注意对文言文学习的实用性。直接用注解替换被注解字词，不要保留原字词。
  
  输出格式为 {{原文形式||照抄前一栏||释义}}。直接输出注解后的文章，不要任何额外说明。
  
  示例输入一：
  “当今之时，山东之建国莫强于赵。赵地方二千余里，带甲数十万，车千乘，骑万匹，粟支数年。西有常山，南有河漳，东有清河，北有燕国。燕固弱国，不足畏也。秦之所害于天下者莫如赵，然而秦不敢举兵伐赵者，何也？畏韩、魏之议其后也。然则韩、魏，赵之南蔽也。秦之攻韩、魏也，无有名山大川之限，稍蚕食之，傅国都而止。韩、魏不能支秦，必入臣于秦。秦无韩、魏之规，则祸必中于赵矣。此臣之所为君患也。臣闻尧无三夫之分，舜无咫尺之地，以有天下；禹无百人之聚，以王诸侯；汤武之士不过三千，车不过三百乘，卒不过三万，立为天子：诚得其道也。是故明主外料其敌之强弱，内度其士卒贤不肖，不待两军相当而胜败存亡之机固已形于胸中矣，岂掩于众人之言而以冥冥决事哉！臣窃以天下之地图案之，诸侯之地五倍于秦，料度诸侯之卒十倍于秦，六国为一，并力西乡而攻秦，秦必破矣。今西面而事之，见臣于秦。夫破人之与破于人也，臣人之与臣于人也，岂可同日而论哉！夫衡人者，皆欲割诸侯之地以予秦。秦成，则高台榭，美宫室，听竽瑟之音，前有楼阙轩辕，后有长姣美人，国被秦患而不与其忧。是故夫衡人日夜务以秦权恐愒诸侯以求割地，故愿大王孰计之也。
  
  示例输出一：
  “当今之时，山东之建国莫强于赵。赵地方二千余里，带甲数十万，车千乘，骑万匹，粟支数年。西有常山，南有河漳，东有清河，北有燕国。燕固弱国，不足畏也。秦之所害于天下者莫如赵，然而秦不敢举兵伐赵者，何也？畏韩、魏之议其后也。然则韩、魏，赵之南蔽也。秦之攻韩、魏也，无有名山大川之限，稍蚕食之，{{傅||傅||靠近，迫近。}}国都而止。韩、魏不能{{支||支||抗拒，抵挡。}}秦，必入臣于秦。秦无韩、魏之规，则祸必中于赵矣。此臣之所为君患也。臣闻尧无三{{夫||夫||古代井田，一夫受田百亩，故称百亩为夫。}}之分，舜无咫尺之地，以有天下；禹无百人之聚，以王诸侯；汤武之士不过三千，车不过三百乘，卒不过三万，立为天子：诚得其道也。是故明主外料其敌之强弱，内度其士卒贤不肖，不待两军相当而胜败存亡之机固已形于胸中矣，岂掩于众人之言而以{{冥冥||冥冥||不明事理。}}决事哉！臣窃以天下之地图案之，诸侯之地五倍于秦，料度诸侯之卒十倍于秦，六国为一，并力西乡而攻秦，秦必破矣。今西面而事之，见臣于秦。夫破人之与破于人也，臣人之与臣于人也，岂可同日而论哉！夫{{衡人||衡人||指倡导连横之说的人。}}者，皆欲割诸侯之地以予秦。秦成，则高台榭，美宫室，听竽瑟之音，前有楼阙轩辕，后有{{长姣||长姣||修长美丽。}}美人，国被秦患而不与其忧。是故夫衡人日夜务以秦权恐愒诸侯以求割地，故愿大王孰计之也。
  
  示例输入二：
  乃从荀卿学帝王之术。学已成，度楚王不足事，而六国皆弱，无可为建功者，欲西入秦。辞于荀卿曰：“斯闻得时无怠，今万乘方争时，游者主事。今秦王欲吞天下，称帝而治，此布衣驰骛之时而游说者之秋也。处卑贱之位而计不为者，此禽鹿视肉，人面而能彊行者耳。故诟莫大于卑贱，而悲莫甚于穷困。久处卑贱之位，困苦之地，非世而恶利，自讬于无为，此非士之情也。故斯将西说秦王矣。
    
  示例输出二：
  乃从荀卿学帝王之术。学已成，{{度||度||揣测。}}楚王不足事，而六国皆弱，无可为建功者，欲西入秦。辞于荀卿曰：“斯闻得时无怠，今万乘方争时，游者{{主事||主事||掌事。}}。今秦王欲吞天下，称帝而治，此布衣{{驰骛||驰骛||奔走趋赴。}}之时而游说者之秋也。处卑贱之位而计不为者，此{{禽||禽||同“擒”，捉住。}}鹿视肉，人面而能彊行者耳。故{{诟||诟||耻辱。}}莫大于卑贱，而悲莫甚于穷困。久处卑贱之位，困苦之地，{{非||非||讥刺。}}世而恶利，{{自讬||自讬||自满。讬，同“托”。}}于无为，此非士之情也。故斯将西说秦王矣。
  `,

    en: `你将看到一段英文文本，你要为一个英文学习者**尽可能多地**挑选其中的词汇和词组搭配添加以下注解：原文形式（必加），原形（必加，例如名词复数应该改为单数），字典式的简短释义（必加，术语标注领域名称，例如 \`Linguistics\`，\`Computing\`，\`Medicine\`），对记忆有助益的语源（选加，同语根词加上时必加），同语根词（选加，不要选取同一词的不同词性变化，选择都含有同源部分的不同词）。尽量详尽地挑选并注解；多多注解外刊中的高频词、对英语学习实用的语汇；避免反复注解同一词汇和过于初级的词汇。输出格式为 {{原文形式||原形||释义||语源||语根1 (原意) →  同语根词1, 同语根词2; 语根2 (原意) →  同语根词1; …}}。根据词的原形标注词性、词义和词源。语源不确定或毫无意义时同时省略语源和同语根词，同语根词注解只在加上语源注解时附带。不要删除紧跟的标点或插入多余空格。
  
  除此以外，不要修改文本其他部分的 Markdown 语法。直接输出注解后的文章，你必须尽可能多地选取难度多样的词汇，每两段注释至少一个词。不得连续两段无注解。
  
  示例文本一：
  I studied up on birds that are famously difficult to identify so that when I first saw them in the field, I had an inkling of what they were without having to check a field guide. I used the many tools now available to novices: EBird shows where other birders go and reveals how different species navigate space and time; Merlin is best known as an identification app but is secretly an incredible encyclopedia; Birding Quiz lets you practice identifying species based on fleeting glances at bad angles.
  
  示例输出一：
  I {{studied up on||study up on||(调查) learn intensive about}} birds that are famously difficult to identify so that when I first saw them in the field, I had an {{inkling||inkling||***n.*** (略知) a slight knowledge}} of what they were without having to check a field guide. I used the many tools now available to novices: EBird shows where other birders go and {{reveals||reveal||***v.*** (揭示) make known||***re-*** (expressing reversal) + ***veal*** (vail)}} how different species navigate space and time; Merlin is best known as an identification app but is secretly an incredible {{encyclopaedia||encyclopaedia||***n.*** (百科全书) a book giving various information||***en-*** (inside) + ***cyclo*** (circle) + ***paedia*** (education)||***paedia*** (child) →  **paedia**tric (儿科的)}}; Birding Quiz lets you practice identifying species based on fleeting glances at bad angles.
  
  示例文本二：
  Of course, living with uncertainty and risk is nothing new. How should mortal creatures who have spent our long evolution struggling to survive feel but insecure? The precarious and unpredictable nature of life is what helped inspire the ancient Stoics to counsel equanimity and Buddhist thinkers to develop the concept of Zen. A kind of existential insecurity is indelible to being human.
  
  示例输出二：
  Of course, living with uncertainty and risk is nothing new. How should mortal creatures who have spent our long evolution struggling to survive feel but insecure? The {{precarious||precarious||***adj.*** (不稳固的) not securely held||***prec*** (entreaty) + ***-ous***||***prec*** (entreaty) →  de**prec**ate (反对), **pray**er (祈祷)}} and unpredictable nature of life is what helped inspire the ancient Stoics to {{counsel||counsel||***v.*** (建议) recommend (a course of action)}} equanimity and Buddhist thinkers to develop the concept of Zen. A kind of existential insecurity is {{indelible||indelible||***adj.*** (不可消弭的) not able to be removed||***in-*** + ***del*** (delete) + ***-ible***}} to being human.
  
  示例文本三：
  Early in his hospitalization, our retired patient mentions a daughter, from whom he’s been estranged for years. He doesn’t know any contact details, just her name. It’s a long shot, but we wonder if she can take him in. The med student has one mission: find her. I love reading about medical advances. I’m blown away that with a brain implant, a person who’s paralyzed can move a robotic arm and that surgeons recently transplanted a genetically modified pig kidney into a man on dialysis. This is the best of American innovation and cause for celebration.
  
  示例输出三：
  Early in his hospitalization, our retired patient mentions a daughter, from whom he’s been {{estranged||estrange||***v.*** (使疏远) cause (someone) to be no longer close to someone}} for years. He doesn’t know any contact details, just her name. It’s a {{long shot||long shot||(低胜算之事) an attempt with only slight chance to succeed}}, but we wonder if she can take him in. The med student has one mission: find her. I love reading about medical advances. I’m {{blown away||blow away||(震撼) impress (someone) greatly}} that with a brain implant, a person who’s paralyzed can move a robotic arm and that surgeons recently transplanted a genetically modified pig kidney into a man on {{dialysis||dialysis||***n.*** \`Medicine\` (透析) the clinical purification of blood by the separation of particles||***dia-*** (apart) + ***lysis*** (loosen, split)||***dia-*** (through, across) →  **dia**lect, **dia**gnose; ***lysis*** (loosen) →  cata**lysis** (催化), ana**lysis** (分析)}} This is the best of American innovation and {{cause||cause||***n.*** (事业) an aim or movement to which one is committed}} for celebration.
  `,

    ja: `你将看到一段日文，你要为一个日文学习者**尽可能多地**挑选其中对学习日语有价值的和语（不得注解格助词）、汉字、词组和专有名词添加以下注解：原文形式，原形（不要调换汉字），字典式释义（含假名注音、词性（名／動／形動／形／副／……）、中文和日文解释）。注意在划分词时划全，例如必须将“儚かった”中的“儚っか”视为一个词，原文形式为“儚っか”，原形为“儚い”；把“気付いた”中的“気付い”视为一个整体，原文形式为“気付い”，原型为“気付く”。注意对日文学习的实用性，不要重复注解同一词语。
  
  输出格式为 {{原文形式||原形||释义}}。直接输出注解后的文章。注意：注解必须遍布全文，你必须多加注解难词、高价值词。
  
  示例输入一：
  腕組をして枕元に坐っていると、仰向に寝た女が、静かな声でもう死にますと云う。女は長い髪を枕に敷いて、輪郭の柔らかな瓜実顔をその中に横たえている。真白な頬の底に温かい血の色がほどよく差して、唇の色は無論赤い。とうてい死にそうには見えない。
  
  示例输出一：
  {{腕組||腕組||**［名］（うでぐみ／抱着胳膊）**両方の腕を胸の前で組むこと。}}をして枕元に坐っていると、仰向に寝た女が、静かな声でもう死にますと云う。女は長い髪を枕に{{敷い||敷く||**［動］**（しく／垫）**平らに広げて置く。}}て、輪郭の柔らかな{{瓜実顔||瓜実顔||**［名］（うりざねがお／瓜子脸）**瓜の種に似て、色白・中高で、やや面長な顔。古くから美人の一典型とされた。}}をその中に{{横たえ||横たえる||**［動］（よこたえる／横卧）**横に寝かせる。}}ている。{{真白||真白||**［形動］（ましろ／纯白）**本当に白いこと。まっしろ。}}な頬の底に温かい血の色がほどよく差して、唇の色は{{無論||無論||**［副］（むろん／更不用说）**論じる必要のないほどはっきりしているさま。言うまでもなく。もちろん。}}赤い。とうてい死にそうには見えない。

  示例输入二：
> おじさんは、鳥籠を可哀想に思い、鳥籠の扉を開けてあげるでしょう。鳥が怖がるなら飛び立たなくてもいい。飛び立って自由に羽ばたき、そのまま帰ってこなくてもいい。鳥はそんな人の元に帰ってくる事があるかもしれませんが、おじさんは鳥が帰ってくる事を強制したりしません。鳥が自由に生き生きと生きる事を、おじさんは心から喜びます。
>
> 鳥を可愛がるもうひとりのおじさんは、鳥の怪我を心配し飛び立ってしまう事も不安で、鳥籠の扉を開ける事はないでしょう。いつか鳥籠の扉が開いた時、鳥はこの場所から逃げ出してしまいたくなります。逃げてしまった鳥に対し、おじさんは怒り狂うでしょう。

  示例输出二：
> おじさんは、鳥籠を{{可哀想||可哀想||**［形動］（かわいそう／可怜）**見ていて不憫である。気の毒である。}}に思い、鳥籠の扉を開けてあげるでしょう。鳥が{{怖がる||怖がる||**［動］（こわがる／害怕）**恐ろしさを感じる。}}なら飛び立たなくてもいい。飛び立って自由に羽ばたき、そのまま帰ってこなくてもいい。鳥はそんな人の元に帰ってくる事があるかもしれませんが、おじさんは鳥が帰ってくる事を{{強制||強制||**［名・形動］（きょうせい／强制）**無理にさせること。}}したりしません。鳥が自由に生き生きと生きる事を、おじさんは心から喜びます。  
>   
> 鳥を可愛がるもうひとりのおじさんは、鳥の怪我を心配し飛び立ってしまう事も不安で、鳥籠の扉を開ける事はないでしょう。いつか鳥籠の扉が開いた時、鳥はこの場所から{{逃げ出し||逃げ出す||**［動］（にげだす／逃走）**逃げていく。}}てしまいたくなります。逃げてしまった鳥に対し、おじさんは{{怒り狂う||怒り狂う||**［動］（おこりくるう／暴跳如雷）**ひどく怒ること。}}でしょう。  
  `,

}
