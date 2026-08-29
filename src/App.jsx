import { useState } from 'react'
import ThemeToggle from './components/ThemeToggle'
import TitleScreen from './components/TitleScreen'
import QuizScreen from './components/QuizScreen'
import { useOtdbQuestions } from './hooks/useOtdbQuestions'
import './App.css'

// The top-level component acts as a small state machine deciding which
// "screen" is currently shown -- the title screen, or the quiz itself.
// There's no router because there are only ever these two screens and no
// need for shareable/bookmarkable URLs for each one.
function App() {
  const [screen, setScreen] = useState('title')
  const [selectedDifficulty, setSelectedDifficulty] = useState('any')
  // Bumped every time a new quiz attempt begins (Start, or Play again).
  // Passing this as QuizScreen's `key` forces React to throw away the old
  // QuizScreen instance and mount a brand new one, which resets all of its
  // internal state (current question, answers) automatically -- no manual
  // "reset" logic required.
  const [quizAttemptId, setQuizAttemptId] = useState(0)

  const { questions, isLoading, error, fetchQuestions } = useOtdbQuestions()

  function handleStartQuiz(difficulty) {
    setSelectedDifficulty(difficulty)
    setScreen('quiz')
    setQuizAttemptId((id) => id + 1)
    fetchQuestions(difficulty)
  }

  function handleRetry() {
    fetchQuestions(selectedDifficulty)
  }

  function handlePlayAgain() {
    setQuizAttemptId((id) => id + 1)
    fetchQuestions(selectedDifficulty)
  }

  return (
    <>
      {/* Rendered independently of which screen is active, since the theme
          applies to the whole app, not just one screen. */}
      <ThemeToggle />

      {screen === 'title' && <TitleScreen onStart={handleStartQuiz} />}

      {screen === 'quiz' && (
        <QuizScreen
          key={quizAttemptId}
          questions={questions}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  )
}

export default App
