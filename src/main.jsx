import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './config.js'        // apply theme vars + fonts + meta
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
