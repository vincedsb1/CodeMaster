<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  icon?: string
  color?: 'primary' | 'green' | 'orange' | 'slate'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
})

const colorClasses = {
  primary: 'text-indigo-600',
  green: 'text-green-600',
  orange: 'text-orange-500',
  slate: 'text-slate-700',
}
</script>

<template>
  <div class="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-1">
    <div class="text-xs uppercase font-bold text-slate-400 tracking-wider">{{ label }}</div>
    <div class="text-2xl font-bold flex items-center justify-center gap-1" :class="[colorClasses[color]]">
      <i v-if="icon" :class="['ph', icon]"></i>
      {{ value }}
    </div>
  </div>
</template>
