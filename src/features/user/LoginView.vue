<script setup lang="ts">
import { useField, useForm, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { createToast } from 'mosha-vue-toastify'
import { useAuthStore } from './store'
import { loginUserSchema, type LoginUserInput } from './schemas'
import { loginUserFn } from './requests'
import LoginIllustration from './LoginIllustration.vue'
import LoadingButton from '@/components/LoadingButton.vue'

const authStore = useAuthStore()
const router = useRouter()

const loginSchema = toTypedSchema(loginUserSchema)

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: loginSchema
})

const { value: username } = useField('username')
const { value: password } = useField('password')

const queryClient = useQueryClient()

const { isLoading, mutate } = useMutation({
  mutationFn: (credentials: LoginUserInput) => loginUserFn(credentials),
  onError: (error) => {
    if (Array.isArray((error as any).response.data.error)) {
      ;(error as any).response.data.error.forEach((el: any) =>
        createToast(el.message, {
          position: 'top-right',
          type: 'warning'
        })
      )
    } else {
      createToast((error as any).response.data.message, {
        position: 'top-right',
        type: 'danger'
      })
    }
  },
  onSuccess: (data) => {
    queryClient.refetchQueries(['user'])
    authStore.setAccessToken(data.access)
    window.localStorage.setItem('refresh-token', data.refresh)
    router.push({ name: 'home' })
    createToast('Logged in successfully', {
      position: 'top-right',
      type: 'success'
    })
  }
})

const onSubmit = handleSubmit((values) => {
  mutate({
    username: values.username,
    password: values.password
  })
  resetForm()
})
</script>

<template>
  <div className="flex flex-col justify-center gap-10 items-center h-screen">
    <div className="w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/12 text-center">
      <LoginIllustration />

      <h2 className="mt-2 text-xl font-medium lg:text-2xl">Let's You In</h2>
    </div>

    <form @submit="onSubmit" class="space-y-6 w-3/5 md:w-1/2 lg:w-1/4">
      <div class="space-y-2">
        <label for="username" :class="{ 'text-red-700': errors.username }">Username</label>
        <input
          type="text"
          name="username"
          placeholder=""
          v-model="username"
          class="bg-gray-200 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          id="username"
        />
        <ErrorMessage name="username" v-slot="{ message }">
          <span class="text-sm font-medium text-red-700">{{ message }}</span>
        </ErrorMessage>
      </div>
      <div class="space-y-2">
        <label for="password" :class="{ 'text-red-700': errors.password }">Password</label>
        <input
          v-model="password"
          type="password"
          name="password"
          placeholder=" "
          class="bg-gray-200 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          id="password"
        />
        <ErrorMessage name="password" v-slot="{ message }">
          <span class="text-sm font-medium text-red-700">{{ message }}</span>
        </ErrorMessage>
      </div>

      <LoadingButton styles="w-full" :loading="isLoading">Sign In</LoadingButton>
    </form>

    <p>
      Don't have an account?
      <router-link :to="{ name: 'register' }" class="text-teal-700 font-medium">
        Sign Up
      </router-link>
    </p>
  </div>
</template>
