/* eslint-disable react/prop-types */
import '../styles/question.css'
export default function Question(props) {
  const answers = props.answers.map((answer, index) => {
    const styles = {
      backgroundColor: props.answersChecked && answer.isCorrect
      ?
      "#1ba13d"
      :
      props.answersChecked && answer.isSelected && !answer.isCorrect
      ?
      "#ff4784"
      :
      answer.isSelected ? "#ff4784" : "",

      opacity: props.checked && !answer.isSelected && !answer.isCorrect ? ".5":"1"
    }

    return <button 
      key={index} 
      className='question__btn'
      onClick={() => props.handleAnswersSelection(props.id, answer.answerId)}
      style={styles}
      >
        {answer.option}
    </button>
  })

  return (
    <div className='question__container'>
      <h1>{props.question}</h1>
      <div className='question__answers' >
        {answers}
      </div>
      <div className="question__line"></div>
    </div>
  )
}