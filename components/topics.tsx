import { stringToColor } from '@/lib/utils'
import { Chip } from '@nextui-org/chip'

export default function Topics({ topics, remove }: { topics: string[] | null | undefined, remove?: (topic: string) => void }) {
  return topics && topics.length > 0 && <div className={`flex gap-2 mt-1 justify-center items-center`}>
    {topics.map(topic => <Chip key={topic} size='sm' variant='flat' onClose={remove && (() => {
      remove(topic)
    })} color={stringToColor(topic)}>{topic}</Chip>)
    }
  </div >
}
