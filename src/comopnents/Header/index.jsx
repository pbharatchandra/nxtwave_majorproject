import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useContext } from 'react'
import EvaluationContext from '../../context/EvaluationProvider'
import './index.css'
import img from 'C:/Users/pbhar/nxtwave/nxtwave_majorproject/src/assets/nxtacceesslogo.png'
const Header = () => {
    const { resetAssessment } = useContext(EvaluationContext)
    const navigate = useNavigate()

    const onClickLogo = () => {
        navigate('/', { replace: true })
    }

    const onClickLogout = () => {
        Cookies.remove('jwt_token')
        resetAssessment()
        navigate('/login', { replace: true })
    }

    return (
        <nav className="header">
            <div className="header-content">

                <img
                    src={img}
                    alt="website logo"
                    className="header-logo"
                    onClick={onClickLogo}
                />

                <button
                    type="button"
                    className="logout-button"
                    onClick={onClickLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Header