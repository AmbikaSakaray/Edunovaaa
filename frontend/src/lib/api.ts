import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_BASE_URL || window.location.origin

// Create Axios Instance
export const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('edunova_access')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Auto refresh on 401
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

function onRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token))
  refreshSubscribers = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    const originalRequest = config

    if (response && response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(axiosInstance(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refresh = localStorage.getItem('edunova_refresh')
      if (refresh) {
        try {
          const res = await axios.post(`${API_BASE}/api/v1/auth/token/refresh/`, { refresh })
          const newAccess = res.data.access
          localStorage.setItem('edunova_access', newAccess)
          isRefreshing = false
          onRefreshed(newAccess)
          originalRequest.headers.Authorization = `Bearer ${newAccess}`
          return axiosInstance(originalRequest)
        } catch (err) {
          isRefreshing = false
          logout()
          return Promise.reject(err)
        }
      } else {
        logout()
      }
    }
    
    // Extract server validation/error message
    const errorData = response?.data
    const message = errorData?.detail || errorData?.message || errorData?.non_field_errors?.[0] || JSON.stringify(errorData) || error.message
    return Promise.reject(new Error(message))
  }
)

type LoginResponse = {
  access: string
  refresh: string
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await axiosInstance.post('/api/v1/auth/login/', { username, password })
  return res.data
}

export async function refreshToken(refresh: string): Promise<LoginResponse> {
  const res = await axios.post(`${API_BASE}/api/v1/auth/token/refresh/`, { refresh })
  return res.data
}

export function logout() {
  try {
    localStorage.removeItem('edunova_access')
    localStorage.removeItem('edunova_refresh')
  } catch (e) {}
}

// Users CRUD
export async function getUsers() {
  const res = await axiosInstance.get('/api/v1/users/')
  return res.data
}

export async function createUser(payload: any) {
  const res = await axiosInstance.post('/api/v1/users/', payload)
  return res.data
}

export async function updateUser(id: string | number, payload: any) {
  const res = await axiosInstance.patch(`/api/v1/users/${id}/`, payload)
  return res.data
}

export async function deleteUserApi(id: string | number) {
  await axiosInstance.delete(`/api/v1/users/${id}/`)
  return true
}

// Students & Guardians
export async function getStudents() {
  const res = await axiosInstance.get('/api/v1/students/')
  return res.data
}

export async function createStudent(payload: any) {
  const res = await axiosInstance.post('/api/v1/students/', payload)
  return res.data
}

export async function updateStudent(id: string | number, payload: any) {
  const res = await axiosInstance.patch(`/api/v1/students/${id}/`, payload)
  return res.data
}

export async function deleteStudent(id: string | number) {
  await axiosInstance.delete(`/api/v1/students/${id}/`)
  return true
}

// Timetable
export async function createTimetable(payload: any) {
  const res = await axiosInstance.post('/api/v1/academics/timetable/', payload)
  return res.data
}

// Attendance
export async function postAttendance(payload: any) {
  const res = await axiosInstance.post('/api/v1/attendance/', payload)
  return res.data
}

// Billing
export async function initCheckout(payload: any) {
  const res = await axiosInstance.post('/api/v1/billing/checkout/', payload)
  return res.data
}

export async function getDefaulters() {
  const res = await axiosInstance.get('/api/v1/billing/defaulters/')
  return res.data
}

// Exams
export async function getExams() {
  const res = await axiosInstance.get('/api/v1/exams/')
  return res.data
}

export async function createExam(payload: any) {
  const res = await axiosInstance.post('/api/v1/exams/', payload)
  return res.data
}

export async function getExamSchedules() {
  const res = await axiosInstance.get('/api/v1/exams/schedules/')
  return res.data
}

export async function getMarks() {
  const res = await axiosInstance.get('/api/v1/exams/marks/')
  return res.data
}

export async function createMark(payload: any) {
  const res = await axiosInstance.post('/api/v1/exams/marks/', payload)
  return res.data
}

