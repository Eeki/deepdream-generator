import { useCallback, useEffect, useState } from 'react'
import get from 'lodash/get'
import { GraphQLAPI, graphqlOperation } from '@aws-amplify/api-graphql'

import { ListUserJobs } from '../graphql/queries'
import {
  onCreateJobSubscription,
  onUpdateJobSubscription,
} from '../graphql/subscriptions'
import { useAppContext } from '../contextLib'
import { ObservableGraphQLResult, subscribeGql } from '../subscriptionLib'
import type { Job } from '../types'
import { onError } from '../errorLib'

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
    if (user) {
      fetchJobs()
      const onCreateJobSubscription = subscribeOnCreateJob()
      const onUpdateJobSubscription = subscribeOnUpdateJob()
      return () => {
        onCreateJobSubscription.unsubscribe()
        onUpdateJobSubscription.unsubscribe()
      }
    }
  }, [user])

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await GraphQLAPI.graphql(graphqlOperation(ListUserJobs))
      const jobs = get(response, 'data.listUserJobs.items', [])
      setJobs(jobs)
      // TODO better typing for errors
    } catch (e: any) {
      onError(e)
    } finally {
      setIsLoading(false)
    }
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
