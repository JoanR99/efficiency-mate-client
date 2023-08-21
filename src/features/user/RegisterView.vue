<script setup lang="ts">
import { useField, useForm, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation } from '@tanstack/vue-query'
import { signUpUserFn } from './requests'
import { createToast } from 'mosha-vue-toastify'
import { useRouter } from 'vue-router'
import LoadingButton from '@/components/LoadingButton.vue'
import { type RegisterUser, registerUserSchemaInput } from './schemas'
import LoginIllustration from './LoginIllustration.vue'

const registerSchema = toTypedSchema(registerUserSchemaInput)
const router = useRouter()

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: registerSchema
})

const { value: username } = useField('username')
const { value: email } = useField('email')
const { value: password } = useField('password')
const { value: passwordConfirm } = useField('passwordConfirm')

const { isLoading, mutate } = useMutation({
  mutationFn: (credentials: RegisterUser) => signUpUserFn(credentials),
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
  onSuccess: () => {
    router.push({ name: 'login' })
    createToast('Registered successfully', {
      position: 'top-right',
      type: 'success'
    })
  }
})

const onSubmit = handleSubmit((values) => {
  mutate({
    username: values.username,
    email: values.email,
    password: values.password
  })
  resetForm()
})
</script>

<template>
  <div class="flex flex-col justify-center gap-10 items-center h-screen">
    <div className="w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/12 text-center">
      <LoginIllustration />

      <h2 className="mt-2 text-xl font-medium lg:text-2xl">Welcome</h2>
    </div>
    <form @submit="onSubmit" class="space-y-6 w-3/5 md:w-2/3 lg:w-1/2">
      <div className="space-y-6 md:flex md:gap-16 md:items-start md:space-y-0">
        <div class="space-y-6 md:w-1/2">
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
            <label for="email" :class="{ 'text-red-700': errors.email }">Email</label>
            <input
              type="email"
              name="email"
              placeholder=""
              v-model="email"
              class="bg-gray-200 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="email"
            />
            <ErrorMessage name="email" v-slot="{ message }">
              <span class="text-sm font-medium text-red-700">{{ message }}</span>
            </ErrorMessage>
          </div>
        </div>

        <div className="space-y-6 md:w-1/2">
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

          <div class="space-y-2">
            <label for="passwordConfirm" :class="{ 'text-red-700': errors.passwordConfirm }"
              >Confirm Password</label
            >
            <input
              v-model="passwordConfirm"
              type="password"
              name="passwordConfirm"
              placeholder=" "
              class="bg-gray-200 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="passwordConfirm"
            />
            <ErrorMessage name="passwordConfirm" v-slot="{ message }">
              <span class="text-sm font-medium text-red-700">{{ message }}</span>
            </ErrorMessage>
          </div>
        </div>
      </div>

      <div class="w-full flex justify-center">
        <LoadingButton styles="w-3/4" :loading="isLoading">Sign Up</LoadingButton>
      </div>
    </form>

    <p>
      Already have an account?
      <router-link :to="{ name: 'login' }" class="text-teal-700 font-medium"> Sign In </router-link>
    </p>
  </div>
</template>
