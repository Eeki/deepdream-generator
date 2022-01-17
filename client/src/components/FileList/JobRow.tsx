import React from 'react'
import {
  Flex,
  Text,
  Spacer,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react'
import { formatDistance } from 'date-fns'
import type { Job } from '../../libs/types'

interface JobRowProps {
  job: Job
  style: any
}

const getJobStatusLabel = (resultPath?: string, startedAt?: number): string => {
  if (resultPath) {
    return 'Finished'
  }
  if (!startedAt) {
    return 'Waiting to start'
  }
  return 'Running'
}

const getElapsedTime = (startedAt: number): string =>
  formatDistance(new Date(startedAt), new Date(), {
    includeSeconds: true,
  })

export const JobRow = ({ job, style }: JobRowProps): JSX.Element => {
  const { progress, started_at, input_name, result_path, id } = job
  const progressPercentage = progress * 100
  const elapsedTime =
    started_at && !result_path ? getElapsedTime(started_at) : null
  return (
    <div style={style} key={id}>
      <Flex
        marginBottom="1rem"
        padding="0.5rem"
        height="calc(100px - 1rem)"
        borderWidth="1px"
        overflow="hidden"
        borderRadius="base"
      >
        <Flex direction="column">
          <Text align="left">
            <strong>File:</strong> {input_name}
          </Text>
          <Text align="left">
            <strong>Status:</strong>{' '}
            {getJobStatusLabel(result_path, started_at)}
          </Text>
          {elapsedTime && (
            <Text align="left">
              <strong>Running time:</strong> {elapsedTime}
            </Text>
          )}
        </Flex>
        <Spacer />
        <CircularProgress
          size="calc(100px - 2rem)"
          value={progressPercentage}
          color="green.400"
        >
          <CircularProgressLabel>{progressPercentage}%</CircularProgressLabel>
        </CircularProgress>
      </Flex>
    </div>
  )
}
