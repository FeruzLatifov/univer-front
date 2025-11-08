import { isAxiosError } from 'axios'

type ApiErrorPayload = {
  message?: string
  error?: string
}

type ErrorWithResponse = {
  response?: {
    data?: ApiErrorPayload
  }
}

/**
 * Extract user-friendly error messages from Axios/Laravel responses
 */
export const getErrorMessage = (error: unknown, fallbackMessage = 'Xatolik yuz berdi'): string => {
  if (isAxiosError<ApiErrorPayload>(error)) {
    return error.response?.data?.message || error.response?.data?.error || error.message || fallbackMessage
  }

  if (typeof error === 'object' && error !== null) {
    const withResponse = error as ErrorWithResponse
    const responseMessage = withResponse.response?.data?.message || withResponse.response?.data?.error
    if (responseMessage) {
      return responseMessage
    }
  }

  if (typeof error === 'string') {
    return error || fallbackMessage
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage
  }

  return fallbackMessage
}
