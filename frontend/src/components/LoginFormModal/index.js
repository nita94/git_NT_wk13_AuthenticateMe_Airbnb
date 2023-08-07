import React, { useState } from 'react'
import * as sessionActions from '../../store/session'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal.js'
import './LoginForm.css'

function LoginFormModal() {
    const dispatch = useDispatch()
    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const { closeModal } = useModal()

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors({})
        return dispatch(sessionActions.login({ credential, password }))
        .then(closeModal)
        .catch(async (res) => {
            const data = await res.json()
            if(data && data.message) {
                setErrors(data)
            }
        })
    }

    const handleDemoLogin = (e) => {
        e.preventDefault()
        return dispatch(sessionActions.login({ credential: 'authDemoUser2', password: 'password' }))
        .then(closeModal)
    }

    return (
        <>
            <div id='login-form-div'>
                <h1 id='login-text'>Log In</h1>
                <form onSubmit={handleSubmit}>
                    <div id='credential-div'>
                        <input
                            id='login-credential-input'
                            type='text'
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            required
                            placeholder='Username or Email'
                        />
                    </div>
                    <div id='password-div'>
                        <input
                            id='login-password-input'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder='Password'
                        />
                    </div>
                    {errors.message && <p id='errors-display'>{errors.message}</p>}
                    <div id='button-div'>
                        <button id='login-submit-button' type='submit' disabled={(credential.length >= 4 && password.length >= 6) ? false : true} onClick={handleSubmit}>Log In</button>
                    </div>
                </form>
                <button id='demo-user-button' onClick={handleDemoLogin}>Demo User</button>
            </div>
        </>
    )
};

export default LoginFormModal;