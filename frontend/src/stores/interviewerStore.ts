import { defineStore } from 'pinia'
import { ref } from 'vue'
import { interviewerService } from '../services/interviewerService'
import type {
  createInterviewerRequestDTO,
  interviewerDTO,
  updateInterviewerRequestDTO
} from '@/api/types/InterviewerDTO.ts'

export const useInterviewerStore = defineStore('interviewer', () => {
  const interviewers = ref<interviewerDTO[]>([])
  const loading = ref(false)
  const pageNum = ref(1)
  const pageSize = ref(10)
  const searchName = ref('')
  const totalItems = ref(0)
  const orderType = ref(null as null | string)
  const isAscending = ref(null as null | boolean)

  const allInterviewers = ref<interviewerDTO[]>([])

  const fetchAllInterviewers = async () => {
    try {
      const response = await interviewerService.getInterviewers(
        -1, -1, searchName.value
      )
      allInterviewers.value = response.items || []
    } catch (error) {
      console.error('Fetch failed:', error)
      allInterviewers.value = []
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchInterviewers = async () => {
    loading.value = true
    try {
      const response = await interviewerService.getInterviewers(
        pageNum.value,
        pageSize.value,
        searchName.value,
        orderType.value,
        isAscending.value
      )
      interviewers.value = response.items || []
      totalItems.value = response.totalItems || 0
    } catch (error) {
      console.error('Fetch failed:', error)
      interviewers.value = []
      totalItems.value = 0
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchInterviewerById = async (userId: string) => {
    try {
      return await interviewerService.getInterviewerById(userId)
    } catch (error) {
      console.error('Fetch failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateInterviewerById = async (userId: string, payload: updateInterviewerRequestDTO) => {
    try {
      return await interviewerService.updateInterviewerById(userId, payload)
    } catch (error) {
      console.error('Fetch failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createInterviewer = async (payload: createInterviewerRequestDTO) => {
    try {
      return await interviewerService.createInterviewer(payload)
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const triggerSearch = async () => {
    pageNum.value = 1
    await fetchInterviewers()
  }

  const setPage = async (newPage: number) => {
    pageNum.value = newPage
    await fetchInterviewers()
  }

  return {
    interviewers,
    allInterviewers,
    loading,
    pageNum,
    pageSize,
    searchName,
    totalItems,
    fetchInterviewers,
    fetchAllInterviewers,
    triggerSearch,
    setPage,
    orderType,
    isAscending,
    fetchInterviewerById,
    updateInterviewerById,
    createInterviewer
  }
})
