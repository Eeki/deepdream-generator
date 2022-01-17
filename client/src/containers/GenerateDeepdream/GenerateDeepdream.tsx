import React, { useCallback, useState } from 'react'
import API from '@aws-amplify/api'
import { Button, Text, Flex, Center } from '@chakra-ui/react'

import { onError } from '../../libs/errorLib'
import type { FileRecord } from '../../libs/types'
import { SelectParameters } from './SelectParameters'
import { Card } from '../../components/Card'
import { initParams, paramName } from './const'

interface GenerateDeepdreamProps {
  fileRecord?: FileRecord
  onCancel?: () => void
}
export const GenerateDeepdream = ({
  fileRecord,
  onCancel,
}: GenerateDeepdreamProps): JSX.Element => {
  const [params, setParams] = useState(initParams)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = useCallback(
    (fieldName: paramName) => (value: number) =>
      setParams(values => ({
        ...values,
        [fieldName]: value,
      })),
    []
  )

  const createJob = useCallback(async () => {
    if (fileRecord) {
      setIsLoading(true)
      try {
        await API.post('jobs', '/jobs', {
          body: {
            input_path: fileRecord.file_path,
            input_name: fileRecord.file_name,
            params: JSON.stringify(params),
          },
        })
      } catch (error: any) {
        onError(error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [fileRecord, params])

  return (
    <Card height="100%">
      <Flex
        direction="column"
        height="100%"
        maxWidth="md"
        width="100vw"
        flexDirection="column"
        justifyContent="space-between"
        overflow="hidden"
        padding="1rem"
      >
        {fileRecord ? (
          <>
            <SelectParameters params={params} handleChange={handleChange} />
            <Flex marginTop="1rem">
              {typeof onCancel === 'function' && (
                <Button
                  size="lg"
                  minH={12}
                  variant="ghost"
                  onClick={onCancel}
                  marginRight="1rem"
                >
                  Cancel
                </Button>
              )}
              <Button
                minH={12}
                isDisabled={!fileRecord}
                isLoading={isLoading}
                onClick={createJob}
                colorScheme="teal"
                size="lg"
                flexGrow={1}
              >
                Generate a Deepdream
              </Button>
            </Flex>
          </>
        ) : (
          <Center height="100%">
            <Text color="gray.500">Select a file to generate a Deepdream</Text>
          </Center>
        )}
      </Flex>
    </Card>
  )
}
