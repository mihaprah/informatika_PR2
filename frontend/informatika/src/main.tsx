import ReactDOM from 'react-dom/client'
import MyRouter from './Components/Router/MyRouter.tsx'
import "./global.css"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <MyRouter />
)
