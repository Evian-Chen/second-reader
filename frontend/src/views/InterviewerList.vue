<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useInterviewerStore } from '../stores/interviewerStore.ts'
import { useSchedulerStore } from '../stores/schedulerStore.ts'
import { useSuspensionStore } from '../stores/suspensionStore.ts'
import { ChevronUpDownIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
import CreateInterviewerModal from '@/components/CreateInterviewerModal.vue'
import { toast } from 'vue3-toastify'
import EditInterviewerModal from '@/components/EditInterviewerModal.vue'
import type { interviewerDTO } from '@/api/types/InterviewerDTO.ts'

const store = useInterviewerStore()
const schedulerStore = useSchedulerStore()
const suspensionStore = useSuspensionStore()
const { interviewers, loading, pageNum, pageSize, searchName, totalItems, orderType, isAscending } =
  storeToRefs(store)

const isCreating = ref(false)
const isEditing = ref(false)
const interviewerToBeEdited = ref<interviewerDTO>({
  userId: '',
  name: '',
  department: '',
  isJunior: false,
  isDeleted: false,
  team: '',
})

const handleSearch = () => store.triggerSearch()
const clearSearch = () => {
  searchName.value = ''
  store.triggerSearch()
}

const sortedInterviewers = computed(() => {
  return [...interviewers.value].sort((a, b) => {
    if (a.isDeleted === b.isDeleted) return 0
    return a.isDeleted ? 1 : -1
  })
})

const handleSortDept = () => {
  if (isAscending.value === null) {
    isAscending.value = true
    orderType.value = 'Department'
  } else if (isAscending.value === true) {
    isAscending.value = false
    orderType.value = 'Department'
  } else {
    isAscending.value = null
    orderType.value = null
  }
  store.fetchInterviewers()
}
const handleSortTeam = () => {
  if (isAscending.value === null) {
    isAscending.value = true
    orderType.value = 'Team'
  } else if (isAscending.value === true) {
    isAscending.value = false
    orderType.value = 'Team'
  } else {
    isAscending.value = null
    orderType.value = null
  }
  store.fetchInterviewers()
}

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / pageSize.value)
})

const handleCreate = () => {
  isCreating.value = true
}

const handleEdit = async (userId: string) => {
  const curInterviewerInfo = await store.fetchInterviewerById(userId)
  if (curInterviewerInfo == null) {
    throw new Error('No interviewerInfo found')
  }
  interviewerToBeEdited.value = curInterviewerInfo
  isEditing.value = true
}

const handleEditCancel = () => {
  isEditing.value = false
}

const handleEditConfirm = () => {
  isEditing.value = false
  searchName.value = ''
  store.fetchInterviewers()
  store.fetchAllInterviewers()
  schedulerStore.fetchSchedulers()
  suspensionStore.fetchSuspensions()
  toast(`Successfully edit interviewer!`, {
    autoClose: 3000,
    position: 'top-right',
    style: {
      color: '#4a3728',
      fontWeight: 'bold',
    },
    progressStyle: {
      background: '#4a3728',
    },
  })
}

const handleCreateCancel = () => {
  isCreating.value = false
}

const handleCreateConfirm = () => {
  isCreating.value = false
  store.fetchInterviewers()
  store.fetchAllInterviewers()
  toast(`Successfully create interviewer!`, {
    autoClose: 3000,
    position: 'top-right',
    style: {
      color: '#4a3728',
      fontWeight: 'bold',
    },
    progressStyle: {
      background: '#4a3728',
    },
  })
}

watch(pageSize, () => {
  store.triggerSearch()
})

