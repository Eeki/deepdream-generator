import React, { useEffect, useState } from 'react'
import get from 'lodash/get'
import { API, graphqlOperation } from 'aws-amplify'
import { FixedSizeList as List } from 'react-window'
import { JobRow } from './JobRow'
import type { Job } from '@libs/types'
import { Box } from '@chakra-ui/react'
import { ListUserJobs } from '@libs/graphql/queries'

export const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    fetchJobs()
  }, [])

  async function fetchJobs(): Promise<void> {
    const response = await API.graphql(graphqlOperation(ListUserJobs))
    const jobs = get(response, 'data.listUserJobs.items', [])
    setJobs(jobs)
  }

  return (
    <Box
      boxShadow="2xl"
      direction="column"
      w="md"
      borderWidth="1.1px"
      borderRadius="lg"
      overflow="hidden"
      padding="1rem"
    >
      <List
        height={300}
        itemCount={jobs.length}
        itemSize={100}
        width="100%"
        itemData={jobs}
      >
        {JobRow}
      </List>
    </Box>
  )
}
