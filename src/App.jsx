import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './components/ui/ToastContext'
import PublicLayout from './components/PublicLayout'
import ThemeSwitcher from './components/ThemeSwitcher'
import Landing from './pages/public/Landing'
import Booking from './pages/public/Booking'
import NotFound from './pages/public/NotFound'

const queryClient = new QueryClient()

// GitHub Pages es hosting estático puro: HashRouter evita el 404 que da
// BrowserRouter al refrescar en /reservar (no hay servidor que reescriba
// rutas a index.html).
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <HashRouter>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/reservar" element={<Booking />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </HashRouter>
            <ThemeSwitcher />
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
