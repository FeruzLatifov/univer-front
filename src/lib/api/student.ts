import { api } from './client';

// Dashboard
export async function getStudentDashboard() {
  const response = await api.get('/student/dashboard');
  return response.data.data;
}

// Subjects
export async function getStudentSubjects() {
  const response = await api.get('/student/subjects');
  return response.data.data;
}

export async function getStudentSubject(id: number) {
  const response = await api.get(`/student/subjects/${id}`);
  return response.data.data;
}

// Assignments
export async function getStudentAssignments(page = 1) {
  const response = await api.get(`/student/assignments?page=${page}`);
  return response.data.data;
}

export async function submitAssignment(id: number, data: { content: string; files?: File[] }) {
  const formData = new FormData();
  formData.append('content', data.content);
  if (data.files) {
    data.files.forEach(file => formData.append('files[]', file));
  }
  const response = await api.post(`/student/assignments/${id}/submit`, formData);
  return response.data.data;
}

// Tests
export async function getStudentTests() {
  const response = await api.get('/student/tests');
  return response.data.data;
}

export async function getStudentTestResults(page = 1) {
  const response = await api.get(`/student/tests/results?page=${page}`);
  return response.data.data;
}

// Grades
export async function getStudentGrades() {
  const response = await api.get('/student/grades');
  return response.data.data;
}

// Attendance
export async function getStudentAttendance(page = 1) {
  const response = await api.get(`/student/attendance?page=${page}`);
  return response.data.data;
}

// Schedule
export async function getStudentSchedule() {
  const response = await api.get('/student/schedule');
  return response.data.data;
}

// Documents (Xujjatlar)
export async function getStudentDocuments() {
  const response = await api.get('/v1/student/document-all');
  return response.data;
}

export async function getStudentDecrees() {
  const response = await api.get('/v1/student/decree');
  return response.data;
}

export async function getStudentReferences() {
  const response = await api.get('/v1/student/reference');
  return response.data;
}

export async function getStudentContracts() {
  const response = await api.get('/v1/student/contract-list');
  return response.data;
}

export async function generateReference() {
  const response = await api.get('/v1/student/reference-generate');
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
export async function getStudentProfile() {
  const response = await api.get('/student/profile');
  return response.data.data;
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
export async function getStudentSemesters() {
  const response = await api.get('/v1/education/semesters');
  return response.data;
}

// GPA Detail (GPA tafsilotlari)
export async function getStudentGPA() {
  const response = await api.get('/v1/education/gpa');
  return response.data;
}
