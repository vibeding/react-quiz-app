import { useState } from 'react'
import { fetchTriviaQuestions } from '../api/otdbApi'
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities'
import { shuffleArray } from '../utils/shuffleArray'

// A custom hook that owns everything related to fetching a set of quiz
// questions: the questions themselves, whether a fetch is in progress, and
// any error message. Components just call `fetchQuestions(difficulty)` and
// read the returned state -- they don't need to know about OTDB, decoding,
// or shuffling at all.
export function useOtdbQuestions() {
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchQuestions(difficulty) {
    setIsLoading(true)
    setError(null)

    try {
      const rawQuestions = await fetchTriviaQuestions(difficulty)
      setQuestions(rawQuestions.map(buildProcessedQuestion))
    } catch (caughtError) {
      setError(caughtError.message)
      setQuestions([])
    } finally {
      setIsLoading(false)
    }
  }

  return { questions, isLoading, error, fetchQuestions }
}

// Turns one raw OTDB question into the shape our UI actually wants to
// render: decoded, human-readable text, and a single `options` array that
// mixes the correct answer in among the incorrect ones (in random order),
// each tagged with `isCorrect` so the UI can react to whichever one gets
// clicked without needing to compare strings.
function buildProcessedQuestion(rawQuestion) {
  const correctOption = { text: decodeHtmlEntities(rawQuestion.correct_answer), isCorrect: true }
  const incorrectOptions = rawQuestion.incorrect_answers.map((incorrectAnswerText) => ({
    text: decodeHtmlEntities(incorrectAnswerText),
    isCorrect: false,
  }))

  return {
    questionText: decodeHtmlEntities(rawQuestion.question),
    // Shuffling here (rather than once at fetch-time and reusing it) means
    // every fresh fetch -- including "Play again" -- automatically gets a
    // brand new answer order for free, with no extra logic required.
    options: shuffleArray([correctOption, ...incorrectOptions]),
  }
}
