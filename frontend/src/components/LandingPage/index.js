import * as spotActions from '../../store/spots.js'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './LandingPage.css'
import SpotCard from '../SpotCards/index.js'

function LandingPage() {
    const dispatch = useDispatch()
    const allSpots = useSelector(state => state.spots.allSpots)

    const spots = Object.values(allSpots)
    const final = spots[0]


    useEffect(() => {
        dispatch(spotActions.fetchSpots())
    }, [dispatch])

    return (
        <div id='landing-page-parent-div'>
            <div id='spot-card-show-div'>
                {final && final.map((spot) => (<SpotCard spot={spot} key={spot.id} />))}
            </div>
        </div>
    )
}

export default LandingPage;