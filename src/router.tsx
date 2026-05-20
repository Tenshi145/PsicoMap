import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Genograma from './pages/Genograma'
import Familiograma from './pages/Familiograma'
import Sociograma from './pages/Sociograma'

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/genograma', element: <Genograma /> },
  { path: '/familiograma', element: <Familiograma /> },
  { path: '/sociograma', element: <Sociograma /> },
])
