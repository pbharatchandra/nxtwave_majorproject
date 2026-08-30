import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from '../src/comopnents/Login'
import Home from 'C:/Users/pbhar/nxtwave/nxtwave_majorproject/src/comopnents/Home'
import Assessment from 'C:/Users/pbhar/nxtwave/nxtwave_majorproject/src/comopnents/Assesment'
import Results from 'C:/Users/pbhar/nxtwave/nxtwave_majorproject/src/comopnents/Results'
import NotFound from 'C:/Users/pbhar/nxtwave/nxtwave_majorproject/src/comopnents/NotFound'
import ProtectedRoute from 'C:/Users/pbhar/nxtwave/nxtwave_majorproject/src/comopnents/ProtectedRoute'

import { EvaluationProvider } from './context/EvaluationProvider.jsx'

import './App.css'
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

        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
  </EvaluationProvider>
)

export default App