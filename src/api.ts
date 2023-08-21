import axios from 'axios'
import type { z } from 'zod'
import { storeToRefs } from 'pinia'
import { refreshAccessTokenFn } from './features/user/requests'
import { useAuthStore } from './features/user/store'

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export enum HTTPStatusCode {
  OK = 200
}

const BASE_URL = import.meta.env.VITE_SERVER_URL ?? '/api'

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

authApi.defaults.headers.common['Content-Type'] = 'application/json'

export default function api<Request, Response>({
  method,
  path,
  requestSchema,
  responseSchema
}: {
  method: HTTPMethod
  path: string
  requestSchema?: z.ZodType<Request>
  responseSchema: z.ZodType<Response>
}): (data?: Request) => Promise<Response> {
  return function (requestData?: Request) {
    if (requestSchema) requestSchema.parse(requestData)

    async function apiCall() {
      const authStore = useAuthStore()
      const { accessToken } = storeToRefs(authStore)
      const Authorization = accessToken ? `Bearer ${accessToken.value}` : ''

      const response = await authApi({
        method,
        url: path,
        [method === HTTPMethod.GET ? 'params' : 'data']: requestData,
        headers: {
          Authorization
        }
      })

      return responseSchema.parse(response.data)
    }

    return apiCall()
  }
}

authApi.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    console.log(error)
    const originalRequest = error.config
    const errMessage = error.response.data.message as string
    const authStore = useAuthStore()
    const { setAccessToken } = authStore

    if (errMessage.includes('Authorization token expired') && !originalRequest._retry) {
      originalRequest._retry = true
      const response = await refreshAccessTokenFn()
      setAccessToken(response.access)
      window.localStorage.setItem('refresh-token', response.refresh)
      return authApi(originalRequest)
    }
    return Promise.reject(error)
  }
)
