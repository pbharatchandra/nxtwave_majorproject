import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import Header from '../Header'
import EvaluationContext from '../../context/EvaluationProvider'
import img from "https://github.com/pbharatchandra/nxtwave_majorproject-/blob/3ad6ca0f3087b6177e1b63887d9a9e523a523263/src/assets/nxtacceesslogo_removebg.png"
import './index.css'

const Results = () => {
    const navigate = useNavigate()

    const {
        score,
        questions,
        timeTaken,
        resetAssessment,
    } = useContext(EvaluationContext)

    const minutes = Math.floor(timeTaken / 60)
    const seconds = timeTaken % 60

    const formattedTime = `${String(minutes).padStart(
        2,
        '0',
    )}:${String(seconds).padStart(2, '0')}`

    const onClickReattempt = () => {
        resetAssessment()
        navigate('/assessment', { replace: true })
    }

    return (
        <div className="results-page">
            <Header />

            <div className="results-container">
                <img
                    src={img}
                    alt="submit"
                    className="results-image"
                />

                <h1>Congrats! You completed the assessment.</h1>

                <p className="time-taken">
                    Time Taken: {formattedTime}
                </p>

                <p className="score-text">
                    Your Score: {score}/{questions.length}
                </p>

                <button
                    type="button"
                    className="reattempt-button"
                    onClick={onClickReattempt}
                >
                    Reattempt
                </button>
            </div>
        </div>
    )
}

export default Results