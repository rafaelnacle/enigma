/* eslint-disable react/prop-types */
import "../styles/starter.css"
export default function Starter(props) {

  return (
    <div className="starter__container">
      <h1>Enigma</h1>
      <p>Unravel the mysteries of knowledge in a captivating and challenging quiz adventure!</p>
      <button onClick={ props.handleStartBtn }>Start quiz</button>
    </div>
  )
}