import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { bootstrapAuth, initAuthSession, waitForAuthHydration } from './lib/authSession'
import './index.css'
import App from './App.jsx'

async function startApp() {
  const rootElement = document.getElementById('root')

  await waitForAuthHydration()
  await bootstrapAuth()
  initAuthSession()

  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}

startApp()
