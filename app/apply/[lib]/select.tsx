'use client'

import { Select, SelectItem } from '@nextui-org/select'

export default function AccessSelector({ isReadOnly }: {
    isReadOnly: boolean,
}) {
    return (
        <>
            <Select
                defaultSelectedKeys={[isReadOnly ? 'write' : 'read']}
                disabledKeys={isReadOnly ? ['read'] : []}
                description={isReadOnly ? '您已有读取权限。' : '您暂无该文库的权限。'}
                label='要索取的权限'
                color='secondary'
                variant='underlined'
                name='access'
            >
                <SelectItem key={'read'} value={'read'}>
                    只读
                </SelectItem>
                <SelectItem key={'write'} value={'write'}>
                    读写
                </SelectItem>
            </Select>
        </>
    )
}