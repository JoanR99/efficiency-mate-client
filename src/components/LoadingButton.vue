<script setup lang="ts">
import Spinner from './SpinnerSVG.vue'
defineProps<{
  loading: boolean
  styles: string
}>()
</script>

<template>
  <button
    type="submit"
    class="py-1 md:py-2 font-semibold bg-teal-700 hover:bg-teal-600 rounded-lg outline-none border-none flex justify-center items-center"
    :class="styles"
    :disabled="loading"
    :style="[loading ? { backgroundColor: '#ccc' } : {}]"
  >
    <div v-if="loading" class="flex items-center gap-3">
      <Spinner />
    </div>
    <span v-else class="text-white"><slot></slot></span>
  </button>
</template>
