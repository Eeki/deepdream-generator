import React, { useCallback, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
} from '@chakra-ui/react'

import { useS3PrivateLink } from '../libs/hooks/s3'
import type { FileRecord } from '../libs/types'
import { s3PrivateGet } from '../libs/awsS3Lib'

interface PreviewProps {
  fileRecord: FileRecord
  closePreview: () => void
  deleteFileRecord: (filePath: string) => Promise<boolean>
}

// TODO: The download don't work for all of the files and it is just opening the image as fullscreen.
//  Force the download somehow.

export const ImagePreview = ({
  fileRecord: { file_path, file_name },
  closePreview,
  deleteFileRecord,
}: PreviewProps): JSX.Element => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const fileUrl = useS3PrivateLink(file_path)

  const createDownload = useCallback(async () => {
    const url = await s3PrivateGet(file_path)
    const link = document.createElement('a')
    link.href = url
    link.download = file_name
    link.target = '_blank'
    link.click()
    link.remove()
  }, [file_path, file_name])

  const deleteFileAndClose = useCallback(async () => {
    setIsDeleteLoading(true)
    const success = await deleteFileRecord(file_path)
    if (success) {
      closePreview()
    }
  }, [file_path])

  return (
    <Modal isOpen={true} onClose={closePreview} size="xl">
      <ModalOverlay />
      <ModalContent margin="1rem">
        <ModalHeader>{file_name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image
            maxHeight="80vh"
            width="100%"
            objectFit="cover"
            src={fileUrl}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={deleteFileAndClose}
            isLoading={isDeleteLoading}
          >
            Delete
          </Button>
          <Button colorScheme="blue" mr={3} onClick={createDownload}>
            Download
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
