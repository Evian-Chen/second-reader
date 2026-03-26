<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { suspensionDTO, suspensionRequestDTO } from '@/api/types/suspensionDTO.ts'
import { useSuspensionStore } from '@/stores/suspensionStore.ts'
import { suspensionService } from '@/services/suspensionService.ts'
import { useInterviewerStore } from '@/stores/interviewerStore.ts'
import type { interviewerDTO, updateInterviewerRequestDTO } from '@/api/types/InterviewerDTO.ts'
import { format } from 'date-fns'
import EditInterviewerModal from '@/components/EditInterviewerModal.vue'
import axios from 'axios'
import type { ErrorResponseDTO } from '@/api/types/ErrorResponseDTO.ts'

const store = useInterviewerStore()

const props = defineProps<{
  isEditing: boolean
  curInterviewerInfo: interviewerDTO
}>()
const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const warning = ref('')
const searchQuery = ref('')
const isOpen = ref(false)
const newInterviewer = ref<updateInterviewerRequestDTO>({
  name: props.curInterviewerInfo.name,
  department: props.curInterviewerInfo.department,
  isJunior: props.curInterviewerInfo.isJunior,
  team: props.curInterviewerInfo.team,
})

const handleCancel = () => {
  emit('cancel')
}

const handleConfirm = async () => {
  if (newInterviewer.value.name && newInterviewer.value.department && newInterviewer.value.team) {
    try {
      await store.updateInterviewerById(props.curInterviewerInfo.userId, newInterviewer.value)
      emit('confirm')
      return
    } catch (e) {
      if (axios.isAxiosError<ErrorResponseDTO>(e)) {
        warning.value = e.response?.data.detail as string
      }
      return
    }
  }
  warning.value = 'Please fill all the blank fields.'
}
</script>

<template>
  <div class="edit-interviewer-modal">
    <h2>Edit Interviewer</h2>

    <div class="edit-interviewer-modal-content">
      <div class="info-input-froup">
        <div class="userid-span">
          <span>UserID:</span>
          <input class="modal-input-disabled" v-model="curInterviewerInfo.userId" disabled />
        </div>

        <div class="name-input">
          <span>Name: </span>
          <input
            class="modal-input"
            v-model="newInterviewer.name"
            type="text"
            :placeholder="curInterviewerInfo.name"
          />
        </div>

        <div class="dept-input">
          <span>Department: </span>
          <input
            class="modal-input"
            v-model="newInterviewer.department"
            type="text"
            :placeholder="curInterviewerInfo.department"
          />
        </div>

        <div class="team-input">
          <span>Team: </span>
          <input
            class="modal-input"
            v-model="newInterviewer.team"
            type="text"
            :placeholder="curInterviewerInfo.team"
          />
        </div>

        <div class="is-junior-input">
          <span>Junior: </span>
          <select class="modal-input" v-model="newInterviewer.isJunior">
            <option :value="true">True</option>
            <option :value="false">False</option>
          </select>
        </div>
      </div>
      <span v-if="warning" class="warning-text">{{ warning }}</span>
      <div class="modal-actions">
        <button class="button-cancel" @click="handleCancel">Cancel</button>
        <button class="button" @click="handleConfirm">Confirm</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-interviewer-modal {
  background-color: #ffffff;
  width: 90%;
  max-width: 1200px;
  max-height: 1000px;
  padding: 12px;
  border-radius: 8px;
}

.edit-interviewer-modal-content {
  width: 95%;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reason-input-box input {
  border: none;
  background: transparent;
  padding: 8px;
  outline: none;
  width: 200px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.info-input-froup {
  display: flex;
  gap: 12px;
}

.button-text {
  font-weight: 700;
  color: white;
}

.warning-text {
  font-weight: 500;
  color: #ff0000;
}

.button {
  background: #0f172a;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.button-disabled {
  background: #e6e6e6;
  color: #000000;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: bold;
}

.dropdown-list li {
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-list li:hover {
  background-color: #f1f5f9;
}

.modal-input-disabled {
  width: 100%;
  padding-top: 12px;
  border: 1px solid #ffffff;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  background-color: #ffffff;
  outline: none;
  box-sizing: border-box;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.modal-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  background-color: #ffffff;
  outline: none;
  box-sizing: border-box;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.modal-input:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.1);
}

.modal-input::placeholder {
  color: #94a3b8;
}

.userid-span span,
.name-input span,
.dept-input span,
.team-input span,
.is-junior-input span {
  font-weight: 700;
}

.button-cancel {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #000000;
  background-color: transparent;
  border: 1px solid #000000;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
</style>
