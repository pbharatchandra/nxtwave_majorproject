import { createContext, useState } from 'react'

const EvaluationContext = createContext()

export const EvaluationProvider = ({ children }) => {
    const [questions, setQuestions] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [score, setScore] = useState(0)
    const [timeTaken, setTimeTaken] = useState(0)
    const [isTimeUp, setIsTimeUp] = useState(false)
    const [timeLeft, setTimeLeft] = useState(600)


    const resetAssessment = () => {
        setQuestions([])
        setCurrentQuestionIndex(0)
        setSelectedAnswers({})
        setScore(0)
        setTimeTaken(0)
        setIsTimeUp(false)
        setTimeLeft(600)
    }
    return (
        <EvaluationContext.Provider
            value={{
                questions,
                setQuestions,
                currentQuestionIndex,
                setCurrentQuestionIndex,
                selectedAnswers,
                setSelectedAnswers,
                score,
                setScore,
                timeTaken,
                setTimeTaken,
                isTimeUp,
                setIsTimeUp,
                resetAssessment,
                timeLeft,
                setTimeLeft,
                score,
                setScore,
                timeTaken,
                setTimeTaken,
            }}
        >
            {children}
        </EvaluationContext.Provider>
    )
}

export default EvaluationContext