import React, { useEffect, useState } from 'react'
import get from 'lodash/get'
import { API, graphqlOperation } from 'aws-amplify'
import { FixedSizeList as List } from 'react-window'
import { JobRow } from './JobRow'
import type { Job } from '@libs/types'
import { Box } from '@chakra-ui/react'
import { ListUserJobs } from '@libs/graphql/queries'
import { onCreateJob, onUpdateJob } from '@libs/graphql/subscriptions'
import { useAppContext } from '@libs/contextLib'

export const JobList = (): JSX.Element => {
  const { user } = useAppContext()
  const [jobs, setJobs] = useState<Job[]>([])

  // ToDo create custom hook from fetching and subscribeing jobs
  useEffect(() => {
    fetchJobs()
    const onCreateJobSubscription = subscribeOnCreateJob()
    const onUpdateJobSubscription = subscribeOnUpdateJob()
    return () => {
      onCreateJobSubscription.unsubscribe()
      onUpdateJobSubscription.unsubscribe()
    }
  }, [])

  async function fetchJobs(): Promise<void> {
    const response = await API.graphql(graphqlOperation(ListUserJobs))
    const jobs = get(response, 'data.listUserJobs.items', [])
    setJobs(jobs)
  }

  // TODO generalize subscriptions to hooks
  // TODO fix ts errors
  function subscribeOnCreateJob(): any {
    return API.graphql(
      graphqlOperation(onCreateJob, { user_id: user?.username })
    ).subscribe({
      next: ({ provider, value }) => {
        console.log('subscription', { provider, value })
        const newJob = value?.data?.onCreateJob as Job
        if (newJob) {
          setJobs(jobs => [newJob, ...jobs])
        }
      },
      error: error => console.warn('subscription error', error),
    })
  }

  function subscribeOnUpdateJob(): any {
    return API.graphql(
      graphqlOperation(onUpdateJob, { user_id: user?.username })
    ).subscribe({
      next: ({ provider, value }) => {
        console.log('subscription', { provider, value })
        const updatedJob = value?.data?.onUpdateJob as Job
        if (updatedJob) {
          setJobs(jobs =>
            jobs.map(job => (job.id === updatedJob.id ? updatedJob : job))
          )
        }
      },
      error: error => console.warn('subscription error', error),
    })
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
