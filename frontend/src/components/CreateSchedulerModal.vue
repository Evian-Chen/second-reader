<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElDatePicker } from 'element-plus'
import { useSchedulerStore } from '@/stores/schedulerStore.ts'
import { storeToRefs } from 'pinia'
import { format } from 'date-fns'

const store = useSchedulerStore()
const { generatedScheduler } = storeToRefs(store)

const props = defineProps<{
  isCreating: boolean
}>()
const emit = defineEmits<{
  cancel: []
  confirm: [payload: number]
}>()

const warning = ref('')
const isGenerated = ref(false)
const repeatedDates = ref<Date[]>([])

const scheduleRange = ref<[Date, Date] | []>([])
const disabledDate = (time: Date) => {
  const day = time.getDay()
  return day === 0 || day === 6 || time.getTime() < Date.now() - 8.64e7
}

const handleCancel = () => {
  isGenerated.value = false
  repeatedDates.value = []
  generatedScheduler.value.splice(0)
  emit('cancel')
}

const getNearestMon = (d: Date) => {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  date.setDate(diff)
  return date
}

const handleGenerate = () => {
  if (!scheduleRange.value || scheduleRange.value.length < 2) {
    warning.value = 'You must specify a date range.'
    return
  }

  const [startDate, endDate] = scheduleRange.value as [Date, Date]
  repeatedDates.value = []
  const curDate = getNearestMon(startDate)
  const stopDate = new Date(endDate)

  while (curDate <= stopDate) {
    if (store.allScheduleDates.includes(curDate.toDateString())) {
      repeatedDates.value.push(new Date(curDate))
    }
    curDate.setDate(curDate.getDate() + 7)
  }

  store.createScheduler(startDate, endDate)
  isGenerated.value = true
}

const handleConfirm = async () => {
  await store.confirmScheduler(generatedScheduler.value)
  isGenerated.value = false
  await store.fetchSchedulers()
  emit('confirm', generatedScheduler.value.length)
  generatedScheduler.value.splice(0)
}

watch(
  () => props.isCreating,
  (isOpen) => {
    if (isOpen) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const day = today.getDay()
      const diff = day === 0 ? 1 : 8 - day
      const nextMon = new Date(today)
      nextMon.setDate(today.getDate() + diff)

      const nextFri = new Date(nextMon)
      nextFri.setDate(nextMon.getDate() + 4)

      scheduleRange.value = [nextMon, nextFri]

      generatedScheduler.value.splice(0)
      repeatedDates.value = []
      isGenerated.value = false
    }
  },
)

watch(scheduleRange, () => {
  warning.value = ''
  generatedScheduler.value.splice(0)
  repeatedDates.value = []
  isGenerated.value = false
})
</script>

