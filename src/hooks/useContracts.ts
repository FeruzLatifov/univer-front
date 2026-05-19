import { useQuery } from '@tanstack/react-query'
import {
  teacherContractService,
  type ContractDetail,
  type ContractFilters,
  type ContractListResponse,
  type DebtorsResponse,
} from '@/services/teacher/ContractService'

export const contractKeys = {
  all: ['teacher', 'contracts'] as const,
  list: (filters?: ContractFilters) =>
    [...contractKeys.all, 'list', filters ?? {}] as const,
  detail: (id: number) => [...contractKeys.all, 'detail', id] as const,
  debtors: (filters?: Pick<ContractFilters, 'group_id' | 'education_year'>) =>
    [...contractKeys.all, 'debtors', filters ?? {}] as const,
}

export function useContracts(filters?: ContractFilters) {
  return useQuery<ContractListResponse>({
    queryKey: contractKeys.list(filters),
    queryFn: () => teacherContractService.list(filters),
  })
}

export function useContractDetail(id: number | null) {
  return useQuery<{ contract: ContractDetail }>({
    queryKey: contractKeys.detail(id ?? 0),
    queryFn: () => teacherContractService.show(id as number),
    enabled: id !== null && id > 0,
  })
}

export function useContractDebtors(
  filters?: Pick<ContractFilters, 'group_id' | 'education_year'>
) {
  return useQuery<DebtorsResponse>({
    queryKey: contractKeys.debtors(filters),
    queryFn: () => teacherContractService.debtors(filters),
  })
}
