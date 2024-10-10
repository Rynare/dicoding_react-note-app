import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "./assets/js/Popper.js"
import "./assets/js/bootstrap.min.js"
// import "./assets/js/bootstrap-popper.min.js"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"></link>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>
    <App />
  </StrictMode>
)