onMounted(() => {
  if (interviewers.value.length === 0) store.fetchInterviewers()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="bg-blur-dot"></div>
    <div class="main-container">
      <div v-if="isCreating" class="create-interviewer-modal-overlay">
        <CreateInterviewerModal
          :isCreating="isCreating"
          @cancel="handleCreateCancel"
          @confirm="handleCreateConfirm"
        />
      </div>

      <div v-if="isEditing" class="edit-interviewer-modal-overlay">
        <EditInterviewerModal
          :isEditing="isEditing"
          :curInterviewerInfo="interviewerToBeEdited"
          @cancel="handleEditCancel"
          @confirm="handleEditConfirm"
        />
      </div>

      <header class="header-section">
        <div class="title-group">
          <h1>InterviewerList</h1>
        </div>

        <div class="action-group">
          <button @click="handleCreate" class="create-button-box">
            <span>Create</span>
          </button>

          <div class="search-box-glare">
            <input
              v-model="searchName"
              type="text"
              placeholder="Name..."
              @keyup.enter="handleSearch"
            />
            <div class="search-actions">
              <button v-if="searchName" @click="clearSearch" class="clear-btn">✕</button>
              <button @click="handleSearch" :disabled="loading" class="search-btn">
                <span v-if="!loading">Search</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <section class="list-section">
        <div class="list-header-grid">
          <div>#</div>
          <div>UserID</div>
          <div>Name</div>
          <div class="sortable-header" @click="handleSortDept">
            <span>Department</span>
            <chevron-up-icon
              v-if="isAscending === true && orderType == 'Department'"
              class="hero-icon active-icon"
            />
            <chevron-down-icon
              v-else-if="isAscending === false && orderType == 'Department'"
              class="hero-icon active-icon"
            />
            <chevron-up-down-icon v-else class="hero-icon active-icon" />
          </div>
          <div class="sortable-header" @click="handleSortTeam">
            <span>Team</span>
            <chevron-up-icon
              v-if="isAscending === true && orderType == 'Team'"
              class="hero-icon active-icon"
            />
            <chevron-down-icon
              v-else-if="isAscending === false && orderType == 'Team'"
              class="hero-icon active-icon"
            />
            <chevron-up-down-icon v-else class="hero-icon active-icon" />
          </div>
          <div></div>
        </div>

        <div v-if="loading && interviewers.length === 0" class="empty-state">
          <div class="pulse-loader"></div>
        </div>

        <TransitionGroup
          v-else-if="interviewers.length > 0"
          name="list"
          tag="div"
          class="list-body"
        >
          <div
            v-for="(person, index) in sortedInterviewers"
            :key="person.userId"
            :class="['interviewer-card', { 'is-deleted': person.isDeleted }]"
          >
            <div class="id-col" data-label="id">
              <span class="id-text">
                {{ (pageNum - 1) * pageSize + index + 1 }}
              </span>
            </div>
            <div class="id-col" data-label="UserId">
              <span>{{ person.userId }}</span>
            </div>
            <div class="name-col" data-label="Name">
              <span class="name-text">{{ person.name || 'none' }}</span>
              <span v-if="!person.isDeleted && !person.isJunior" class="hide-on-mobile"> </span>
              <div v-else :class="['rank-tag', person.isDeleted ? 'archived' : 'junior']">
                {{ person.isDeleted ? 'Archived' : 'Junior' }}
              </div>
            </div>

            <div class="dept-col" data-label="Department">
              <span class="dept-label">{{ person.department || 'none' }}</span>
            </div>
            <div class="dept-col" data-label="Team">
              <span class="dept-label">{{ person.team || 'none' }}</span>
            </div>

            <div>
              <button class="edit-button" @click="handleEdit(person.userId)">Edit</button>
            </div>
          </div>
        </TransitionGroup>
        <div v-else class="empty-state">
          <p>No matching interviewers found.</p>
        </div>
      </section>

      <footer class="footer-pagination">
        <button @click="store.setPage(pageNum - 1)" :disabled="pageNum <= 1 || loading">
          Prev
        </button>
        <div class="page-indicator">
          Page <strong>{{ pageNum }}</strong> of <strong>{{ totalPages }}</strong>
        </div>
        <button
          @click="store.setPage(pageNum + 1)"
          :disabled="pageNum * pageSize >= totalItems || loading"
        >
          Next
        </button>

        <select class="paging-glare" v-model="pageSize">
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.create-interviewer-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999; /* 確保層級夠高 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-interviewer-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999; /* 確保層級夠高 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-wrapper {
  display: flex;
  color: #1e293b;
  padding: 2rem;
  justify-content: center;
  position: relative;
}

.main-container {
  width: 100%;
  max-width: 1500px;
  justify-content: center;
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 3rem;
  border-radius: 10px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
}

.title-group h1 {
  font-weight: 900;
  margin: 0;
  color: #0f172a;
}
.title-group h1 span {
  color: #2563eb;
}
.title-group p {
  color: #94a3b8;
  margin: 4px 0 0;
}

.action-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box-glare {
  position: relative;
  display: flex;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px 6px;
  align-items: center;
  width: 300px;
  box-sizing: border-box;
}

.search-box-glare input {
  padding-right: 32px;
  border: none;
  background: transparent;
  outline: none;
  width: 200px;
  flex: 1;
  min-width: 0;
}

.search-btn {
  background: #0f172a;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  min-width: 80px;
  min-height: 30px;
}

.search-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-left: 4px;
  width: 92px;
  flex-shrink: 0;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: #64748b;
  border-radius: 50%;
  border: none;

  color: #e2e8f0;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
}

.clear-btn:hover {
  background-color: #cbd5e1;
  color: #334155;
}

.list-header-grid,
.interviewer-card {
  display: grid;
  grid-template-columns: 0.5fr 1fr 2fr 1fr 1fr 0.5fr;
  align-items: center;
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

.list-section {
  min-height: 400px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.list-leave-active {
  position: absolute;
  width: 100%;
  opacity: 0;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.sortable-header {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
}

.sortable-header:hover {
  color: #3b82f6;
}

.hero-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.default-icon {
  color: #9ca3af;
}

.active-icon {
  color: #3b82f6;
}

.interviewer-card {
  background: #ffffff;
  margin-bottom: 12px;
  padding: 16px 20px;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  transition: all 0.2s;
}

.name-col {
  align-items: center;
  display: flex;
}
.name-text {
  font-weight: 700;
  color: #334155;
  margin-right: 20px;
}
.dept-label {
  font-size: 0.875rem;
  font-weight: 600;
  display: block;
}

.rank-tag {
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  max-width: 150px;
}

.rank-tag.junior {
  background: #f0fdf4;
  color: #16a34a;
}

.rank-tag.archived {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.footer-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 2rem;
}

.footer-pagination button {
  background: none;
  border: 1px solid #e2e8f0;
  padding: 6px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
}

.footer-pagination button:disabled {
  opacity: 0.3;
}

.paging-glare {
  background: none;
  border: 1px solid #e2e8f0;
  padding: 6px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
}

.paging-glare:focus {
  outline: none;
}

.interviewer-card.is-deleted {
  background: #f8fafc;
  border-color: #e2e8f0;
  opacity: 0.6;
  filter: grayscale(100%);
  pointer-events: none;
}

.create-button-box {
  background: #0f172a;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.edit-button {
  background: #0f172a;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

@media (max-width: 768px) {
  .page-wrapper {
    padding: 1rem;
  }
  .main-container {
    padding: 1.5rem;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .search-box-glare {
    width: 100%;
  }
  .search-box-glare input {
    flex: 1;
  }

  .list-header-grid {
    display: none;
  }

  .interviewer-card {
    display: block;
    padding: 1rem;
    position: relative;
  }

  .interviewer-card.is-deleted {
    border-left-color: #94a3b8;
  }

  .interviewer-card > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 0.9rem;
  }

  .interviewer-card > div::before {
    content: attr(data-label);
    font-weight: 700;
    color: #94a3b8;
    font-size: 0.75rem;
    text-transform: uppercase;
  }

  .name-text {
    margin-right: 0;
  }
  .footer-pagination {
    gap: 10px;
  }
  .rank-tag.junior {
    display: none;
  }
  .hide-on-mobile {
    display: none;
  }
}

@media (max-width: 480px) {
  .title-group h1 {
    font-size: 1.5rem;
  }
}
</style>
