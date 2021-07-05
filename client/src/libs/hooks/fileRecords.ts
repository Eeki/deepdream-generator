import { useCallback, useEffect, useState } from 'react'
import type { FileRecord } from '@libs/types'
import { GraphQLAPI, graphqlOperation } from '@aws-amplify/api-graphql'
import { onCreateFileSubscription } from '@libs/graphql/subscriptions'
import { ListUserFileRecords } from '@libs/graphql/queries'
import get from 'lodash/get'
import orderBy from 'lodash/orderBy'
import { onError } from '@libs/errorLib'
import { subscribeGql, ObservableGraphQLResult } from '@libs/subscriptionLib'
import { useAppContext } from '@libs/contextLib'
import { DeleteOwnFileRecord } from '@libs/graphql/mutations'

export interface UseFileRecordsResult {
  fileRecords: FileRecord[]
  isLoading: boolean
  deleteFileRecord: (file_path: string) => Promise<boolean>
}

export interface OnCreateFile {
  onCreateFile: FileRecord
}

export function useFileRecords(): UseFileRecordsResult {
  const [fileRecords, setFileRecords] = useState<FileRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAppContext()

  useEffect(() => {
    fetchFileRecords()
    const onCreateFileRecordSubscription = subscribeOnCreateFile()
    return () => onCreateFileRecordSubscription.unsubscribe()
  }, [])

  const fetchFileRecords = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await GraphQLAPI.graphql(
        graphqlOperation(ListUserFileRecords)
      )
      const fileRecords = get(response, 'data.listUserFiles.items', [])
      const sortedFileRecords = orderBy(fileRecords, ['created_at'], ['desc'])
      setFileRecords(sortedFileRecords)
    } catch (error) {
      onError(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const subscribeOnCreateFile = useCallback(() => {
    return subscribeGql<ObservableGraphQLResult<OnCreateFile>>(
      onCreateFileSubscription,
      { user_id: user?.username },
      ({ value }) => {
        const newFileRecord = value?.data?.onCreateFile
        if (newFileRecord) {
          setFileRecords(fileRecords => [newFileRecord, ...fileRecords])
        }
      }
    )
  }, [user])

  const deleteFileRecord = useCallback(
    async (file_path: string): Promise<boolean> => {
      try {
        await GraphQLAPI.graphql(
          graphqlOperation(DeleteOwnFileRecord, {
            file_path,
          })
        )
        setFileRecords(fileRecords =>
          fileRecords.filter(fileRecord => fileRecord.file_path !== file_path)
        )
        return true
      } catch (error) {
        onError(error)
        return false
      }
    },
    []
  )

  return { fileRecords, isLoading, deleteFileRecord }
}
