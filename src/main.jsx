import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
//import App from './App.jsx'
import LoginDemo from './LoginDemo.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*<App />*/}
    <LoginDemo></LoginDemo>
  </StrictMode>,
)
