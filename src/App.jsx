import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QuizProvider } from './context/QuizContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import LeaderBoard from './pages/LeaderBoard'

const Result = lazy(() => import('./pages/Result'))

function PageFallback() {
  return (
    <div className="d-flex align-items-center justify-content-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading page...</span>
      </div>
    </div>
  )
}

function App() {
  return (
    <QuizProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/leaderboard" element={<LeaderBoard />} />
                <Route path="/result" element={<Result />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </QuizProvider>
  )
}

export default App
