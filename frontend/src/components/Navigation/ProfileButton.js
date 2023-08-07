import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import * as sessionActions from '../../store/session'
import OpenModalButton from '../OpenModalButton'
import LoginFormModal from '../LoginFormModal'
import SignupFormModal from '../SignupFormModal'
import './ProfileButton.css'
import { NavLink, useHistory } from 'react-router-dom'
import Hamburger from './Hamburger'

function ProfileButton({ user }) {
    const dispatch = useDispatch()
    const [showMenu, setShowMenu] = useState(false)
    const ulRef = useRef()
    const history = useHistory()

    const openMenu = () => {
        if(showMenu) return;
        setShowMenu(true)
    }

    useEffect(() => {
        if(!showMenu) return
        const closeMenu = (e) => {
            if(!ulRef.current.contains(e.target)) {
                setShowMenu(false)
            }
        }
        document.addEventListener('click', closeMenu)

        return () => document.removeEventListener('click', closeMenu)
    }, [showMenu])

    const logout = (e) => {
        e.preventDefault()
        dispatch(sessionActions.logout())
        history.push('/')
    }

    const ulClassName = "profile-dropdown" + (showMenu ? "" : "-hidden")

    return (
        <div>
            <button onClick={openMenu} className='profile-icon-button'>
            <div className='hamburger-div'>
                        <Hamburger />
                <i className="fa-solid fa-circle-user fa-xl" style={{color: "#000000"}}></i>
            </div>
            </button>
            <ul className={ulClassName} ref={ulRef}>
                {user ? (
                    <>
                    <div className='dropdown-menu-list'>
                        <li className='user-profile-info' id='user-name-info'>Hello, {user.firstName}</li>
                        <li className='user-profile-info' id='user-username-info'>{user.username}</li>
                        <li className='user-profile-info' id='user-email-info'>{user.email}</li>
                        <li className='user-profile-info' id='user-manage-spots'>
                            <div id='manage-spots-div'>
                                <NavLink to='/spots/current'>
                                    <button className='manage-spots-button'>
                                        Manage Spots
                                    </button>

                                </NavLink>
                            </div>
                        </li>
                        <li>
                            <div id='logout-div'>
                                <NavLink exact to='/spots/current'>
                                    <button className='logout-profile-button' onClick={logout}>Log Out</button>
                                </NavLink>
                            </div>
                        </li>
                    </div>
                    </>
                ) : (
                    <>
                        <li>
                            <OpenModalButton
                                buttonText="Log In"
                                modalComponent={<LoginFormModal />}
                            />
                        </li>
                        <li>
                            <OpenModalButton
                                buttonText="Sign Up"
                                modalComponent={<SignupFormModal />}
                            />
                        </li>
                    </>
                )}
            </ul>
        </div>
    )

}

export default ProfileButton;