export async function getReportCard(studentId: string) {
  const res = await axiosInstance.get(`/api/v1/exams/report-card/${studentId}/`)
  return res.data
}

// LMS
export async function getCourses() {
  const res = await axiosInstance.get('/api/v1/lms/courses/')
  return res.data
}

export async function createCourse(payload: any) {
  const res = await axiosInstance.post('/api/v1/lms/courses/', payload)
  return res.data
}

export async function getAssignments() {
  const res = await axiosInstance.get('/api/v1/lms/assignments/')
  return res.data
}

export async function createAssignment(payload: any) {
  const res = await axiosInstance.post('/api/v1/lms/assignments/', payload)
  return res.data
}

// Staff HR
export async function getEmployees() {
  const res = await axiosInstance.get('/api/v1/staff/employees/')
  return res.data
}

export async function createEmployee(payload: any) {
  const res = await axiosInstance.post('/api/v1/staff/employees/', payload)
  return res.data
}

export async function getLeaveRequests() {
  const res = await axiosInstance.get('/api/v1/staff/leaves/')
  return res.data
}

export async function approveLeave(id: string) {
  const res = await axiosInstance.post(`/api/v1/staff/leaves/${id}/approve/`, { action: 'Approved' })
  return res.data
}

export async function getPayroll() {
  const res = await axiosInstance.get('/api/v1/staff/payroll/')
  return res.data
}

// Operations
export async function getLibraryIssues() {
  const res = await axiosInstance.get('/api/v1/operations/library/')
  return res.data
}

export async function getBusRoutes() {
  const res = await axiosInstance.get('/api/v1/operations/transport/')
  return res.data
}

export async function getHostelRooms() {
  const res = await axiosInstance.get('/api/v1/operations/hostel/')
  return res.data
}

// Academics
export async function getClasses() {
  const res = await axiosInstance.get('/api/v1/academics/classes/')
  return res.data
}

export async function getSections() {
  const res = await axiosInstance.get('/api/v1/academics/sections/')
  return res.data
}

export async function getSubjects() {
  const res = await axiosInstance.get('/api/v1/academics/subjects/')
  return res.data
}

export async function getTimetable() {
  const res = await axiosInstance.get('/api/v1/academics/timetable/')
  return res.data
}

export function storeTokens({ access, refresh }: LoginResponse) {
  try {
    localStorage.setItem('edunova_access', access)
    localStorage.setItem('edunova_refresh', refresh)
  } catch (e) {
    // ignore storage errors
  }
}

export function decodeJwt(token: string | null) {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4)
    const json = atob(padded)
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

export async function fetchProfile() {
  const res = await axiosInstance.get('/api/v1/auth/profile/')
  return res.data
}

export async function createAdmission(payload: any) {
  const res = await axiosInstance.post('/api/v1/admissions/', payload)
  return res.data
}

export async function submitContactInquiry(payload: any) {
  const res = await axiosInstance.post('/api/v1/cms/contact-inquiries/', payload)
  return res.data
}

export async function getCareers() {
  const res = await axiosInstance.get('/api/v1/cms/careers/')
  return res.data
}

export async function submitCareerApplication(payload: any) {
  const res = await axiosInstance.post('/api/v1/cms/career-applications/', payload)
  return res.data
}

export async function getCMSNews() {
  const res = await axiosInstance.get('/api/v1/cms/news/')
  return res.data
}

export async function getCMSEvents() {
  const res = await axiosInstance.get('/api/v1/cms/events/')
  return res.data
}

export async function getCMSTestimonials() {
  const res = await axiosInstance.get('/api/v1/cms/testimonials/')
  return res.data
}

export async function getCMSFAQs() {
  const res = await axiosInstance.get('/api/v1/cms/faqs/')
  return res.data
}

export async function getCMSGallery() {
  const res = await axiosInstance.get('/api/v1/cms/gallery/')
  return res.data
}

export async function getCMSDownloads() {
  const res = await axiosInstance.get('/api/v1/cms/downloads/')
  return res.data
}

