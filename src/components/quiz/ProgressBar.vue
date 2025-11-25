<script setup lang="ts">
interface Props {
  percent: number
}

defineProps<Props>()
</script>

<template>
  <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
    <div
      class="bg-indigo-600 h-full transition-all duration-500 ease-out"
      :style="{ width: percent + '%' }"
    ></div>
  </div>
</template>
