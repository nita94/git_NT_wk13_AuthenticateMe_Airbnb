import Calendar from 'react-calendar'
import { useState, useRef } from 'react'
import './Booking.css'
// import OpenModalButton from '../OpenModalButton'

function Booking() {
    const [showCalMenuOne, setShowCalMenuOne] = useState(false)
    const [showCalMenuTwo, setShowCalMenuTwo] = useState(false)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())

    const ulRef = useRef()


    const calendarClassName = "calendar-dropdown" + (showCalMenuOne ? "" : "-hidden")

    const openMenuOne = () => {
        if(showCalMenuOne) return setShowCalMenuOne(false);
        return setShowCalMenuOne(true)
    }

    const openMenuTwo = () => {
        if(showCalMenuTwo) return setShowCalMenuTwo(false);
        return setShowCalMenuTwo(true)
    }

    // useEffect(() => {
    //     if(!showCalMenuOne || !showCalMenuTwo) return
    //     const closeMenu = (e) => {
    //         if(!ulRef.current.contains(e.target)) {
    //             setShowCalMenuOne(false)
    //             setShowCalMenuTwo(false)
    //         }
    //     }
    //     document.addEventListener('click', closeMenu)

    //     return () => document.removeEventListener('click', closeMenu)
    // }, [showCalMenuOne, showCalMenuTwo])

    return(
        <div id='booking-component-parent-div'>
            <div id='booking-reserve-buttons-parent'>
                <div id='top-row-button-div'>
                    {/* <button className={calendarClassName} onClick={() => setShowCalMenuOne === false ? setShowCalMenuOne(false) : setShowCalMenuOne(true)}>Check-In: {startDate.toDateString()} </button> */}
                    <button className={calendarClassName} id='start-date-calendar-button' onClick={openMenuOne}><span id='check-in-text-span'>Check-In:</span> <p id='check-in-p-tag'>{startDate.toDateString()}</p> </button>

                    <button className={calendarClassName} id='end-date-calendar-button' onClick={openMenuTwo}><span id='check-out-text-span'>Check-Out:</span> <p id='check-out-p-tag'>{endDate.toDateString()}</p> </button>
                </div>
                <div id='bottom-row-button-div'>
                    <label htmlFor='guests' id='guests-input-label'>Guests</label>
                    <select id='guests-num-select' name='guests'>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                    </select>
                </div>
                <div id='calendar-menu-dropdown-div' ref={ulRef}>
                    <div id='calendar-menu-dropdown-one'>
                {showCalMenuOne && <Calendar onChange={setStartDate} value={startDate} />}

                    </div>
                    <div id='calendar-menu-dropdown-two'>
                {showCalMenuTwo && <Calendar onChange={setEndDate} value={endDate}/>}

                    </div>
                </div>
                <div id='confirm-or-cancel-booking'>
                    <button id='confirm-booking-button'>Confirm Booking</button>
                    <button id='cancel-booking-button'>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default Booking;