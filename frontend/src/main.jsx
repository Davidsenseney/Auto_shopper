import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './components/styles/token.css'
import App from './app.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
