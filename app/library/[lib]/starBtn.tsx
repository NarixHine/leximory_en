'use client'

import { Button } from '@nextui-org/button'
import star from './star'
import { FaRectangleList } from 'react-icons/fa6'
import { BsPinAngleFill } from 'react-icons/bs'
import { FaRegRectangleList } from 'react-icons/fa6'
import { BsPinAngle } from 'react-icons/bs'

export default function Star({ lib, isStarred }: { lib: string, userId: string, isStarred: boolean }) {
    return <Button
        className='pointer-events-auto'
        isIconOnly
        startContent={isStarred ? <FaRectangleList /> : <FaRegRectangleList />}
        endContent={isStarred ? <BsPinAngleFill /> : <BsPinAngle />}
        variant='ghost'
        color={isStarred ? 'warning' : undefined}
        onPress={() => star(lib)}
    />
}
