import { useEffect, useState } from 'react'
import './App.css'
import Question from './components/Question';
import Starter from './components/Starter';

import { nanoid } from 'nanoid';
import he from 'he'; // html entities

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

function App() {
  const [questions, setQuestions] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [newGame, setNewGame] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showScore, setShowScore] = useState(0);
  const [answersChecked, setAnswersChecked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
  
        // Set questions state with transformed data
        setQuestions(data.results.map((item) => {
          const id = nanoid();
          const shuffledAnswers = [...item.incorrect_answers, item.correct_answer].sort();
          const correctAnswer = item.correct_answer;
  
          // Generate answers array with necessary properties
          const answers = shuffledAnswers.map((answer, index) => ({
            option: he.decode(answer),
            answerId: id + index,
            isCorrect: answer === correctAnswer,
            isSelected: false,
            score: 0,
          }));
  
          // Return question object
          return {
            question: he.decode(item.question),
            answers: answers,
            id: id,
          }
        }));
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
  
    fetchData();
  
    // Cleanup function
    return () => console.log("");
  }, [newGame, setQuestions]);

  function handleStartGame() {
    setGameStarted(prevGameStared => !prevGameStared)
  }

  function handleNewGame() {
    setGameStarted(!gameStarted);
    setNewGame(!newGame);
  
    if (answersChecked) {
      setAnswersChecked(!answersChecked);
    }
  
    setShowScore(0);
  }

  function handleAnswersSelection(questionId, id) {
    // Update the questions state by mapping over the previous questions
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (question.id === questionId) {
          // Update the isSelected property for each answer
          const updatedAnswers = question.answers.map((answer) => ({
            ...answer,
            isSelected: answer.answerId === id ? !answer.isSelected : false,
          }));
  
          // Find the selected answer
          const selectedAnswer = updatedAnswers.find((answer) => answer.isSelected);
  
          // Update the selectedAnswers state object with the selected answer
          setSelectedAnswers((prevSelectedAnswers) => ({
            ...prevSelectedAnswers,
            [questionId]: selectedAnswer,
          }));
  
          // Return the updated question with the updated answers
          return {
            ...question,
            answers: updatedAnswers,
          };
        } else {
          // Return the unchanged question
          return question;
        }
      })
    );
  }

  function checkAnswers() {
    const newAnswersChecked = !answersChecked;
    setAnswersChecked(newAnswersChecked);
  
    // Calculate the number of correct answers
    const correctAnswersCount = questions.reduce((count, question) => {
      // Get the selected answer for the question
      const selectedAnswer = selectedAnswers[question.id];
      // Increment the count if the selected answer is correct
      return count + (selectedAnswer && selectedAnswer.isCorrect ? 1 : 0);
    }, 0);
  
    // Display the score
    setShowScore(correctAnswersCount);
  }

  const questionsEl = questions.map((question, index) => {
    return <Question 
      key={index}
      question={question.question} 
      answers={question.answers}
      id={question.id}
      handleAnswersSelection={handleAnswersSelection}
      answersChecked={answersChecked}
    />
  })

  return (
    <main>
      {!gameStarted ? (
        <Starter handleStartBtn={handleStartGame} />
      ) : (
        questionsEl
      )}
  
      {gameStarted && !answersChecked && (
        <div>
          <button className='check_answers-btn' onClick={checkAnswers}>
            Check Answers
          </button>
        </div>
      )}
  
      {gameStarted && answersChecked && (
        <div>
          <h2>You scored {showScore}/{questions.length} correct answers</h2>
          <button className='play-again-btn' onClick={handleNewGame}>
            Play Again
          </button>
        </div>
      )}
    </main>
  );
}

export default App
