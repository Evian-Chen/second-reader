<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import type { suspensionDTO, suspensionRequestDTO } from '@/api/types/suspensionDTO.ts'
import { useSuspensionStore } from '@/stores/suspensionStore.ts'
import { suspensionService } from '@/services/suspensionService.ts'
import { useInterviewerStore } from '@/stores/interviewerStore.ts'
import type { createInterviewerRequestDTO, interviewerDTO } from '@/api/types/InterviewerDTO.ts'
import { format } from 'date-fns'
import axios, { type AxiosError } from 'axios'
import type { ErrorResponseDTO } from '@/api/types/ErrorResponseDTO.ts'

const store = useInterviewerStore()

const props = defineProps<{
  isCreating: boolean
}>()
const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const warning = ref('')
const newInterviewer = ref<createInterviewerRequestDTO>({
  userId: '',
  name: '',
  department: '',
  team: '',
  isJunior: false,
})
const handleCancel = () => {
  emit('cancel')
}

const handleConfirm = async () => {
  if (
    newInterviewer.value.userId &&
    newInterviewer.value.name &&
    newInterviewer.value.department &&
    newInterviewer.value.team
  ) {
    try {
      await store.createInterviewer(newInterviewer.value)
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

watch(
  newInterviewer,
  (newInterviewer) => {
    warning.value = ''
  },
  { deep: true },
)
</script>

<template>
  <div class="edit-interviewer-modal">
    <h2>Create Interviewer</h2>

    <div class="create-suspension-modal-content">
      <div class="info-input-froup">
        <div class="userid-span">
          <span>UserID:</span>
          <input class="modal-input" v-model="newInterviewer.userId" placeholder="Enter User ID" />
        </div>

        <div class="name-input">
          <span>Name: </span>
          <input
            class="modal-input"
            v-model="newInterviewer.name"
            type="text"
            placeholder="Enter Name"
          />
        </div>

        <div class="dept-input">
          <span>Department: </span>
          <input
            class="modal-input"
            v-model="newInterviewer.department"
            type="text"
            placeholder="Enter Department"
          />
        </div>

        <div class="team-input">
          <span>Team: </span>
          <input
            class="modal-input"
            v-model="newInterviewer.team"
            type="text"
            placeholder="Enter Team"
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

.create-suspension-modal-content {
  width: 95%;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.native-select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  background-color: white;
  cursor: pointer;
  outline: none;
  min-width: 200px;
}

.native-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.reason-input-box {
  display: flex;
  background: #f1f5f9;
  border: 2px solid #ccc;
  border-radius: 12px;
  padding: 6px 12px;
  align-items: center;
}

.reason-input-box input {
  border: none;
  background: transparent;
  padding: 8px;
  outline: none;
  width: 200px;
}
.generated-suspension {
  width: 100%;
  max-width: 2400px;
  justify-content: center;
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 10px;
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

.text {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
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

.list-header-grid,
.interviewer-card {
  display: grid;
  grid-template-columns: 0.6fr 1fr 1fr 1fr 2fr 2fr;
  align-items: center;
  gap: 8px;
}

.list-header-grid {
  margin-bottom: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.id-col {
  width: 100%;
  display: flex;
}

.date-col,
.name-col,
.reason-col,
.none,
.team-col,
.dept-col {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.name-text {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
}

.rank-tag {
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.rank-tag.junior {
  background: #f0fdf4;
  color: #16a34a;
  max-width: 65px;
  margin-left: 3px;
}

.searchable-select-container {
  position: relative;
  min-width: 200px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.styled-search-input {
  width: 100%;
  padding: 8px 10px 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  background-color: white;
  cursor: pointer;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.styled-search-input:focus {
  border-color: #ccc;
}

.dropdown-list {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dropdown-list li {
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-list li:hover {
  background-color: #f1f5f9;
}

.no-result {
  color: #94a3b8;
  font-style: italic;
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
