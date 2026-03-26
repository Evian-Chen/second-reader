import type {
  createInterviewerRequestDTO,
  interviewerDTO,
  PageResponse,
  updateInterviewerRequestDTO
} from '../api/types/InterviewerDTO.ts'
import api from '../api/axiosInstance.ts'
import axios from "axios";
import type {ErrorResponseDTO} from "@/api/types/ErrorResponseDTO.ts";

const BASE_URL = '/api/interviewers'

export const interviewerService = {
  async getInterviewers(
    pageNum: number,
    pageSize: number,
    keyword?: string,
    orderType?: string | null,
    isAscending?: boolean | null,
  ): Promise<PageResponse<interviewerDTO>> {
    try {
      const response = await api.get<PageResponse<interviewerDTO>>(BASE_URL, {
        params: {
          PageNumber: pageNum,
          PageSize: pageSize,
          Keyword: keyword?.trim() || undefined,
          orderType: orderType?.trim(),
          isAscending: isAscending,
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError<ErrorResponseDTO>(error)) {
        console.error(error)
      }
      throw error
    }
  },
  async getInterviewerById(userId: string): Promise<interviewerDTO> {
    try {
      const response = await api.get<interviewerDTO>(BASE_URL + `/${userId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError<ErrorResponseDTO>(error)) {
        console.error(error)
      }
      throw error
    }
  },
  async updateInterviewerById(userId: string, payload: updateInterviewerRequestDTO): Promise<void> {
    try {
      const response = await api.put(BASE_URL + `/${userId}`, {
        name: payload.name,
        department: payload.department,
        team: payload.team,
        isJunior: payload.isJunior
      })
      return
    } catch (error) {
      if (axios.isAxiosError<ErrorResponseDTO>(error)) {
        console.error(error)
      }
      throw error
    }
  },
  async createInterviewer(payload: createInterviewerRequestDTO): Promise<void> {
    try {
      const response = await api.post(BASE_URL, {
        userId: payload.userId,
        name: payload.name,
        department: payload.department,
        team: payload.team,
        isJunior: payload.isJunior
      })
      return
    } catch (error) {
      if (axios.isAxiosError<ErrorResponseDTO>(error)) {
        console.error(error)
      }
      throw error
    }
  }
}
