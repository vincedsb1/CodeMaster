<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  type: 'button',
})

const classes = computed(() => {
  const baseClasses =
    'font-bold rounded-lg transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-3.5 text-base',
  }

  const variantClasses = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200',
    secondary:
      'bg-slate-100 text-slate-700 hover:bg-slate-200',
    danger:
      'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200',
    ghost:
      'text-slate-600 hover:bg-slate-100',
  }

  const widthClass = props.fullWidth ? 'w-full' : ''

  return `${baseClasses} ${sizeClasses[props.size]} ${variantClasses[props.variant]} ${widthClass}`
})
</script>

<template>
  <button :type="type" :disabled="disabled || loading" :class="classes">
    <span v-if="loading" class="inline-block animate-spin">⌛</span>
    <slot />
  </button>
</template>
