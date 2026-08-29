import { useState } from 'react'

// The four difficulty choices OTDB accepts, plus "any" (which we send as no
// difficulty parameter at all -- see src/api/otdbApi.js).
const DIFFICULTY_OPTIONS = [
  { value: 'any', label: 'Any difficulty' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

// The very first screen the user sees: the app's name, a short description
// of what it does, a difficulty selector, and the button that kicks off the
// quiz. This component only tracks the chosen difficulty locally -- once
// "Start quiz" is clicked, that choice is handed up to <App> via onStart and
// this component's own state no longer matters.
function TitleScreen({ onStart }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('any')

  function handleStartClick() {
    onStart(selectedDifficulty)
  }

  return (
    <section className="title-screen">
      <h1>QuizDing</h1>
      <p className="title-screen-description">
        Test your knowledge with 5 random trivia questions pulled fresh from the Open Trivia
        Database. Pick a difficulty and see how many you can get right!
      </p>

      <div className="difficulty-picker">
        <label htmlFor="difficulty-select">Difficulty</label>
        <select
          id="difficulty-select"
          value={selectedDifficulty}
          onChange={(event) => setSelectedDifficulty(event.target.value)}
        >
          {DIFFICULTY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button type="button" className="start-quiz-button" onClick={handleStartClick}>
        Start quiz
      </button>
    </section>
  )
}

export default TitleScreen
