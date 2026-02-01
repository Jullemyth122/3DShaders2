import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import App2 from './App2.tsx'

createRoot(document.getElementById('root')!).render(
  <Fragment>
    {/* <App /> */}
    <App2 />
  </Fragment>,
)
