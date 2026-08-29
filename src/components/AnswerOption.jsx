// A single clickable answer button inside a question. It doesn't know
// anything about scoring or quiz progress -- it just renders itself
// differently depending on the flags QuizScreen passes down:
//   - before an answer is chosen: a plain, neutral-looking button
//   - after an answer is chosen: green if this option is the correct
//     answer, red and faded if this is the (wrong) option the user picked,
//     and dimmed if it's one of the other untouched wrong options
function AnswerOption({ text, isCorrectAnswer, isSelected, hasAnswered, onClick }) {
  const classNames = ['answer-option']
  if (hasAnswered && isCorrectAnswer) {
    classNames.push('correct')
  } else if (hasAnswered && isSelected) {
    classNames.push('incorrect')
  }

  return (
    <button
      type="button"
      className={classNames.join(' ')}
      onClick={onClick}
      // aria-pressed tells assistive tech whether this specific option is
      // the one the user selected -- a toggle-button-style state.
      aria-pressed={isSelected}
      // We intentionally use aria-disabled instead of the native `disabled`
      // attribute once the question has been answered. Setting `disabled`
      // on the button the user just clicked would immediately blur it and
      // shove focus back to <body>, which is jarring for keyboard and
      // screen-reader users right after they made a choice. aria-disabled
      // keeps the button focusable while still announcing "not actionable"
      // -- the actual click-guard logic lives in QuizScreen's
      // handleSelectOption, which simply ignores clicks once answered.
      aria-disabled={hasAnswered}
    >
      {/* Correctness is never shown through color alone: an icon and
          visually-hidden text back up the color change for anyone who
          can't see (or can't easily distinguish) the green/red styling. */}
      {hasAnswered && isCorrectAnswer && (
        <span className="answer-icon" aria-hidden="true">
          ✓
        </span>
      )}
      {hasAnswered && isSelected && !isCorrectAnswer && (
        <span className="answer-icon" aria-hidden="true">
          ✕
        </span>
      )}

      <span>{text}</span>

      {hasAnswered && isCorrectAnswer && (
        <span className="visually-hidden"> — correct answer</span>
      )}
      {hasAnswered && isSelected && !isCorrectAnswer && (
        <span className="visually-hidden"> — you selected this, incorrect</span>
      )}
    </button>
  )
}

export default AnswerOption
