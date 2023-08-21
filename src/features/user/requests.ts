import api, { HTTPMethod, authApi } from '@/api'
import {
  loginResponseSchema,
  type LoginResponse,
  type RegisterUser,
  type UserResponse,
  registerUserSchema,
  userResponseSchema,
  loginUserSchema,
  type LoginUserInput
} from './schemas'

export const refreshAccessTokenFn = async () => {
  const refreshToken = window.localStorage.getItem('refresh-token')
  const response = await authApi({
    method: 'POST',
    url: '/token/refresh',
    data: {
      refresh: refreshToken
    }
  })

  return loginResponseSchema.parse(response.data)
}

export const signUpUserFn = api<RegisterUser, UserResponse>({
  method: HTTPMethod.POST,
  path: '/users',
  requestSchema: registerUserSchema,
  responseSchema: userResponseSchema
})

export const loginUserFn = api<LoginUserInput, LoginResponse>({
  method: HTTPMethod.POST,
  path: '/token/',
  requestSchema: loginUserSchema,
  responseSchema: loginResponseSchema
})
