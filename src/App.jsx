import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/ToastContext'
import PublicLayout from './components/PublicLayout'
import Landing from './pages/public/Landing'
import Escritos from './pages/public/Escritos'
import NotFound from './pages/public/NotFound'

const queryClient = new QueryClient()

// GitHub Pages es hosting estático puro: HashRouter evita el 404 que da
// BrowserRouter al refrescar en rutas secundarias (no hay servidor que reescriba
// rutas a index.html).
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <HashRouter>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/escritos" element={<Escritos />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </HashRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
