<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElDatePicker } from 'element-plus'
import { Calendar } from '@element-plus/icons-vue'
import type { suspensionDTO, suspensionRequestDTO } from '@/api/types/suspensionDTO.ts'
import { useSuspensionStore } from '@/stores/suspensionStore.ts'
import { suspensionService } from '@/services/suspensionService.ts'
import { useInterviewerStore } from '@/stores/interviewerStore.ts'
import type { interviewerDTO } from '@/api/types/InterviewerDTO.ts'
import { format } from 'date-fns'

const suspensionStore = useSuspensionStore()
const intervewerStore = useInterviewerStore()

const props = defineProps<{
  isCreating: boolean
}>()
const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const toSuspend = ref<suspensionRequestDTO>({
  UserId: '',
  startDate: new Date(),
  endDate: new Date(),
  reason: '',
})
const suspensionRange = ref<[Date, Date] | []>([])

const selectedInterviewer = ref<interviewerDTO>()
const existingRecords = ref<suspensionDTO[]>([])
const warning = ref('')

const disabledDate = (time: Date) => {
  if (time.getTime() < Date.now() - 8.64e7) return true

  if (!existingRecords.value.length) return false

  return existingRecords.value.some((record) => {
    const start = new Date(record.startDate)
    const end = new Date(record.endDate)
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)
    const current = new Date(time)
    current.setHours(0, 0, 0, 0)

    return current >= start && current <= end
  })
}

const resetForm = () => {
  toSuspend.value = {
    UserId: '',
    startDate: new Date(),
    endDate: new Date(),
    reason: '',
  }
  suspensionRange.value = []
  selectedInterviewer.value = undefined
  existingRecords.value = []
  searchQuery.value = ''
  warning.value = ''
}

const formatToCustomDate = (dateInput: string | Date) => {
  const date = new Date(dateInput)
  return format(date, 'dd/MM/yyyy')
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

const handleConfirm = async () => {
  if (!selectedInterviewer.value) {
    warning.value = 'Please select an interviewer'
    return
  }
  if (!suspensionRange.value || suspensionRange.value.length < 2) {
    warning.value = 'Please select a date range.'
    return
  }
  if (!suspensionRange.value || suspensionRange.value.length < 2) {
    warning.value = 'Please select a date range.'
    return
  }
  const [start, end] = suspensionRange.value as [Date, Date]
  toSuspend.value.startDate = start
  toSuspend.value.endDate = end

  try {
    await suspensionService.createSuspension(toSuspend.value)
    resetForm()
    emit('confirm')
  } catch (error) {
    console.error(error)
    warning.value = 'Failed to create suspension'
  }
}

const searchQuery = ref('')
const isOpen = ref(false)

const filteredList = computed(() => {
  return intervewerStore.allInterviewers.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const select = async (interviewer: interviewerDTO) => {
  selectedInterviewer.value = interviewer
  searchQuery.value = interviewer.name
  isOpen.value = false
  toSuspend.value.UserId = interviewer.userId
  try {
    const response = await suspensionService.getSuspensions(1, 100, interviewer.name)
    existingRecords.value = response.items

    const targetDate = new Date()
    targetDate.setHours(0, 0, 0, 0)

    while (isDateDisabled(targetDate)) {
      targetDate.setDate(targetDate.getDate() + 1)
    }
    suspensionRange.value = [new Date(targetDate), new Date(targetDate)]
  } catch (error) {
    console.error('Failed to fetch existing records', error)
    existingRecords.value = []
  }
}

const isDateDisabled = (date: Date): boolean => {
  if (!existingRecords.value.length) return false

  return existingRecords.value.some((record) => {
    const start = new Date(record.startDate)
    const end = new Date(record.endDate)
    const current = new Date(date)
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)
    current.setHours(0, 0, 0, 0)

    return current >= start && current <= end
  })
}

onMounted(() => {
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.searchable-select-container')) {
      isOpen.value = false
    }
  })
})

watch(
  () => props.isCreating,
  (newVal) => {
    resetForm()
  },
)
watch(suspensionRange, () => {
  warning.value = ''
})
</script>

<template>
  <div v-if="isCreating" class="create-suspension-modal-overlay">
    <div class="edit-interviewer-modal">
      <h2>Generate suspension</h2>

      <div class="create-suspension-modal-content">
        <div class="input-row">
          <div class="input-group searchable-select-container">
            <label class="label">Interviewer Name</label>
            <div class="input-wrapper">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Select or Search name..."
                class="styled-search-input"
                @focus="isOpen = true"
                @click="isOpen = !isOpen"
              />
            </div>

            <ul v-if="isOpen && filteredList.length" class="dropdown-list">
              <li
                v-for="interviewer in filteredList"
                :key="interviewer.userId"
                @click="select(interviewer)"
              >
                {{ interviewer.name }}
              </li>
              <li v-if="filteredList.length === 0" class="no-result">No matches found</li>
            </ul>
          </div>

          <div class="input-group full-width">
            <label class="label">Suspension Period</label>
            <el-date-picker
              v-model="suspensionRange"
              type="daterange"
              range-separator="To"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              :disabled-date="disabledDate"
              format="DD/MM/YYYY"
              :clearable="false"
              popper-class="custom-schedule-picker"
              :prefix-icon="Calendar"
            />
          </div>
        </div>

        <span v-if="warning" class="warning-text">{{ warning }}</span>

        <div class="input-group full-width">
          <label class="label">Suspension Reason</label>
          <div class="reason-input-box">
            <input
              v-model="toSuspend.reason"
              type="text"
              placeholder="e.g. Annual Leave, Business Trip..."
            />
          </div>
        </div>
        <div v-if="selectedInterviewer">
          <span class="text">Interviewer to be suspensed</span>
          <div class="generated-suspension">
            <section class="list-section">
              <div class="list-header-grid">
                <div>User ID</div>
                <div>Name</div>
                <div>Dept</div>
                <div>Team</div>
                <div>Date Range</div>
                <div>Reason</div>
              </div>
            </section>
            <div class="interviewer-card">
              <div class="id-col">
                <span>{{ toSuspend.UserId }}</span>
              </div>
              <div class="name-col">
                <span class="name-text">{{ selectedInterviewer.name }}</span>
              </div>
              <div class="dept-col">
                <span>{{ selectedInterviewer.department }}</span>
              </div>
              <div class="team-col">
                <span>{{ selectedInterviewer.team }}</span>
              </div>
              <div class="date-col">
                <span>
                  {{ formatToCustomDate(toSuspend.startDate) }} ~
                  {{ formatToCustomDate(toSuspend.endDate) }}
                </span>
              </div>
              <div class="reason-col">
                <span>{{ toSuspend.reason || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="button-cancel" @click="handleCancel">Cancel</button>
        <button class="button" @click="handleConfirm">Confirm</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-suspension-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
}

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

.input-row {
  display: flex;
  gap: 20px;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-weight: 700;
  color: #334155;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.styled-search-input,
.reason-input-box {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  font-size: 14px;
  transition: all 0.2s;
}

.reason-input-box {
  background: #f8fafc;
  padding: 2px 14px;
}

.reason-input-box input {
  border: none;
  background: transparent;
  width: 100%;
  height: 36px;
  outline: none;
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
