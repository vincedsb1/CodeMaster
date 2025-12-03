<script setup lang="ts">
import { marked } from 'marked'
import { ref, watch } from 'vue'

interface Props {
  text: string
}

const props = defineProps<Props>()

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
})

// Use ref to store parsed HTML (async)
const htmlContent = ref('')

// Watch for text changes and parse markdown asynchronously
watch(
  () => props.text,
  async (newText) => {
    if (!newText) {
      htmlContent.value = ''
      return
    }

    try {
      // Parse markdown (marked.parse returns a Promise in v10+)
      let html = await marked.parse(newText)

      // Remove wrapping <p> tags if present (since we want inline rendering)
      if (html.startsWith('<p>') && html.endsWith('</p>\n')) {
        html = html.slice(3, -5)
      }

      htmlContent.value = html
    } catch (err) {
      console.error('Error parsing markdown:', err)
      htmlContent.value = newText // Fallback to raw text
    }
  },
  { immediate: true }
)
</script>

<template>
  <!-- Render markdown as HTML with proper styling -->
  <span class="markdown-content" v-html="htmlContent"></span>
</template>

<style scoped>
.markdown-content :deep(strong) {
  font-weight: 700;
  color: #4f46e5;
}

.markdown-content :deep(code) {
  background-color: #f1f5f9;
  color: #0f172a;
  padding: 0.125rem 0.375rem;
  border-radius: 0.375rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875em;
  white-space: nowrap;
}

.markdown-content :deep(em) {
  font-style: italic;
  color: inherit;
}

/* For code blocks (triple backticks) - though we mainly use inline code */
.markdown-content :deep(pre) {
  background-color: #f1f5f9;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.markdown-content :deep(pre code) {
  background-color: transparent;
  color: #0f172a;
  padding: 0;
  border-radius: 0;
}
</style>
