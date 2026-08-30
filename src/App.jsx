import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './comopnents/Login'
import Home from './comopnents/Home'
import Assessment from './comopnents/Assesment'
import Results from './comopnents/Results'
import NotFound from './comopnents/NotFound'
import ProtectedRoute from './comopnents/ProtectedRoute'
import { EvaluationProvider } from './context/EvaluationProvider'

const App = () => (
  <EvaluationProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <Assessment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </EvaluationProvider>
)

export default App