import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { MotionProvider } from './contexts/MotionContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { UnitsProvider } from './contexts/UnitsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MotionProvider>
          <UnitsProvider>
            <App />
          </UnitsProvider>
        </MotionProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
