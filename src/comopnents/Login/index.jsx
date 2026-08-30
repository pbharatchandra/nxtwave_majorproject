import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import img from '../../assets/nxtacceesslogo_removebg.png'

import './index.css'

const Login = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [showError, setShowError] = useState(false)

    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
        return <Navigate to="/" replace />
    }

    const onSubmitForm = async event => {
        event.preventDefault()

        const userDetails = {
            username,
            password,
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userDetails),
        }

        try {
            const response = await fetch('/api/login', options)
            const data = await response.json()

            if (response.ok) {
                Cookies.set('jwt_token', data.jwt_token, {
                    expires: 30,
                })

                navigate('/', { replace: true })
            } else {
                setShowError(true)
                setErrorMessage(data.error_msg)
            }
        } catch (error) {
            setShowError(true)
            setErrorMessage('Something went wrong. Please try again.')
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <img
                    src={img}
                    alt="login website logo"
                    className="login-logo"
                />

                <form onSubmit={onSubmitForm} className="login-form">
                    <div className="input-container">
                        <label htmlFor="username">USERNAME</label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={event => setUsername(event.target.value)}
                            placeholder="Enter Username"
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="password">PASSWORD</label>

                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            placeholder="Enter Password"
                        />
                    </div>

                    <div className="checkbox-container">
                        <input
                            id="showPassword"
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(prevState => !prevState)}
                        />

                        <label htmlFor="showPassword">Show Password</label>
                    </div>

                    <button type="submit" className="login-button">
                        Login
                    </button>

                    {showError && (
                        <p className="error-message">
                            {errorMessage}
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Login