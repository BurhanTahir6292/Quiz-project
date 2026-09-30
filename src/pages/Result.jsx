import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { useQuiz } from '../context/QuizContext'

export default function Result() {
  const navigate = useNavigate()
  const {
    playerName,
    activeQuestions,
    userAnswers,
    calculateScore,
    selectedCategory,
    restartCurrentQuiz,
    startQuiz
  } = useQuiz()

  const [showReview, setShowReview] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const score = calculateScore()
  const total = activeQuestions.length || 1
  const percentage = Math.round((score / total) * 100)

  // Launch confetti on completion
  useEffect(() => {
    if (percentage >= 60) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      } catch {
        // Fallback if canvas is unavailable
      }
    }
  }, [percentage])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage('')
    }, 2800)
  }

  const handleShare = () => {
    const text = `🏆 I scored ${score}/${total} (${percentage}%) on QuizSpark! Can you beat my score?`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Score copied to clipboard! Share it with friends.')
      }).catch(() => {
        showToast('Score: ' + text)
      })
    } else {
      showToast(text)
    }
  }

  const getCelebrationMeta = () => {
    if (percentage === 100) {
      return {
        emoji: '🏆',
        badge: 'Perfect Score!',
        color: 'text-warning',
        feedback: 'Flawless execution! You mastered every single question.'
      }
    }
    if (percentage >= 80) {
      return {
        emoji: '🌟',
        badge: 'Quiz Champion',
        color: 'text-success',
        feedback: 'Fantastic job! You clearly know your stuff.'
      }
    }
    if (percentage >= 50) {
      return {
        emoji: '👍',
        badge: 'Solid Performance',
        color: 'text-info',
        feedback: 'Good effort! A little more practice and you will hit the top ranks.'
      }
    }
    return {
      emoji: '📚',
      badge: 'Keep Practicing',
      color: 'text-secondary',
      feedback: 'Great learning experience! Review the answers below and try again.'
    }
  }

  const meta = getCelebrationMeta()

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          
          {/* Result Card */}
          <div className="glass-card p-4 p-md-5 text-center">
            
            <div className="display-4 mb-2">{meta.emoji}</div>
            
            <span className="badge bg-secondary-subtle text-light border border-secondary-subtle rounded-pill px-3 py-1 fs-xs fw-semibold text-uppercase tracking-wider mb-3">
              {meta.badge}
            </span>

            <h2 className="fw-bold mb-1 text-white">
              Quiz Completed!
            </h2>
            <p className="text-secondary mb-4">
              <span className="fw-semibold text-white">{playerName || 'Player'}</span>, here is how you performed:
            </p>

            {/* Score Showcase */}
            <div className="d-inline-flex flex-column align-items-center justify-content-center p-4 rounded-circle my-3" style={{
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(30, 41, 59, 0.1) 70%)',
              border: '2px solid rgba(99, 102, 241, 0.4)',
              width: '180px',
              height: '180px'
            }}>
              <span className="display-4 fw-extrabold text-white mb-0 lh-1">
                {score}
                <span className="fs-5 text-secondary fw-normal">/{total}</span>
              </span>
              <span className="fw-bold text-success mt-2 fs-5">
                {percentage}%
              </span>
            </div>

            <p className="text-muted small mt-2 mb-4 mx-auto" style={{ maxWidth: '420px' }}>
              {meta.feedback}
            </p>

            {/* Stats Breakdown Grid */}
            <div className="row g-3 text-start mb-4">
              <div className="col-6 col-sm-3">
                <div className="stat-card">
                  <div className="stat-number text-success">{score}</div>
                  <div className="stat-label">Correct</div>
                </div>
              </div>
              <div className="col-6 col-sm-3">
                <div className="stat-card">
                  <div className="stat-number text-danger">{total - score}</div>
                  <div className="stat-label">Incorrect</div>
                </div>
              </div>
              <div className="col-6 col-sm-3">
                <div className="stat-card">
                  <div className="stat-number text-info">{percentage}%</div>
                  <div className="stat-label">Accuracy</div>
                </div>
              </div>
              <div className="col-6 col-sm-3">
                <div className="stat-card">
                  <div className="stat-number text-white fs-5 mt-1">{selectedCategory}</div>
                  <div className="stat-label">Category</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex flex-wrap justify-content-center gap-3 pt-2">
              <button
                type="button"
                className="btn btn-primary-gradient px-4"
                onClick={() => {
                  startQuiz(playerName, selectedCategory)
                  navigate('/quiz')
                }}
              >
                Play Again 🔄
              </button>

              <Link to="/leaderboard" className="btn btn-outline-glass">
                🏆 View Leaderboard
              </Link>

              <button
                type="button"
                className="btn btn-outline-glass"
                onClick={handleShare}
                title="Share your score"
              >
                📋 Share Result
              </button>

              <Link to="/" className="btn btn-outline-glass text-secondary">
                🏠 Home
              </Link>
            </div>

            {/* Toggle Detailed Review */}
            {activeQuestions.length > 0 && (
              <div className="mt-5 pt-4 border-top border-secondary border-opacity-10 text-start">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-glass w-100 d-flex justify-content-between align-items-center py-2"
                  onClick={() => setShowReview(!showReview)}
                >
                  <span className="fw-semibold">
                    📝 {showReview ? 'Hide Answers Review' : 'Review Questions & Detailed Answers'}
                  </span>
                  <span>{showReview ? '▲' : '▼'}</span>
                </button>

                {showReview && (
                  <div className="d-flex flex-column gap-3 mt-3">
                    {activeQuestions.map((q, idx) => {
                      const userPick = userAnswers[idx]
                      const isCorrect = userPick === q.answer

                      return (
                        <div
                          key={q.id || idx}
                          className="p-3 rounded-3"
                          style={{
                            background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                            border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="small fw-bold text-secondary">Question {idx + 1}</span>
                            <span className={`badge ${isCorrect ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                              {isCorrect ? 'Correct ✓' : userPick === null ? 'Timed Out ⏰' : 'Incorrect ✕'}
                            </span>
                          </div>
                          
                          <p className="fw-semibold text-white mb-2">{q.question}</p>
                          
                          <div className="small text-secondary mb-1">
                            Your answer: <span className={isCorrect ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                              {userPick || 'No answer'}
                            </span>
                          </div>

                          {!isCorrect && (
                            <div className="small text-success mb-2">
                              Correct answer: <span className="fw-bold">{q.answer}</span>
                            </div>
                          )}

                          {q.explanation && (
                            <div className="small text-muted border-top border-secondary border-opacity-25 pt-2 mt-2">
                              💡 <em>{q.explanation}</em>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          {toastMessage}
        </div>
      )}

    </div>
  )
}
