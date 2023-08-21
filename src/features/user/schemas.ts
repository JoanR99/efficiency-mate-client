import { z } from 'zod'

export const userResponseSchema = z.object({
  message: z.string({
    required_error: 'Message is required',
    invalid_type_error: 'Message must be a string'
  })
})

export type UserResponse = z.infer<typeof userResponseSchema>

export const registerUserSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required'
    })
    .min(2, 'Username must be 2 or more characters')
    .max(20, 'Username must be less than 20 characters'),
  email: z
    .string({
      required_error: 'Email is required'
    })
    .email('Email is invalid'),
  password: z
    .string({ required_error: 'Password is required' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])/,
      'Password must contain at least a lowercase letter, a uppercase letter, a number and a special character ( ! @ # $ % )'
    )
    .min(8, 'Password must be 8 or more characters')
    .max(24, 'Password must be less than 24 characters')
})

export const registerUserSchemaInput = registerUserSchema
  .extend({
    passwordConfirm: z
      .string({
        required_error: 'Password confirm is required'
      })
      .min(1)
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match'
  })

export type RegisterUser = z.infer<typeof registerUserSchema>
export type RegisterUserInput = z.infer<typeof registerUserSchemaInput>

export const loginUserSchema = z.object({
  username: z.string({
    required_error: 'Username is required'
  }),
  password: z.string({ required_error: 'Password is required' })
})

export type LoginUserInput = z.infer<typeof loginUserSchema>

export const loginResponseSchema = z.object({
  access: z.string(),
  refresh: z.string()
})

export type LoginResponse = z.infer<typeof loginResponseSchema>
