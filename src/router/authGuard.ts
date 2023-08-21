import { refreshAccessTokenFn } from '@/features/user/requests'
import { useAuthStore } from '@/features/user/store'
import { storeToRefs } from 'pinia'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  try {
    const authStore = useAuthStore()
    const { accessToken } = storeToRefs(authStore)
    if (!accessToken.value) {
      const { access } = await refreshAccessTokenFn()

      if (!access) {
        return next({
          name: 'login'
        })
      }

      authStore.setAccessToken(access)
    }
    return next()
  } catch (error) {
    return next({
      name: 'login'
    })
  }
}
