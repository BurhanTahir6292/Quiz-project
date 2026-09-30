import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'

const CATEGORIES = ['All', 'Programming', 'Web Development', 'JavaScript', 'Science', 'Geography']
const DIFFICULTIES = ['All', 'easy', 'medium']

export default function Home() {
  const navigate = useNavigate()
  const { playerName, setPlayerName, startQuiz, leaderboard } = useQuiz()
  const [nameInput, setNameInput] = useState(playerName || '')
  const [selectedCat, setSelectedCat] = useState('All')
  const [selectedDiff, setSelectedDiff] = useState('All')
  const [validationError, setValidationError] = useState('')

  const topPlayer = leaderboard.length > 0
    ? [...leaderboard].sort((a, b) => b.percentage - a.percentage)[0]
    : null

  const handleStart = (e) => {
    e.preventDefault()
    const trimmed = nameInput.trim()

    if (!trimmed) {
      setValidationError('Please enter your name or nickname to start!')
      return
    }

    setValidationError('')
    setPlayerName(trimmed)
    startQuiz(trimmed, selectedCat, selectedDiff)
    navigate('/quiz')
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-7">
          
          {/* Main Card */}
          <div className="glass-card p-4 p-sm-5 text-center">
            
            {/* Header Badge */}
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill bg-primary-subtle text-primary border border-primary-subtle fs-xs fw-semibold text-uppercase tracking-wider">
              <span>🎯</span> Test Your Knowledge
            </div>

            <h1 className="fw-extrabold mb-2 display-6">
              🚀 React Quiz Challenge
            </h1>
            <p className="text-secondary mb-4">
              Sharpen your web development &amp; general tech skills. Compete for the #1 spot on the leaderboard!
            </p>

            <form onSubmit={handleStart} className="text-start mt-4">
              
              {/* Name Input */}
              <div className="mb-4">
                <label htmlFor="playerNameInput" className="form-label text-secondary small fw-semibold text-uppercase">
                  Player Name
                </label>
                <div className="input-group">
                  <input
                    id="playerNameInput"
                    type="text"
                    className={`form-control input-custom ${validationError ? 'is-invalid' : ''}`}
                    placeholder="Enter your name or nickname..."
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value)
                      if (validationError) setValidationError('')
                    }}
                    autoComplete="off"
                    maxLength={25}
                  />
                </div>
                {validationError && (
                  <div className="text-danger small mt-2 d-flex align-items-center gap-1">
                    <span>⚠️</span> {validationError}
                  </div>
                )}
              </div>

              {/* Category Pills */}
              <div className="mb-4">
                <label className="form-label text-secondary small fw-semibold text-uppercase d-block mb-2">
                  Choose Category
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`filter-pill ${selectedCat === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCat(cat)}
                    >
                      {cat === 'All' ? '🌐 All Topics' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Pills */}
              <div className="mb-4">
                <label className="form-label text-secondary small fw-semibold text-uppercase d-block mb-2">
                  Difficulty Level
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      className={`filter-pill text-capitalize ${selectedDiff === diff ? 'active' : ''}`}
                      onClick={() => setSelectedDiff(diff)}
                    >
                      {diff === 'All' ? '⚡ Any Difficulty' : diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-3 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary-gradient btn-lg fw-bold"
                >
                  Start Quiz Challenge ⚡
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/leaderboard')}
                  className="btn btn-outline-glass text-secondary"
                >
                  🏆 View High Scores &amp; Leaderboard
                </button>
              </div>

            </form>

            {/* Quick Stats Grid */}
            <div className="row g-3 mt-4 pt-3 border-top border-secondary border-opacity-10 text-start">
              <div className="col-4">
                <div className="stat-card">
                  <div className="stat-number">10</div>
                  <div className="stat-label">Questions Bank</div>
                </div>
              </div>
              <div className="col-4">
                <div className="stat-card">
                  <div className="stat-number">15s</div>
                  <div className="stat-label">Per Question</div>
                </div>
              </div>
              <div className="col-4">
                <div className="stat-card">
                  <div className="stat-number">{topPlayer ? `${topPlayer.percentage}%` : '100%'}</div>
                  <div className="stat-label">Top Score</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
