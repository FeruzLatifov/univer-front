import { api } from './client';
import type {
  StudentAttendanceResponse,
  StudentGradesResponse,
  StudentGPAResponse,
  StudentProfileResponse,
  StudentScheduleResponse,
  StudentSemestersResponse,
  StudentSubjectsResponse,
  StudentTestResultsResponse,
  StudentTestsResponse,
} from '@/lib/types/student'

export interface StudentDocumentAttribute {
  label: string
  value: string
}

export interface StudentDocument {
  id: number
  type: string
  name: string
  file?: string
  attributes?: StudentDocumentAttribute[]
}

export interface StudentDocumentsResponse {
  data: StudentDocument[]
}

export interface StudentDecree {
  id: number
  name: string
  number: string
  date: string
  type?: string
  description?: string
  file_url?: string
}

export interface StudentDecreesResponse {
  data: StudentDecree[]
}

export interface StudentReference {
  id: number
  number: string
  issue_date: string
  semester?: {
    name: string
  }
  status: string
  download_url: string
}

export interface StudentReferencesResponse {
  data: StudentReference[]
}

export interface StudentContract {
  id: number
  number: string
  contract_date: string
  amount?: number
  education_year?: {
    name: string
  }
  status: string
}

export interface StudentContractsResponse {
  data: {
    items: StudentContract[]
  }
}

// Dashboard
export async function getStudentDashboard() {
  const response = await api.get('/student/dashboard');
  return response.data;
}

// Subjects
export async function getStudentSubjects(): Promise<StudentSubjectsResponse> {
  const response = await api.get<StudentSubjectsResponse>('/student/subjects');
  return response.data;
}

export async function getStudentSubject(id: number) {
  const response = await api.get(`/student/subjects/${id}`);
  return response.data;
}

// Assignments
export async function getStudentAssignments(page = 1) {
  const response = await api.get(`/student/assignments?page=${page}`);
  return response.data;
}

export async function submitAssignment(id: number, data: { content: string; files?: File[] }) {
  const formData = new FormData();
  formData.append('content', data.content);
  if (data.files) {
    data.files.forEach(file => formData.append('files[]', file));
  }
  const response = await api.post(`/student/assignments/${id}/submit`, formData);
  return response.data;
}

// Tests
export async function getStudentTests(): Promise<StudentTestsResponse> {
  const response = await api.get<StudentTestsResponse>('/student/tests');
  return response.data;
}

export async function getStudentTestResults(page = 1): Promise<StudentTestResultsResponse> {
  const response = await api.get<StudentTestResultsResponse>(`/student/tests/results?page=${page}`);
  return response.data;
}

// Grades
export async function getStudentGrades(): Promise<StudentGradesResponse> {
  const response = await api.get<StudentGradesResponse>('/student/grades');
  return response.data;
}

// Attendance
export async function getStudentAttendance(page = 1): Promise<StudentAttendanceResponse> {
  const response = await api.get<StudentAttendanceResponse>(`/student/attendance?page=${page}`);
  return response.data;
}

// Schedule
export async function getStudentSchedule(): Promise<StudentScheduleResponse> {
  const response = await api.get<StudentScheduleResponse>('/student/schedule');
  return response.data;
}

// Documents (Xujjatlar)
export async function getStudentDocuments(): Promise<StudentDocumentsResponse> {
  const response = await api.get<StudentDocumentsResponse>('/v1/student/document-all');
  return response.data;
}

export async function getStudentDecrees(): Promise<StudentDecreesResponse> {
  const response = await api.get<StudentDecreesResponse>('/v1/student/decree');
  return response.data;
}

export async function getStudentReferences(): Promise<StudentReferencesResponse> {
  const response = await api.get<StudentReferencesResponse>('/v1/student/reference');
  return response.data;
}

export async function getStudentContracts(): Promise<StudentContractsResponse> {
  const response = await api.get<StudentContractsResponse>('/v1/student/contract-list');
  return response.data;
}

export async function generateReference(): Promise<{ message?: string }> {
  const response = await api.get<{ message?: string }>('/v1/student/reference-generate');
  return response.data;
}

// Resources (Elektron resurslar)
export async function getStudentResources(subjectId?: string) {
  const params = subjectId ? `?subject=${subjectId}` : '';
  const response = await api.get(`/v1/education/resources${params}`);
  return response.data;
}

// Exams (Imtihonlar)
export async function getStudentExams(semesterId?: string) {
  const params = semesterId ? `?semester=${semesterId}` : '';
  const response = await api.get(`/v1/education/exams${params}`);
  return response.data;
}

// Profile (Profil)
export async function getStudentProfile(): Promise<StudentProfileResponse> {
  const response = await api.get<StudentProfileResponse>('/student/profile');
  return response.data;
}

export async function updateStudentProfile(data: {
  phone?: string;
  email?: string;
  current_address?: string;
  telegram_username?: string;
}) {
  const response = await api.put('/student/profile', data);
  return response.data;
}

export async function updateStudentPassword(data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) {
  const response = await api.put('/student/password', data);
  return response.data;
}

export async function uploadStudentPhoto(file: File) {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await api.post('/student/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function deleteStudentPhoto() {
  const response = await api.delete('/student/photo');
  return response.data;
}

// Semesters (Semestrlar)
export async function getStudentSemesters(): Promise<StudentSemestersResponse> {
  const response = await api.get<StudentSemestersResponse>('/v1/education/semesters');
  return response.data;
}

// GPA Detail (GPA tafsilotlari)
export async function getStudentGPA(): Promise<StudentGPAResponse> {
  const response = await api.get<StudentGPAResponse>('/v1/education/gpa');
  return response.data;
}
