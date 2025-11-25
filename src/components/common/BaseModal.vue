<script setup lang="ts">
interface Props {
  show: boolean
  title: string
}

withDefaults(defineProps<Props>(), {
  show: false,
})
</script>

<template>
  <div v-if="show" class="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl transform scale-100">
      <h3 class="text-xl font-bold mb-2">{{ title }}</h3>

      <div class="mb-6">
        <slot />
      </div>

      <div class="flex gap-3">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
