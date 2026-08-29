import AnswerOption from './AnswerOption'

// Presentational component for a single question: its number, the question
// text, and its 4 answer options. All of the actual quiz logic (which
// question we're on, whether it's been answered, scoring) lives in
// QuizScreen -- this component just renders whatever it's told to.
function QuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  selectedOptionIndex,
  hasAnswered,
  onSelectOption,
  headingRef,
}) {
  return (
    <div className="question-card">
      <h2 tabIndex={-1} ref={headingRef}>
        Question {questionNumber} of {totalQuestions}
      </h2>
      <p className="question-text">{questionText}</p>

      <div
        className="answer-options"
        role="group"
        aria-label={`Answer options for question ${questionNumber}`}
      >
        {options.map((option, optionIndex) => (
          <AnswerOption
            key={option.text}
            text={option.text}
            isCorrectAnswer={option.isCorrect}
            isSelected={selectedOptionIndex === optionIndex}
            hasAnswered={hasAnswered}
            onClick={() => onSelectOption(optionIndex)}
          />
        ))}
      </div>
    </div>
  )
}

export default QuestionCard
