import { useEffect } from 'react'
import confetti from 'canvas-confetti'

// Shown once the user has answered all 5 questions: their score, and a
// "Play again" button to start a fresh attempt. A perfect score triggers a
// celebratory confetti burst.
function SummaryScreen({ score, totalQuestions, onPlayAgain, headingRef }) {
  const isPerfectScore = score === totalQuestions

  useEffect(() => {
    if (isPerfectScore) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
    }
    // SummaryScreen only ever mounts once, right when the quiz has just
    // finished (its parent, QuizScreen, only renders it once the quiz
    // becomes complete) -- and score/totalQuestions (and therefore
    // isPerfectScore) never change for the lifetime of this component, so
    // this effect only ever runs the one time it matters. Note: in
    // development, React's StrictMode intentionally runs effects twice, so
    // you may see the confetti fire twice locally -- that's expected and
    // won't happen in a production build.
  }, [isPerfectScore])

  return (
    <div className="summary-screen">
      <h2 tabIndex={-1} ref={headingRef}>
        Quiz complete!
      </h2>
      <p className="summary-score">
        You got {score} out of {totalQuestions} correct.
      </p>
      {isPerfectScore && <p className="summary-perfect">Perfect score! 🎉</p>}
      <button type="button" className="play-again-button" onClick={onPlayAgain}>
        Play again
      </button>
    </div>
  )
}

export default SummaryScreen
