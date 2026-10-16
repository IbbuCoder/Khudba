import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/amiri-quran/arabic-400.css'
import './styles.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).catch(() => {
      // Offline support is a bonus; the script works without it.
    })
  })
}
