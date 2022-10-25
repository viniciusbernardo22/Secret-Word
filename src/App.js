import './App.css'

import { useCallback, useEffect, useState } from 'react'
import { wordsList } from './data/words'

import StartScreen from './components/start/StartScreen'
import GameOver from './components/gameOver/GameOver'
import Game from './components/game/Game'
const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' }
]

const guessesQty = 3
function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState('')
  const [pickedCategory, setPickedCategory] = useState('')
  const [letters, setPickedLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)

    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)]

    const word =
      words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category }
  }, [words])
  const startGame = useCallback(() => {
    clearLetterStates()
    const { word, category } = pickWordAndCategory()

    let wordLetters = word.split('')
    wordLetters = wordLetters.map(l => l.toLowerCase())

    //fill states

    setPickedWord(word)
    setPickedCategory(category)
    setPickedLetters(wordLetters)
    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  const verifyLetter = letter => {
    const normalizedLetter = letter.toLowerCase()
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return
    }
    //push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters(actualGuessedLetters => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters(actualWrongLetters => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      setGuesses(actualGuesses => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  //check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      //reset all states
      clearLetterStates()
      setGameStage(stages[2].name)
    }
  }, [guesses])

  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)
    setGameStage(stages[0].name)
  }

  //check win condition

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    if (guessedLetters.length === uniqueLetters.length) {
      //add score
      setScore(actualScore => (actualScore += 100))
      //restard game with new word
      startGame()
    }
  }, [guessedLetters, letters, startGame])
  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  )
}

export default App
