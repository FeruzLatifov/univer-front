import { BaseApiService } from '../base/BaseApiService'

export interface ContractListItem {
  id: number
  contract_number?: string | null
  contract_date?: string | null
  student: {
    id: number
    full_name: string
    student_id_number: string
  } | null
  group?: string | null
  contract_status?: string | null
  contract_summa: number
  paid_summa: number
  debt_summa: number
}

export interface ContractListResponse {
  contracts: ContractListItem[]
  education_year: string
  count: number
}

export interface ContractDetail extends ContractListItem {
  real_summa: number
  student_full: {
    id: number
    full_name: string
    student_id_number: string
    phone?: string | null
    email?: string | null
  } | null
  payments: Array<{
    id: number
    summa: number
    date?: string | null
  }>
}

export interface DebtorsResponse {
  debtors: ContractListItem[]
  education_year: string
  total_debtors: number
  total_debt: number
}

export interface ContractFilters {
  group_id?: number
  education_year?: string
  status?: string
}

class TeacherContractService extends BaseApiService {
  constructor() {
    super('/v1/teacher/contracts')
  }

  async list(filters: ContractFilters = {}): Promise<ContractListResponse> {
    return this.get<ContractListResponse>('', { params: filters })
  }

  async show(id: number): Promise<{ contract: ContractDetail }> {
    return this.get<{ contract: ContractDetail }>(`/${id}`)
  }

  async debtors(filters: Pick<ContractFilters, 'group_id' | 'education_year'> = {}): Promise<DebtorsResponse> {
    return this.get<DebtorsResponse>('/debtors', { params: filters })
  }
}

export const teacherContractService = new TeacherContractService()
