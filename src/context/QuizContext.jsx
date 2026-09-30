import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import rawQuestions from '../data/questions.json'
import { sound } from '../utils/audio'

const QuizContext = createContext(null)

const INITIAL_LEADERBOARD = [
  {
    id: 'seed-1',
    name: 'YahuBaba',
    score: 5,
    total: 5,
    percentage: 100,
    date: '01/01/2026, 12:00:00',
    category: 'All'
  },
  {
    id: 'seed-2',
    name: 'Sanchit',
    score: 4,
    total: 5,
    percentage: 80,
    date: '01/01/2026, 15:30:00',
    category: 'Web Development'
  },
  {
    id: 'seed-3',
    name: 'Aria Stark',
    score: 3,
    total: 5,
    percentage: 60,
    date: '02/01/2026, 09:15:00',
    category: 'Programming'
  }
]

const DEFAULT_TIME = 15 // 15 seconds per question

export function QuizProvider({ children }) {
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('quiz_player_name') || ''
  })
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [activeQuestions, setActiveQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({}) // { [index]: selectedOption }
  const [quizFinished, setQuizFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [soundOn, setSoundOn] = useState(true)

  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const saved = localStorage.getItem('quiz_leaderboard')
      if (saved) return JSON.parse(saved)
    } catch (err) {
      console.error('Failed to load leaderboard from storage:', err)
    }
    return INITIAL_LEADERBOARD
  })

  // Sync leaderboard with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quiz_leaderboard', JSON.stringify(leaderboard))
    } catch (err) {
      console.error('Failed to save leaderboard:', err)
    }
  }, [leaderboard])

  // Sync player name
  useEffect(() => {
    if (playerName) {
      localStorage.setItem('quiz_player_name', playerName)
    }
  }, [playerName])

  const toggleSound = () => {
    const newState = sound.toggle()
    setSoundOn(newState)
  }

  // Filter and prepare questions
  const prepareQuestions = useCallback((category = 'All', difficulty = 'All') => {
    let list = [...rawQuestions]
    if (category !== 'All') {
      list = list.filter((q) => q.category.toLowerCase() === category.toLowerCase())
    }
    if (difficulty !== 'All') {
      list = list.filter((q) => q.difficulty.toLowerCase() === difficulty.toLowerCase())
    }
    // Fallback if filter leaves empty
    if (list.length === 0) {
      list = [...rawQuestions]
    }
    // Shuffle questions slightly for replayability
    return [...list].sort(() => Math.random() - 0.5).slice(0, 5)
  }, [])

  // Start new quiz
  const startQuiz = (name, category = 'All', difficulty = 'All') => {
    const trimmedName = name.trim() || 'Anonymous Player'
    setPlayerName(trimmedName)
    setSelectedCategory(category)
    setSelectedDifficulty(difficulty)

    const questions = prepareQuestions(category, difficulty)
    setActiveQuestions(questions)
    setCurrentIndex(0)
    setUserAnswers({})
    setQuizFinished(false)
    setTimeLeft(DEFAULT_TIME)
    setIsTimerRunning(true)
    sound.playClick()
  }

  // Compute final score
  const calculateScore = useCallback(() => {
    let score = 0
    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) {
        score += 1
      }
    })
    return score
  }, [activeQuestions, userAnswers])

  // Finish quiz and record in leaderboard
  const finishQuiz = useCallback(() => {
    setIsTimerRunning(false)
    setQuizFinished(true)

    let score = 0
    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) {
        score += 1
      }
    })

    const total = activeQuestions.length || 1
    const percentage = Math.round((score / total) * 100)

    const newRecord = {
      id: Date.now().toString(),
      name: playerName || 'Player',
      score,
      total,
      percentage,
      category: selectedCategory,
      date: new Date().toLocaleString()
    }

    setLeaderboard((prev) => [newRecord, ...prev])

    if (percentage >= 80) {
      sound.playFanfare()
    } else {
      sound.playClick()
    }
  }, [activeQuestions, userAnswers, playerName, selectedCategory])

  // Advance to next question or end
  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1)
      setTimeLeft(DEFAULT_TIME)
      setIsTimerRunning(true)
      sound.playClick()
    } else {
      finishQuiz()
    }
  }, [currentIndex, activeQuestions.length, finishQuiz])

  // Select an answer
  const selectAnswer = (option) => {
    if (userAnswers[currentIndex] !== undefined) return // already answered

    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: option
    }))

    const currentQ = activeQuestions[currentIndex]
    if (option === currentQ?.answer) {
      sound.playCorrect()
    } else {
      sound.playIncorrect()
    }
  }

  // Timer countdown hook
  useEffect(() => {
    if (!isTimerRunning || quizFinished) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Time expired for this question: record timeout answer if not selected
          setUserAnswers((ans) => {
            if (ans[currentIndex] === undefined) {
              return { ...ans, [currentIndex]: null } // timed out
            }
            return ans
          })
          // Auto advance after slight delay
          setTimeout(() => {
            nextQuestion()
          }, 300)
          return 0
        }
        if (prev <= 4) {
          sound.playTick()
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerRunning, quizFinished, currentIndex, nextQuestion])

  // Clear leaderboard
  const clearLeaderboard = () => {
    setLeaderboard([])
    localStorage.removeItem('quiz_leaderboard')
    sound.playClick()
  }

  const restartCurrentQuiz = () => {
    if (activeQuestions.length === 0) return
    setCurrentIndex(0)
    setUserAnswers({})
    setQuizFinished(false)
    setTimeLeft(DEFAULT_TIME)
    setIsTimerRunning(true)
    sound.playClick()
  }

  return (
    <QuizContext.Provider
      value={{
        playerName,
        setPlayerName,
        selectedCategory,
        setSelectedCategory,
        selectedDifficulty,
        setSelectedDifficulty,
        activeQuestions,
        currentIndex,
        userAnswers,
        quizFinished,
        timeLeft,
        defaultTime: DEFAULT_TIME,
        isTimerRunning,
        soundOn,
        toggleSound,
        leaderboard,
        startQuiz,
        selectAnswer,
        nextQuestion,
        finishQuiz,
        calculateScore,
        clearLeaderboard,
        restartCurrentQuiz
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}
