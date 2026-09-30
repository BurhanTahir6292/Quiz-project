import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'

export default function Navbar() {
  const { playerName, soundOn, toggleSound } = useQuiz()
  const location = useLocation()

  return (
    <nav className="navbar navbar-expand-lg app-navbar sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <span className="brand-icon">⚡</span>
          <span className="fw-bold brand-text">QuizSpark</span>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill fs-xs">
            v1.0
          </span>
        </Link>

        <div className="d-flex align-items-center gap-3">
          <Link
            to="/"
            className={`nav-link-custom ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/leaderboard"
            className={`nav-link-custom ${location.pathname === '/leaderboard' ? 'active' : ''}`}
          >
            🏆 Leaderboard
          </Link>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="btn btn-sm btn-icon-glass"
            title={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label="Toggle sound"
          >
            {soundOn ? '🔊' : '🔇'}
          </button>

          {playerName && (
            <div className="player-badge d-none d-sm-flex align-items-center gap-2">
              <span className="avatar-circle">{playerName.charAt(0).toUpperCase()}</span>
              <span className="player-name-text text-truncate">{playerName}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
