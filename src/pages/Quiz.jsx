import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function Quiz() {
  const navigate = useNavigate()
  const {
    activeQuestions,
    currentIndex,
    userAnswers,
    timeLeft,
    defaultTime,
    selectAnswer,
    nextQuestion,
    quizFinished,
    startQuiz,
    playerName
  } = useQuiz()

  const [showExitModal, setShowExitModal] = useState(false)

  // Redirect or auto-start if arrived directly without active questions
  useEffect(() => {
    if (activeQuestions.length === 0) {
      startQuiz(playerName || 'Player', 'All', 'All')
    }
  }, [activeQuestions.length, playerName, startQuiz])

  // Navigate to result screen when quiz is finished
  useEffect(() => {
    if (quizFinished) {
      navigate('/result')
    }
  }, [quizFinished, navigate])

  const currentQ = activeQuestions[currentIndex]
  const currentAnswer = userAnswers[currentIndex]
  const hasAnswered = currentAnswer !== undefined
  const totalQuestions = activeQuestions.length || 1
  const progressPercent = Math.round(((currentIndex + (hasAnswered ? 1 : 0)) / totalQuestions) * 100)

  // Timer pill status class
  const getTimerClass = () => {
    if (timeLeft > 7) return 'normal'
    if (timeLeft > 3) return 'warning'
    return 'danger'
  }

  if (!currentQ) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Quiz...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          
          {/* Header Stats Bar */}
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-secondary-subtle text-light border border-secondary-subtle rounded-pill px-3 py-2">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              {currentQ.category && (
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 d-none d-sm-inline-block">
                  {currentQ.category}
                </span>
              )}
            </div>

            <div className="d-flex align-items-center gap-2">
              {/* Dynamic Countdown Timer */}
              <div className={`timer-pill ${getTimerClass()}`}>
                <span>⏳</span>
                <span>{timeLeft}s</span>
              </div>

              {/* Exit Quiz Button */}
              <button
                type="button"
                className="btn btn-sm btn-outline-glass text-secondary"
                onClick={() => setShowExitModal(true)}
                title="Exit Quiz"
              >
                ✕ Exit
              </button>
            </div>
          </div>

          {/* Smooth Progress Bar */}
          <div className="progress-container mb-4" role="progressbar" aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="glass-card p-4 p-md-5 mb-4">
            
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-secondary small fw-semibold text-uppercase tracking-wider">
                Select the correct answer:
              </span>
              {currentQ.difficulty && (
                <span className="badge bg-dark border border-secondary border-opacity-25 text-capitalize text-muted px-2 py-1 fs-xs">
                  {currentQ.difficulty}
                </span>
              )}
            </div>

            {/* Question Text */}
            <h3 className="fw-bold mb-4 lh-base text-white">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="d-flex flex-column gap-3">
              {currentQ.options.map((option, idx) => {
                const label = OPTION_LABELS[idx] || `${idx + 1}`
                const isSelected = currentAnswer === option
                const isCorrect = option === currentQ.answer

                let stateClass = ''
                if (hasAnswered) {
                  if (isCorrect) {
                    stateClass = 'correct'
                  } else if (isSelected && !isCorrect) {
                    stateClass = 'incorrect'
                  }
                } else if (isSelected) {
                  stateClass = 'selected'
                }

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={hasAnswered}
                    className={`option-btn ${stateClass}`}
                    onClick={() => selectAnswer(option)}
                  >
                    <span className="option-letter">{label}</span>
                    <span className="flex-grow-1">{option}</span>
                    {hasAnswered && isCorrect && (
                      <span className="badge bg-success rounded-circle p-1">✓</span>
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <span className="badge bg-danger rounded-circle p-1">✕</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Educational Explanation Box (Shown upon answering) */}
            {hasAnswered && currentQ.explanation && (
              <div className="explanation-box mt-4">
                <div className="fw-semibold text-white mb-1 d-flex align-items-center gap-1">
                  <span>💡</span> Did you know?
                </div>
                <div>{currentQ.explanation}</div>
              </div>
            )}

            {/* Action Bar (Proceed to Next) */}
            {hasAnswered && (
              <div className="mt-4 pt-3 border-top border-secondary border-opacity-10 d-flex justify-content-between align-items-center">
                <div className="text-secondary small">
                  {currentAnswer === currentQ.answer ? (
                    <span className="text-success fw-semibold">🎯 Spot on! Great job.</span>
                  ) : currentAnswer === null ? (
                    <span className="text-warning fw-semibold">⏰ Time ran out for this question.</span>
                  ) : (
                    <span className="text-danger fw-semibold">❌ Not quite. The correct answer was {currentQ.answer}.</span>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-primary-gradient px-4 py-2"
                  onClick={nextQuestion}
                >
                  {currentIndex + 1 === totalQuestions ? 'Finish Quiz 🏁' : 'Next Question ➔'}
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card border border-secondary border-opacity-25 text-white">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Leave Challenge?</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowExitModal(false)}
                />
              </div>
              <div className="modal-body py-3 text-secondary">
                Are you sure you want to exit? Your current progress for this round will not be saved to the leaderboard.
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-outline-glass text-secondary"
                  onClick={() => setShowExitModal(false)}
                >
                  Keep Playing
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => navigate('/')}
                >
                  Yes, Quit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
