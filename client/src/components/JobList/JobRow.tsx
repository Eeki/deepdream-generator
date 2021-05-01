import React from 'react'
import {
  Flex,
  Text,
  Spacer,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react'
import type { ListChildComponentProps } from 'react-window'
import { formatDistance } from 'date-fns'
import type { Job } from '@libs/types'

interface JobRowProps extends ListChildComponentProps {
  data: Job[]
  index: number
  style: any
}

const getJobStatusLabel = (resultPath?: string, startedAd?: number): string => {
  if (resultPath) {
    return 'Finished'
  }
  if (!startedAd) {
    return 'Waiting to start'
  }
  return 'Running'
}

const getElapsedTime = (startedAt: number): string =>
  formatDistance(new Date(startedAt * 1000), new Date(), {
    includeSeconds: true,
  })

export const JobRow = ({ data, index, style }: JobRowProps): JSX.Element => {
  const { progress, started_at, input_name, result_path } = data[index]
  const progressPercentage = progress * 100
  const elapsedTime =
    started_at && !result_path ? getElapsedTime(started_at) : null
  return (
    <div style={style}>
      <Flex
        marginBottom="1rem"
        padding="0.5rem"
        height="calc(100px - 1rem)"
        borderWidth="1px"
        overflow="hidden"
        borderRadius="base"
      >
        <Flex direction="column">
          <Text align="left">File: {input_name}</Text>
          <Text align="left">
            Status: {getJobStatusLabel(result_path, started_at)}
          </Text>
          {elapsedTime && <Text align="left">Running time: {elapsedTime}</Text>}
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
