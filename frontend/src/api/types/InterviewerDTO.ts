export interface interviewerDTO {
  userId: string
  name: string
  department: string
  isJunior: boolean
  isDeleted: boolean
  team: string
}

export interface updateInterviewerRequestDTO {
  name: string
  department: string
  team: string
  isJunior: boolean
}

export interface createInterviewerRequestDTO {
  userId: string
  name: string
  department: string
  team: string
  isJunior: boolean
}

export interface PageResponse<T> {
  totalItems: number
  pageNumber: number
  pageSize: number
  items: T[]
}

