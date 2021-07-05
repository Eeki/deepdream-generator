import React, { useCallback, useState } from 'react'
import API from '@aws-amplify/api'
import { Button, Box, Text, Flex } from '@chakra-ui/react'

import { onError } from '@libs/errorLib'
import type { FileRecord } from '@libs/types'
import { SelectParameters } from '@containers/GenerateDeepdream/SelectParameters'
import { initParams, paramName } from './const'

interface GenerateDeepdreamProps {
  fileRecord?: FileRecord
}
export const GenerateDeepdream = ({
  fileRecord,
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

  console.log(params)

  return (
    <Box
      boxShadow="2xl"
      direction="column"
      w="md"
      borderWidth="1.1px"
      borderRadius="lg"
      overflow="hidden"
      padding="1rem"
      marginLeft="2rem"
      height="700px"
    >
      {fileRecord ? (
        <Flex
          height="100%"
          flexDirection="column"
          justifyContent="space-between"
        >
          <SelectParameters params={params} handleChange={handleChange} />
          <Button
            isDisabled={!fileRecord}
            isLoading={isLoading}
            onClick={createJob}
            colorScheme="teal"
            size="lg"
          >
            Generate a Deepdream
          </Button>
        </Flex>
      ) : (
        <Flex height="100%" flexDirection="column" justifyContent="center">
          <Text color="gray.500">Select a file to generate a Deepdream</Text>
        </Flex>
      )}
    </Box>
  )
}
