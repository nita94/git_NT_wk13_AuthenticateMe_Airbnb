import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProfileButton from './ProfileButton'
import './Navigation.css'
// import Hamburger from './Hamburger'

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user)

    let createSpotButton;

    if(sessionUser) {
        createSpotButton = (
        <div id={`create-spot-button-div`}>
            <NavLink to='/spots/new'>
                <button id='create-new-spot-button'>Create a New Spot</button>
            </NavLink>
        </div>
        )

    } else {
        createSpotButton = (<></>)
    }

    return (
        <div id='parent-nav-div'>
            <div id='logo-div'>
                <NavLink exact to='/'><img id='logo-img' src="https://thumbs.dreamstime.com/b/chainlink-flat-icon-white-background-chainlink-flat-icon-white-background-202544946.jpg" alt="logo" border="0"/></NavLink>
                <NavLink exact to='/'>
                    <h1 id='logo-text'>N-airbnb</h1>
                </NavLink>
            </div>

            {isLoaded && (
                <>
                {createSpotButton}
                <div id='left-half-nav'>
                <div className='nav-container' >
                    {/* <div className='hamburger-div'>
                        <Hamburger />
                    </div> */}
                    <div className='profile-button-div'>
                        <ProfileButton user={sessionUser}/>
                    </div>
                </div>
                </div>

                </>
            )}
        </div>
    )
}

export default Navigation;