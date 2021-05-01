export interface FileRecord {
  file_path: string
  file_name: string
  created_at?: number
  mime_type?: string
}

export interface Job {
  id: string
  input_path: string
  input_name: string
  result_path: string
  progress: number
  started_at: number
}
