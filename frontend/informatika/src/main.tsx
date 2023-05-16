import React from 'react'
import ReactDOM from 'react-dom/client'
import MyRouter from './Components/Router/MyRouter.tsx'



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MyRouter />
  </React.StrictMode>,
)
