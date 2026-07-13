import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/ToastContext'
import PublicLayout from './components/PublicLayout'
import Landing from './pages/public/Landing'
import Booking from './pages/public/Booking'

const queryClient = new QueryClient()

// GitHub Pages es hosting estático puro: HashRouter evita el 404 que da
// BrowserRouter al refrescar en /reservar (no hay servidor que reescriba
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
                <Route path="/reservar" element={<Booking />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </HashRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
