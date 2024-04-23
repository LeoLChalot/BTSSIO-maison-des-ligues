import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth.jsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
)
