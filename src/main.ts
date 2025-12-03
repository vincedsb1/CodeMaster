import { createApp, defineComponent, h } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

// PhosphorIcon component using CDN icons
const PhosphorIcon = defineComponent({
  name: 'PhosphorIcon',
  props: {
    weight: {
      type: String,
      default: 'regular',
    },
    size: {
      type: [Number, String],
      default: 24,
    },
  },
  setup(props, { slots }) {
    const iconName = slots.default?.()[0]?.children as string

    return () =>
      h('i', {
        class: `ph ph-${iconName?.toLowerCase() || 'circle'} ph-${props.weight}`,
        style: {
          fontSize: `${props.size}px`,
        },
      })
  },
})

app.use(createPinia())
app.use(router)
app.component('PhosphorIcon', PhosphorIcon)

app.mount('#app')
