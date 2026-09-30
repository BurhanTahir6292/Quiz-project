import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'

export default function LeaderBoard() {
  const navigate = useNavigate()
  const { leaderboard, clearLeaderboard, playerName, startQuiz } = useQuiz()
  const [searchTerm, setSearchTerm] = useState('')
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Sort descending by percentage, then by score
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage
    }
    return b.score - a.score
  })

  // Filter by search query
  const filtered = sortedLeaderboard.filter((entry) =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  )

  const getRankBadge = (index) => {
    if (index === 0) return <span className="rank-badge rank-1" title="1st Place">🥇</span>
    if (index === 1) return <span className="rank-badge rank-2" title="2nd Place">🥈</span>
    if (index === 2) return <span className="rank-badge rank-3" title="3rd Place">🥉</span>
    return <span className="rank-badge rank-other">#{index + 1}</span>
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          
          {/* Main Card */}
          <div className="glass-card p-4 p-md-5">
            
            {/* Header */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
              <div>
                <h2 className="fw-bold mb-1 text-white d-flex align-items-center gap-2">
                  <span>🏆</span> Hall of Fame
                </h2>
                <p className="text-secondary small mb-0">
                  Track top performers, high scores, and community achievements
                </p>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-primary-gradient"
                  onClick={() => {
                    startQuiz(playerName || 'Player', 'All', 'All')
                    navigate('/quiz')
                  }}
                >
                  Play Now ⚡
                </button>
                <Link to="/" className="btn btn-outline-glass">
                  Home
                </Link>
              </div>
            </div>

            {/* Search Filter Bar */}
            <div className="row g-2 mb-4">
              <div className="col-12 col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                    🔍
                  </span>
                  <input
                    type="text"
                    className="form-control input-custom"
                    placeholder="Search player by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-outline-glass"
                      type="button"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 text-md-end d-flex align-items-center justify-content-md-end">
                <span className="text-secondary small">
                  Showing <strong>{filtered.length}</strong> of {leaderboard.length} records
                </span>
              </div>
            </div>

            {/* Leaderboard Table */}
            {filtered.length > 0 ? (
              <div className="table-responsive">
                <table className="table custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Rank</th>
                      <th>Player</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th className="d-none d-md-table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item, index) => (
                      <tr key={item.id || index}>
                        <td>
                          {getRankBadge(index)}
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="avatar-circle">
                              {(item.name || 'P').charAt(0).toUpperCase()}
                            </span>
                            <span className="fw-semibold text-white">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="fw-bold text-white">
                            {item.score}
                          </span>
                          <span className="text-secondary small">
                            /{item.total || 5}
                          </span>
                        </td>
                        <td>
                          <span className={`badge rounded-pill ${
                            item.percentage >= 80 ? 'bg-success-subtle text-success border border-success-subtle' :
                            item.percentage >= 50 ? 'bg-warning-subtle text-warning border border-warning-subtle' :
                            'bg-secondary-subtle text-secondary border border-secondary-subtle'
                          }`}>
                            {item.percentage}%
                          </span>
                        </td>
                        <td className="d-none d-md-table-cell text-secondary small">
                          {item.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="display-6 mb-3">🎯</div>
                <h5 className="text-white fw-semibold">No Players Found</h5>
                <p className="text-secondary small mb-4">
                  {searchTerm
                    ? `No entries match "${searchTerm}".`
                    : 'The leaderboard is currently empty. Be the first to play!'}
                </p>
                <button
                  type="button"
                  className="btn btn-primary-gradient"
                  onClick={() => {
                    startQuiz(playerName || 'Player', 'All', 'All')
                    navigate('/quiz')
                  }}
                >
                  Start First Quiz 🚀
                </button>
              </div>
            )}

            {/* Clear Leaderboard Option */}
            {leaderboard.length > 0 && (
              <div className="mt-4 pt-3 border-top border-secondary border-opacity-10 d-flex justify-content-between align-items-center">
                <span className="text-secondary small">
                  Scores persist in local storage.
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => setShowClearConfirm(true)}
                >
                  🗑️ Clear Leaderboard
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card border border-secondary border-opacity-25 text-white">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Reset Leaderboard?</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowClearConfirm(false)}
                />
              </div>
              <div className="modal-body py-3 text-secondary">
                This will permanently remove all saved scores from your local browser storage. This action cannot be undone.
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-outline-glass text-secondary"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    clearLeaderboard()
                    setShowClearConfirm(false)
                  }}
                >
                  Yes, Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
