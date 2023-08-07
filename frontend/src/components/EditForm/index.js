import './EditForm.css'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as spotActions from '../../store/spots'
import { useHistory, useParams } from 'react-router-dom'

function EditForm() {
    const { spotId } = useParams() // Get the spot id from URL params
    const allSpots = useSelector(state => state.spots.allSpots) // Get all spots from redux store
    const dispatch = useDispatch() // Initialize dispatch for redux
    const [priceError, setPriceError] = useState('') // State for price error

    // Variables declaration
    let spots, userSpots, currSpot, nameErrorText;

    // Function to reset form fields
    const reset = () => {
        setCountry('')
        setStreetAddress('')
        setCity('')
        setAddressState('')
        setLatitude('')
        setLongitude('')
        setDescription('')
        setSpotName('')
        setPrice('')
        setErrors({})
        setPriceError('')
    }

    // Extracting the current spot from all spots
    if(Object.values(allSpots).length) {
        spots = Object.values(allSpots)
        userSpots = spots[0]
        currSpot = userSpots.find(singleSpot => singleSpot.id === Number(spotId))
    }

    // Fetching the single spot on component mount
    useEffect(() => {
        dispatch(spotActions.fetchSingleSpot(spotId))
    }, [dispatch, spotId])

    // States for form fields, initialized with current spot data or empty string
    const [country, setCountry] = useState(currSpot?.country || '')
    const [streetAddress, setStreetAddress] = useState(currSpot?.address || '')
    const [city, setCity] = useState(currSpot?.city || '')
    const [addressState, setAddressState] = useState(currSpot?.state || '')
    const [latitude, setLatitude] = useState(currSpot?.lat || '')
    const [longitude, setLongitude] = useState(currSpot?.lng || '')
    const [description, setDescription] = useState(currSpot?.description || '')
    const [spotName, setSpotName] = useState(currSpot?.name || '')
    const [price, setPrice] = useState(currSpot?.price || '')
 
    const [errors, setErrors] = useState({}) // State for errors

    const sessionUser = useSelector(state => state.session.user) // Get the current user from redux store
    const history = useHistory() // Initialize history for navigation

    // Handler for form submission
    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors({})

        if(sessionUser && currSpot !== {}) {
            if(spotName.length >= 50) {
                nameErrorText = 'Name must be less than 50 characters'
            } else {
                nameErrorText = ''
            }
            // Creating the updated spot object
            const editedSpot = {
                country: country,
                address: streetAddress,
                city: city,
                state: addressState,
                lat: latitude,
                lng: longitude,
                description: description,
                name: spotName,
                price: price,
                ownerId: sessionUser.id
            }

            // Dispatching the updateSpot action, resetting the form and navigating to the spot page
            // If there are errors, they are set in the state
            dispatch(spotActions.updateSpot(spotId, editedSpot)).then(() => {
                reset()
                history.push(`/spots/${spotId}`)
            })
            .catch(async res => {
                const data = await res.json()
                if(data && data.errors) {
                    setErrors(data)
                }
            })

        } else {
            setErrors({ user: 'You must be logged in to update a spot!'})
        }
    }

    // The form JSX returned by the component
    // It includes inputs for different spot properties and a submit button
    // Also includes error messages if any

    return (
        <div id='create-spot-form-parent-div'>
            <h1 className='form-title-text'>Update your Spot</h1>
            <h2 className='form-section-header-text'>Where's your place located?</h2>
            <p className='form-section-desc-text'>Guests will only get your exact address once they book a reservation.</p>
            <form id='create-new-spot-form' onSubmit={handleSubmit}>
                <div id='form-section-one'>
                    <div id='section-one-country'>
                        <label id='country-label' htmlFor='country'>Country</label>
                    </div>
                    <div>
                        <input
                        type='text'
                        name='country'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder='Country'
                        id='form-country-input'
                        />
                    {errors?.errors?.country ? <p className='create-form-errors-text'>{errors?.errors?.country}</p> : ''}
                    </div>
                    <div id='section-one-streetAddress'>
                        <label htmlFor='street-address'>Street Address</label>
                    </div>
                    <div>
                        <input
                        type='text'
                        name='street-address'
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder='Address'
                        id='form-street-address-input'
                        />
                        {errors?.errors?.address ? <p className='create-form-errors-text'>{errors?.errors?.address}</p> : ''}
                    </div>
                    <div>
                        <div id='city-state-labels'>
                        <label id='city-label' htmlFor='city'>City</label>
                        <label id='state-label' htmlFor='state'>State</label>
                        </div>
                        <div id='city-state-div'>
                            <input
                            type='text'
                            name='city'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder='City'
                            id='city-input'
                            />
                            {errors?.errors?.city ? <p className='create-form-errors-text'>{errors?.errors?.city}</p> : ''}
                        <span className='comma-span'> , </span>
                        <input
                            type='text'
                            name='state'
                            value={addressState}
                            onChange={(e) => setAddressState(e.target.value)}
                            placeholder='STATE'
                            id='state-input'
                            />
                            {errors?.errors?.state ? <p className='create-form-errors-text'>{errors?.errors?.state}</p> : ''}
                        </div>
                    </div>
                </div>
                <div id='form-section-two'>
                    <h2 className='form-section-header-text'>Describe your place to guests</h2>
                    <p className='form-section-desc-text'>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <input
                    type='textarea'
                    placeholder='Please write at least 30 characters'
                    name='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id='form-description-input'
                    />
                    {errors?.errors?.description ? <p className='create-form-errors-text'>{errors?.errors?.description}</p> : ''}
                </div>
                <div id='form-section-three'>
                    <h2 className='form-section-header-text'>Create a title for your spot</h2>
                    <p className='form-section-desc-text'>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <input
                    type='text'
                    placeholder='Name of your spot'
                    name='name'
                    value={spotName}
                    onChange={(e) => setSpotName(e.target.value)}
                    id='spot-name-input'
                    />
                    {nameErrorText}
                    {errors?.errors?.name ? <p className='create-form-errors-text'>{errors?.errors?.name}</p> : ''}
                </div>
                <div id='form-section-four'>
                    <h2 className='form-section-header-text'>Set a base price for your spot</h2>
                    <p className='form-section-desc-text'>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    $ <input
                    type='text'
                    placeholder='Price per night (USD)'
                    name='price'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    id='spot-price-input'
                    />
                    {errors?.errors?.price ? <p className='create-form-errors-text'>{errors?.errors?.price}</p> : ''}
                    {priceError}
                </div>
                <button disabled={(country.length > 0 && streetAddress.length > 0 && city.length > 0 && addressState.length > 0 && description.length > 0 && spotName.length > 0 && price.length > 0) ? false : true} id='new-spot-form-submit-button' type='submit'>Update Your Spot</button>
                {errors.user && <p>{errors.user}</p>}
            </form>
        </div>
    )
}

export default EditForm;
