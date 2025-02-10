import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'

createRoot(document.getElementById('root')!).render(
  // <StrictMode> | FINDME: Turned off for now since it's causing players to double up
    <App />
  // </StrictMode>
)
