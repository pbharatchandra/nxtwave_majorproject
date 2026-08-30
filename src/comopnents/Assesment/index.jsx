import { useState, useEffect, useContext } from 'react'

import Header from '../Header'
import EvaluationContext from '../../context/EvaluationProvider'

import './index.css'
import { useNavigate } from 'react-router-dom'

const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE',
}

const Assessment = () => {
    const navigate = useNavigate()

    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

    const {
        questions,
        setQuestions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        selectedAnswers,
        setSelectedAnswers,
        setScore,
        setTimeTaken,
        timeLeft,
        setTimeLeft,
        setIsTimeUp,
    } = useContext(EvaluationContext)
    const calculateAndSubmitAssessment = timeUp => {
        let correctAnswers = 0

        questions.forEach((question, index) => {
            const selectedOptionId = selectedAnswers[index]

            const correctOption = question.options.find(
                option => option.is_correct === true || option.is_correct === 'true',
            )

            if (correctOption && selectedOptionId === correctOption.id) {
                correctAnswers += 1
            }
        })

        setScore(correctAnswers)
        setTimeTaken(600 - timeLeft)

        if (timeUp) {
            setIsTimeUp(true)
        }

        navigate('/results', { replace: true })
    }

    useEffect(() => {
        if (apiStatus !== apiStatusConstants.success) {
            return undefined
        }

        if (timeLeft <= 0) {
            calculateAndSubmitAssessment(true)
            return undefined
        }

        const timerId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1)
        }, 1000)

        return () => clearInterval(timerId)
    }, [apiStatus, timeLeft, navigate, setTimeLeft, setIsTimeUp])

    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60)
        const seconds = timeLeft % 60

        return `${String(minutes).padStart(2, '0')}:${String(
            seconds,
        ).padStart(2, '0')}`
    }



    const getQuestions = async () => {
        setApiStatus(apiStatusConstants.inProgress)

        try {
            const response = await fetch('/api/assess/questions')
            const data = await response.json()

            if (response.ok) {
                setQuestions(data.questions)
                setCurrentQuestionIndex(0)
                setSelectedAnswers({})
                setApiStatus(apiStatusConstants.success)
            } else {
                setApiStatus(apiStatusConstants.failure)
            }
        } catch {
            setApiStatus(apiStatusConstants.failure)
        }
    }
    useEffect(() => {
        const currentQuestion = questions[currentQuestionIndex]

        if (
            currentQuestion &&
            currentQuestion.options_type === 'SINGLE_SELECT' &&
            selectedAnswers[currentQuestionIndex] === undefined &&
            currentQuestion.options.length > 0
        ) {
            setSelectedAnswers(prevAnswers => ({
                ...prevAnswers,
                [currentQuestionIndex]: currentQuestion.options[0].id,
            }))
        }
    }, [
        currentQuestionIndex,
        questions,
        selectedAnswers,
        setSelectedAnswers,
    ])
    useEffect(() => {
        getQuestions()
    }, [])

    const onClickOption = optionId => {
        setSelectedAnswers(prevAnswers => ({
            ...prevAnswers,
            [currentQuestionIndex]: optionId,
        }))
    }

    const onClickNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1)
        }
    }

    const onClickQuestionNumber = index => {
        setCurrentQuestionIndex(index)
    }

    const getAnsweredCount = () => Object.keys(selectedAnswers).length

    const renderLoadingView = () => (
        <div className="loader-container" data-testid="loader">
            <div className="loader" />
        </div>
    )

    const renderFailureView = () => (
        <div className="failure-container">
            <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-assess-failure-view.png"
                alt="failure view"
                className="failure-image"
            />

            <h1>Oops! Something went wrong</h1>

            <p>We are having some trouble processing your request.</p>

            <button
                type="button"
                onClick={getQuestions}
                className="retry-button"
            >
                Retry
            </button>
        </div>
    )
    const onSubmitAssessment = () => {
        calculateAndSubmitAssessment(false)
    }
    const renderQuestionView = () => {
        const currentQuestion = questions[currentQuestionIndex]

        console.log('Question:', currentQuestion)
        console.log('Option type:', currentQuestion?.options_type)


        if (!currentQuestion) {
            return null
        }

        const answeredCount = getAnsweredCount()
        const unansweredCount = questions.length - answeredCount

        const renderOptions = () => {
            const { options_type, options } = currentQuestion

            // DEFAULT OPTIONS
            if (options_type === 'DEFAULT') {
                return (
                    <div className="options-container">
                        {options.map(option => {
                            const isSelected =
                                selectedAnswers[currentQuestionIndex] === option.id

                            return (
                                <button
                                    type="button"
                                    key={option.id}
                                    className={
                                        isSelected
                                            ? 'option-button selected-option'
                                            : 'option-button'
                                    }
                                    onClick={() => onClickOption(option.id)}
                                >
                                    {option.text}
                                </button>
                            )
                        })}
                    </div>
                )
            }

            // IMAGE OPTIONS
            if (options_type === 'IMAGE') {
                return (
                    <div className="image-options-container">
                        {options.map(option => {
                            const isSelected =
                                selectedAnswers[currentQuestionIndex] === option.id

                            return (
                                <button
                                    type="button"
                                    key={option.id}
                                    className={
                                        isSelected
                                            ? 'image-option selected-image-option'
                                            : 'image-option'
                                    }
                                    onClick={() => onClickOption(option.id)}
                                >
                                    <img
                                        src={option.image_url}
                                        alt={option.text}
                                        className="option-image"
                                    />
                                </button>
                            )
                        })}
                    </div>
                )
            }

            // SINGLE SELECT OPTIONS
            if (options_type === 'SINGLE_SELECT') {
                const selectedOption =
                    selectedAnswers[currentQuestionIndex] || options[0]?.id

                return (
                    <select
                        className="select-option"
                        value={selectedOption}
                        onChange={event => onClickOption(event.target.value)}
                    >
                        {options.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.text}
                            </option>
                        ))}
                    </select>
                )
            }

            return null
        }

        return (
            <div className="assessment-layout">
                <div className="question-section">
                    <div className="timer-container">
                        <p className="timer-label">Time Left</p>
                        <h2 className="timer">{formatTime()}</h2>
                    </div>
                    <p className="question-count">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </p>

                    <h1 className="question-text">
                        {currentQuestion.question_text}
                    </h1>

                    {renderOptions()}

                    {currentQuestionIndex < questions.length - 1 ? (
                        <button
                            type="button"
                            className="next-question-button"
                            onClick={onClickNextQuestion}
                        >
                            Next Question
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="submit-button"
                            onClick={onSubmitAssessment}
                        >
                            Submit Assessment
                        </button>
                    )}
                </div>

                <aside className="question-palette">
                    <div className="answer-counts">
                        <p>
                            Answered: <span>{answeredCount}</span>
                        </p>

                        <p>
                            Unanswered: <span>{unansweredCount}</span>
                        </p>
                    </div>

                    <h2>Questions</h2>

                    <div className="question-numbers">
                        {questions.map((question, index) => {
                            const isAnswered =
                                selectedAnswers[index] !== undefined

                            const isActive =
                                index === currentQuestionIndex

                            return (
                                <button
                                    type="button"
                                    key={question.id}
                                    onClick={() => onClickQuestionNumber(index)}
                                    className={
                                        isActive
                                            ? 'question-number active-question'
                                            : isAnswered
                                                ? 'question-number answered-question'
                                                : 'question-number'
                                    }
                                >
                                    {index + 1}
                                </button>
                            )
                        })}
                    </div>
                </aside>
            </div>
        )
    }

    const renderAssessmentView = () => {
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return renderLoadingView()

            case apiStatusConstants.success:
                return renderQuestionView()

            case apiStatusConstants.failure:
                return renderFailureView()

            default:
                return null
        }
    }

    return (
        <div className="assessment-page">
            <Header />

            <main className="assessment-content">
                {renderAssessmentView()}
            </main>
        </div>
    )
}

export default Assessment