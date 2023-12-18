import { useEffect, useState } from 'react'
import './App.css'
import Question from './components/Question';
import Starter from './components/Starter';

import { nanoid } from 'nanoid';
import he from 'he';

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

function App() {
  const [questions, setQuestions] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [newGame, setNewGame] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showScore, setShowScore] = useState(0);
  const [answersChecked, setAnswersChecked] = useState(false);

  useEffect(() => {
      try {
        fetch(API_URL)
          .then(res => res.json())
          .then(data => {
            setQuestions(data.results.map((item) => {
                const id = nanoid();
                const shuffledAnswers = [...item.incorrect_answers, item.correct_answer].sort();
                const correctAnswer = item.correct_answer;
        
                const answers = shuffledAnswers.map((answer, index) => ({
                  option: he.decode(answer),
                  answerId: id + index,
                  isCorrect: answer === correctAnswer,
                  isSelected: false,
                  score: 0,
                }));
        
                return {
                  question: he.decode(item.question),
                  answers: answers,
                  id: id,
                }

              }));
          })
  
        return () => console.log("")
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
  }, [newGame, setQuestions]);

  function handleStartGame() {
    setGameStarted(prevGameStared => !prevGameStared)
  }

  function handleNewGame() {
    setGameStarted(prevGameStared => !prevGameStared)
    setNewGame(prevGame => !prevGame)

    if (answersChecked) {
      setAnswersChecked(prevAnswersChecked => !prevAnswersChecked)
    }

    setShowScore(0)
  }

  function handleAnswersSelection(questionId, id) {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (question.id === questionId) {
          const updatedAnswers = question.answers.map((answer) => {
            if (answer.answerId === id) {
              return {
                ...answer,
                isSelected: !answer.isSelected,
              };
            } else {
              return {
                ...answer,
                isSelected: false,
              };
            }
          });
          
          setSelectedAnswers((prevSelectedAnswers) => ({
            ...prevSelectedAnswers,
            [questionId]: updatedAnswers.find((answer) => answer.isSelected),
          }));

          return {
            ...question,
            answers: updatedAnswers,
          };
        } else {
          return { ...question };
        }
      })
    );
  }
  function checkAnswers() {
    setAnswersChecked((prevAnswersChecked) => !prevAnswersChecked);
  
    let correctAnswersCount = 0;
  
    questions.forEach((question) => {
      const selectedAnswer = selectedAnswers[question.id];
      
      if (selectedAnswer && selectedAnswer.isCorrect) {
        correctAnswersCount += 1;
      }
    });
  
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
      {
        !gameStarted 
        ? 
        <Starter handleStartBtn={handleStartGame}/>
        : 
        questionsEl
      }
      
      {
        gameStarted && !answersChecked 
        ?
        <div>
          <button className='check_answers-btn' onClick={checkAnswers}>
            Check Answers
          </button>
        </div>
        :
        gameStarted && answersChecked ?
        <div>
          <h2>You scored {showScore}/{questions.length} correct answers</h2>
          <button className='play-again-btn' onClick={handleNewGame}>
            Play Again
          </button>
        </div>
        :

        ""
      }
    </main>
  )
}

export default App