<template>
  <div v-if="isCreating" class="create-schedule-modal-overlay">
    <div class="create-schedule-modal">
      <h2>Generate Schedule</h2>

      <div class="create-schedule-modal-content">
        <p>Please select the period...</p>

        <div class="datepicker-group">
          <el-date-picker
            v-model="scheduleRange"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            :disabled-date="disabledDate"
            format="DD/MM/YYYY"
            prefix-icon=""
            size="large"
            popper-class="custom-schedule-picker"
          />
        </div>

        <div v-if="warning" class="warning-text">{{ warning }}</div>

        <div v-if="generatedScheduler.length > 0" class="generated-scheduler">
          <section class="list-section">
            <div class="list-header-grid">
              <div>#</div>
              <div>Date</div>
              <div>Interviewers</div>
              <div></div>
            </div>
          </section>

          <TransitionGroup name="list" tag="div" class="list-body">
            <div
              v-for="(scheduler, index) in generatedScheduler"
              :key="scheduler.scheduleId"
              class="interviewer-card"
              :class="{ 'has-replacement': scheduler.originalSchedule }"
            >
              <div class="id-col">
                <span class="id-text">{{ index + 1 }}</span>
              </div>

              <div class="date-col">
                <span>
                  {{ format(new Date(scheduler.firstDateOfTheWeek), 'dd/MM/yyyy') }} ~
                  {{
                    format(
                      new Date(
                        new Date(scheduler.firstDateOfTheWeek).getTime() + 4 * 24 * 60 * 60 * 1000,
                      ),
                      'dd/MM/yyyy',
                    )
                  }}
                </span>
              </div>

              <div class="name-col interviewer-stack">
                <div v-if="scheduler.originalSchedule" class="original-data">
                  <span class="version-tag old">Original</span>
                  <div class="names">
                    <span
                      v-for="m in scheduler.originalSchedule.mainInterviewers"
                      :key="m.userId"
                      class="name-item strikethrough"
                    >
                      {{ m.name }}
                    </span>
                  </div>
                </div>
                <div class="incoming-data">
                  <span v-if="scheduler.originalSchedule" class="version-tag new">Incoming</span>
                  <div class="names">
                    <span v-for="m in scheduler.mainInterviewers" :key="m.userId" class="name-text">
                      {{ m.name }}
                      <span v-if="m.isJunior" class="rank-tag junior">Junior</span>
                    </span>
                  </div>
                </div>
              </div>

              <div class="name-col interviewer-stack">
                <div
                  v-if="
                    scheduler.originalSchedule &&
                    scheduler.originalSchedule.internInterviewers?.length
                  "
                  class="original-data"
                >
                  <span class="version-tag old">Original</span>
                  <div class="names">
                    <span
                      v-for="i in scheduler.originalSchedule.internInterviewers"
                      :key="i.userId"
                      class="name-item strikethrough"
                    >
                      {{ i.name }}
                    </span>
                  </div>
                </div>
                <div class="incoming-data">
                  <span v-if="scheduler.originalSchedule"></span>
                  <div v-if="scheduler.internInterviewers?.length" class="names">
                    <span
                      v-for="i in scheduler.internInterviewers"
                      :key="i.userId"
                      class="name-text"
                    >
                      {{ i.name }}
                      <span v-if="i.isJunior" class="rank-tag junior">Junior</span>
                    </span>
                  </div>
                  <div v-else class="none"><span></span></div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <div class="modal-actions">
        <button class="button-cancel" @click="handleCancel">Cancel</button>
        <button class="button" @click="isGenerated ? handleConfirm() : handleGenerate()">
          <span class="button-text">{{ isGenerated ? 'Confirm' : 'Generate' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-schedule-modal-overlay {
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

.create-schedule-modal {
  background-color: #ffffff;
  width: 90vw;
  max-width: 1400px;
  height: auto;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  padding: 20px;
}

.create-schedule-modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding-right: 10px;
  margin-top: 15px;
}

.generated-scheduler {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: white;
  padding: 1rem;
  border-radius: 10px;
  overflow: hidden;
}

.list-section {
  flex-shrink: 0;
  background: white;
  z-index: 2;
  border-bottom: 1px solid #eee;
}

.list-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 10px;
}

.warning-text {
  font-weight: 500;
  color: #ff0000;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.datepicker-group {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  margin-bottom: 1rem;
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

.button {
  background: #0f172a;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.list-header-grid {
  position: sticky;
  top: 0;
  background: white;
  z-index: 5;
  display: grid;
  grid-template-columns: 0.5fr 2fr 2.5fr 2.5fr;
  gap: 10px;
  padding: 10px 0;
}

.interviewer-card {
  display: grid;
  grid-template-columns: 0.5fr 2fr 2.5fr 2.5fr;
  gap: 15px;
  padding: 15px 0;
  align-items: flex-start;
  border-bottom: 1px solid #e2e8f0;
}

.list-header-grid {
  padding: 0 20px;
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
  justify-content: center;
}

.date-col,
.name-col,
.none {
  width: 100%;
  display: flex;
  margin: 5px;
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
  display: inline-block;
  white-space: nowrap;
}
.has-replacement {
  background-color: #fffaf0;
}

.interviewer-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.original-data,
.incoming-data {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.version-tag {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 2px;
  padding: 2px 6px;
  border-radius: 4px;
  width: fit-content;
}

.version-tag.old {
  background: #e2e8f0;
  color: #64748b;
}

.version-tag.new {
  background: #91d2fb;
  color: #166534;
}

.names {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.name-item.strikethrough {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  text-decoration: line-through;
  color: #94a3b8;
}

.none-text {
  color: #cbd5e1;
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

:global(.custom-schedule-picker .el-date-table td.is-disabled .el-date-table-cell) {
  visibility: hidden !important;
}

:global(.custom-schedule-picker .el-date-table td.start-date .el-date-table-cell),
:global(.custom-schedule-picker .el-date-table td.end-date .el-date-table-cell) {
  background-color: #0f172a !important;
  color: #ffffff !important;
  font-weight: 800 !important;
}

:global(.custom-schedule-picker .el-date-table td.in-range .el-date-table-cell) {
  color: #fbfdff;
  background-color: #0f172a;
}
</style>
