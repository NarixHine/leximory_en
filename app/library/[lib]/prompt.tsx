'use client'

import { Button } from '@nextui-org/button'
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'

export default function Prompt({ isReadOnly, isOwner, isStarred, isOrganizational }: {
    isReadOnly: boolean,
    isOwner: boolean,
    isStarred: boolean,
    isOrganizational: boolean,
}) {
    const { isOpen, onOpenChange } = useDisclosure({ defaultOpen: !isOwner && !isStarred && !isOrganizational })

    return <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className='flex flex-col gap-1'>Information</ModalHeader>
                    <ModalBody>
                        <p>
                            You are viewing a library created by another user.
                            <br></br>
                            You can pin it to your dashboard by clicking the pin icon in the bottom-right corner.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='light' onPress={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
}
