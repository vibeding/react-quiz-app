// This module talks to the Open Trivia Database (OTDB) REST API and knows
// nothing about React -- it just builds a URL, fetches it, and turns the
// response into either an array of raw question objects or a thrown Error
// with a human-readable message. Keeping this separate from our React hook
// makes it easy to test or swap out on its own.

const OTDB_BASE_URL = 'https://opentdb.com/api.php'

// OTDB note: it rate-limits to one request per 5 seconds per IP address.
// We only ever call this on explicit user actions (Start, Retry, Play
// again), so a single quiz-taker is never going to hit that limit.
export async function fetchTriviaQuestions(difficulty) {
  const requestUrl = buildOtdbUrl(difficulty)

  let response
  try {
    response = await fetch(requestUrl)
  } catch {
    // fetch() only throws for network-level failures (offline, DNS, etc.),
    // never for HTTP error status codes -- those are handled below.
    throw new Error('Could not reach the trivia server. Check your connection and try again.')
  }

  if (!response.ok) {
    throw new Error('The trivia server returned an unexpected error. Please try again.')
  }

  const responseData = await response.json()

  // OTDB always replies with HTTP 200, even when something went wrong on
  // their end -- the real success/failure signal is this response_code field.
  if (responseData.response_code !== 0) {
    throw new Error(describeResponseCode(responseData.response_code))
  }

  return responseData.results
}

function buildOtdbUrl(difficulty) {
  const queryParams = new URLSearchParams({
    amount: '5',
    // "multiple" guarantees 4 answer options per question (true/false
    // questions would only give us 2, which doesn't fit our UI).
    type: 'multiple',
  })

  if (difficulty && difficulty !== 'any') {
    queryParams.set('difficulty', difficulty)
  }

  return `${OTDB_BASE_URL}?${queryParams.toString()}`
}

function describeResponseCode(responseCode) {
  // OTDB response_code meanings:
  //   0 = Success (handled above, before this function ever runs)
  //   1 = Could Not Return Results -- not enough questions exist for the
  //       requested amount/category/difficulty combination
  //   2 = Invalid Parameter -- one of our query params was malformed
  //   3, 4, 5 = session-token related codes; we don't use tokens, so these
  //       shouldn't occur, but we still give the user a message just in case
  switch (responseCode) {
    case 1:
      return "There aren't enough questions for that difficulty right now. Try a different setting."
    default:
      return 'Something went wrong fetching your quiz questions. Please try again.'
  }
}
