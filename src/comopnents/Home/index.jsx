import { useNavigate } from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => {
    const navigate = useNavigate()

    const onClickStart = () => {
        navigate('/assessment')
    }

    return (
        <div className="home-page">
            <Header />

            <main className="home-container">
                <h1>Instructions</h1>

                <p>
                    This assessment contains multiple questions.
                </p>

                <ul>
                    <li>Read each question carefully.</li>
                    <li>You can navigate between questions.</li>
                    <li>The assessment duration is 10 minutes.</li>
                    <li>Submit before the timer ends.</li>
                </ul>

                <button
                    type="button"
                    onClick={onClickStart}
                    className="start-button"
                >
                    Start Assessment
                </button>
            </main>
        </div>
    )
}

export default Home