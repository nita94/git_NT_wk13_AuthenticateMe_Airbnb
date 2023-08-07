// Import necessary libraries and components
import { NavLink } from 'react-router-dom'  // Import NavLink for routing
import { useEffect, useState } from 'react'  // Import useEffect and useState hooks
import { useDispatch, useSelector } from 'react-redux'  // Import useDispatch and useSelector hooks
import * as spotActions from '../../store/spots'  // Import all actions from spots
import SpotCard from '../SpotCards'  // Import SpotCard component
import './ManageSpots.css'  // Import the CSS styles for the manage spots page

// Define a functional component called ManageSpots
function ManageSpots() {
    // Get the spots and user data from the Redux store
    const allSpots = useSelector(state => state.spots.allSpots)
    const sessionUser = useSelector(state => state.session.user)

    // Convert the spots from an object to an array and get the first spot
    const spots = Object.values(allSpots)
    const final = spots[0]

    // Allow for the dispatch of actions
    const dispatch = useDispatch()

    // State for tracking whether spots have been updated
    const [spotsUpdated, setSpotsUpdated] = useState(false)

    // Use an effect hook to dispatch an action to fetch user spots
    useEffect(() => {
        dispatch(spotActions.fetchUserSpots())
    }, [dispatch, spotsUpdated])  // Rerun the effect when dispatch or spotsUpdated changes

    // Render the ManageSpots component
    return (
        <div id='manage-spots-parent-container'>
            <h2 id='manage-spots-title-text'>Manage Your Spots</h2>
            <NavLink exact to='/spots/new'>
                <button id='manage-spots-create-new-button'>Create a New Spot</button>
            </NavLink>
            <div id='manage-spots-show-parent-div'>
                <div id='spot-card-show-div'>
                    {final && final.map((spot) => (
                        <div id='individual-card-manage-spots'>
                            <SpotCard spot={spot} key={spot.id} user={sessionUser} onSpotDeleted={() => setSpotsUpdated(prev => !prev)} />
                        </div>))
                    }
                </div>
            </div>
        </div>
    )
}

// Export the ManageSpots component as the default export
export default ManageSpots;
