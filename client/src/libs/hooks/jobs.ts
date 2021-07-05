import { useCallback, useEffect, useState } from 'react'
import get from 'lodash/get'
import { GraphQLAPI, graphqlOperation } from '@aws-amplify/api-graphql'

import { ListUserJobs } from '@libs/graphql/queries'
import {
  onCreateJobSubscription,
  onUpdateJobSubscription,
} from '@libs/graphql/subscriptions'
import { useAppContext } from '@libs/contextLib'
import type { Job } from '@libs/types'
import { ObservableGraphQLResult, subscribeGql } from '@libs/subscriptionLib'

export interface JobsResult {
  jobs: Job[]
  isLoading: boolean
}

interface OnCreateJob {
  onCreateJob: Job
}

interface OnUpdateJob {
  onUpdateJob: Job
}

export function useJobs(): JobsResult {
  const { user } = useAppContext()
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchJobs()
    const onCreateJobSubscription = subscribeOnCreateJob()
    const onUpdateJobSubscription = subscribeOnUpdateJob()
    return () => {
      onCreateJobSubscription.unsubscribe()
      onUpdateJobSubscription.unsubscribe()
    }
  }, [])

  const fetchJobs = useCallback(async () => {
    const response = await GraphQLAPI.graphql(graphqlOperation(ListUserJobs))
    const jobs = get(response, 'data.listUserJobs.items', [])
    setJobs(jobs)
  }, [])

  const subscribeOnCreateJob = useCallback(() => {
    return subscribeGql<ObservableGraphQLResult<OnCreateJob>>(
      onCreateJobSubscription,
      { user_id: user?.username },
      ({ value }) => {
        const newJob = value?.data?.onCreateJob
        if (newJob) {
          setJobs(jobs => [newJob, ...jobs])
        }
      }
    )
  }, [user])

  const subscribeOnUpdateJob = useCallback(() => {
    return subscribeGql<ObservableGraphQLResult<OnUpdateJob>>(
      onUpdateJobSubscription,
      { user_id: user?.username },
      ({ value }) => {
        const updatedJob = value?.data?.onUpdateJob as Job
        if (updatedJob) {
          setJobs(jobs =>
            jobs.map(job => (job.id === updatedJob.id ? updatedJob : job))
          )
        }
      }
    )
  }, [user])

  return { jobs, isLoading }
}
