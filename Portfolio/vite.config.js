import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.EMAILJS_SERVICE_ID": JSON.stringify(process.env.EMAILJS_SERVICE_ID),
    "import.meta.env.EMAILJS_TEMPLATE_ID": JSON.stringify(process.env.EMAILJS_TEMPLATE_ID),
    "import.meta.env.EMAILJS_USER_PUBLIC_KEY": JSON.stringify(process.env.EMAILJS_USER_PUBLIC_KEY),
  },
})
