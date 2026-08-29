import { useEffect, useRef, useState } from 'react'
import QuestionCard from './QuestionCard'
import SummaryScreen from './SummaryScreen'
import './QuizScreen.css'

// Owns the state for a single attempt at the quiz: which question we're on,
// and what the user answered for each question so far. QuizScreen is
// remounted fresh (via the `key` prop App.jsx gives it) every time a new
// quiz attempt starts, so this state never needs to be manually reset.
function QuizScreen({ questions, isLoading, error, onRetry, onPlayAgain }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  // answers[i] holds { optionIndex, isCorrect } once question i has been
  // answered, or is undefined/missing if it hasn't been reached yet.
  const [answers, setAnswers] = useState([])

  // A single ref, reused by whichever heading is currently on screen
  // (loading / error / question / summary). Moving focus to it after real
  // navigation events keeps keyboard and screen-reader users oriented as
  // the screen's content changes.
  const activeHeadingRef = useRef(null)

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestionIndex]
  const hasAnsweredCurrentQuestion = Boolean(currentAnswer)
  const score = answers.filter(Boolean).filter((answer) => answer.isCorrect).length
  const quizIsComplete = questions.length > 0 && currentQuestionIndex >= questions.length
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const hasError = Boolean(error)

  // Text announced to screen reader users via the always-present live
  // region below. This is computed fresh on every render (instead of being
  // stored in its own state + effect) since it's entirely derivable from
  // state we already have -- there's no reason to introduce an extra
  // render cycle just to keep a copy of it in sync.
  const liveMessage = getLiveMessage({
    isLoading,
    error,
    quizIsComplete,
    score,
    totalQuestions: questions.length,
    currentQuestion,
    currentQuestionIndex,
    hasAnsweredCurrentQuestion,
    currentAnswer,
  })

  // Move focus to whichever heading is now showing, but only when we've
  // actually navigated to a new "view" within the quiz screen -- not every
  // time `answers` changes. If this effect also depended on `answers`,
  // clicking an answer option would yank focus away from the very button
  // the user just clicked, which would be disorienting.
  useEffect(() => {
    activeHeadingRef.current?.focus()
  }, [isLoading, hasError, currentQuestionIndex, quizIsComplete])

  function handleSelectOption(optionIndex) {
    // Ignore clicks once this question already has a locked-in answer --
    // this is what prevents the user from "changing" their answer after
    // seeing the correct/incorrect feedback.
    if (hasAnsweredCurrentQuestion) return

    const chosenOption = currentQuestion.options[optionIndex]
    const updatedAnswers = [...answers]
    updatedAnswers[currentQuestionIndex] = {
      optionIndex,
      isCorrect: chosenOption.isCorrect,
    }
    setAnswers(updatedAnswers)
  }

  function handleNextQuestion() {
    setCurrentQuestionIndex((index) => index + 1)
  }

  return (
    <section className="quiz-screen">
      {/* Always mounted (never conditionally rendered) so screen readers
          reliably pick up text changes inside it -- some assistive tech
          won't announce updates to a live region that didn't already exist
          in the DOM before the change happened. */}
      <div aria-live={hasError ? 'assertive' : 'polite'} className="visually-hidden">
        {liveMessage}
      </div>

      {isLoading && (
        <div className="quiz-status">
          <h2 tabIndex={-1} ref={activeHeadingRef}>
            Loading questions…
          </h2>
        </div>
      )}

      {!isLoading && error && (
        <div className="quiz-status">
          <h2 tabIndex={-1} ref={activeHeadingRef}>
            Something went wrong
          </h2>
          <p>{error}</p>
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && quizIsComplete && (
        <SummaryScreen
          score={score}
          totalQuestions={questions.length}
          onPlayAgain={onPlayAgain}
          headingRef={activeHeadingRef}
        />
      )}

      {!isLoading && !error && !quizIsComplete && currentQuestion && (
        <>
          <QuestionCard
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            questionText={currentQuestion.questionText}
            options={currentQuestion.options}
            selectedOptionIndex={answers[currentQuestionIndex]?.optionIndex}
            hasAnswered={hasAnsweredCurrentQuestion}
            onSelectOption={handleSelectOption}
            headingRef={activeHeadingRef}
          />

          {hasAnsweredCurrentQuestion && (
            <button type="button" className="next-question-button" onClick={handleNextQuestion}>
              {isLastQuestion ? 'See results' : 'Next question'}
            </button>
          )}
        </>
      )}
    </section>
  )
}

// Builds the sentence announced to screen reader users for whatever the
// quiz is currently doing. Kept as a plain function (rather than a
// useEffect + setState pair) so it's just a value derived from render-time
// state, with no separate render cycle needed to keep it in sync.
function getLiveMessage({
  isLoading,
  error,
  quizIsComplete,
  score,
  totalQuestions,
  currentQuestion,
  currentQuestionIndex,
  hasAnsweredCurrentQuestion,
  currentAnswer,
}) {
  if (isLoading) return 'Loading questions…'
  if (error) return error
  if (quizIsComplete) return `Quiz complete. You scored ${score} out of ${totalQuestions}.`
  if (!currentQuestion) return ''

  if (hasAnsweredCurrentQuestion) {
    if (currentAnswer.isCorrect) return 'Correct!'
    const correctOptionText = currentQuestion.options.find((option) => option.isCorrect).text
    return `Incorrect. The correct answer was ${correctOptionText}.`
  }

  return `Question ${currentQuestionIndex + 1} of ${totalQuestions}.`
}

export default QuizScreen
