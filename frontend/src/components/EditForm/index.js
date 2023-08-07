import './EditForm.css'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as spotActions from '../../store/spots'
import { useHistory, useParams } from 'react-router-dom'

function EditForm() {
    const { spotId } = useParams()
    const allSpots = useSelector(state => state.spots.allSpots)
    const dispatch = useDispatch()
    const [priceError, setPriceError] = useState('')

    let spots;
    let userSpots;
    let currSpot;
    let nameErrorText;

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

    if(Object.values(allSpots).length) {
        spots = Object.values(allSpots)
        userSpots = spots[0]
        currSpot = userSpots.find(singleSpot => singleSpot.id === Number(spotId))
    }

    useEffect(() => {
        dispatch(spotActions.fetchSingleSpot(spotId))
    }, [dispatch, spotId])


    const [country, setCountry] = useState(currSpot?.country || '')
    const [streetAddress, setStreetAddress] = useState(currSpot?.address || '')
    const [city, setCity] = useState(currSpot?.city || '')
    const [addressState, setAddressState] = useState(currSpot?.state || '')
    const [latitude, setLatitude] = useState(currSpot?.lat || '')
    const [longitude, setLongitude] = useState(currSpot?.lng || '')
    const [description, setDescription] = useState(currSpot?.description || '')
    const [spotName, setSpotName] = useState(currSpot?.name || '')
    const [price, setPrice] = useState(currSpot?.price || '')
    //! TO DO LATER
    // const [previewImage, setPreviewImage] = useState(currSpot?.previewImage || '')
    // const [imgTwo, setImgTwo] = useState(singleSpot.SpotImages ? singleSpot.SpotImages[1].url : '')
    // const [imgThree, setImgThree] = useState(singleSpot.SpotImages ? singleSpot.SpotImages[1].url : '')
    // const [imgFour, setImgFour] = useState(singleSpot.SpotImages ? singleSpot.SpotImages[1].url : '')
    // const [imgFive, setImgFive] = useState(singleSpot.SpotImages ? singleSpot.SpotImages[1].url : '')
    const [errors, setErrors] = useState({})

    const sessionUser = useSelector(state => state.session.user)
    const history = useHistory()

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors({})

        if(sessionUser && currSpot !== {}) {
            if(spotName.length >= 50) {
                nameErrorText = 'Name must be less than 50 characters'
            } else {
                nameErrorText = ''
            }
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

    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     setErrors({})
    //     if(sessionUser && currSpot !== {}) {
    //         const editedSpot = {
    //             country: country,
    //             address: streetAddress,
    //             city: city,
    //             state: addressState,
    //             lat: latitude,
    //             lng: longitude,
    //             description: description,
    //             name: spotName,
    //             price: price,
    //             ownerId: sessionUser.id,
    //         }


    //         dispatch(spotActions.updateSpot(spotId, editedSpot)).then(() => {
    //             history.push(`/spots/${spotId}`)
    //         })
    //         .catch(async res => {
    //             const data = await res.json()
    //             if(data && data.errors) {
    //                 setErrors(data)
    //             }
    //         })


    //     } else {
    //         setErrors({ user: 'You must be logged in to update a spot!'})
    //     }



    // }


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
                            // required
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
                            // required
                            />
                            {errors?.errors?.state ? <p className='create-form-errors-text'>{errors?.errors?.state}</p> : ''}
                    </div>

                        </div>
                    {/* <div id='lat-lng-div'>
                        <div id='lat-lng-labels'>
                        <label id='lat-label' htmlFor='latitude'>Latitude</label>
                        <label id='lng-label' htmlFor='longitude'>Longitude</label>
                        </div>
                            <input
                            type='text'
                            name='latitude'
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            placeholder='Latitude'
                            id='lat-input'
                            />
                        <span className='comma-span'> , </span>
                        <label htmlFor='longitude'>
                        <input
                            type='text'
                            name='longitude'
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            placeholder='Longitude'
                            id='lng-input'
                            />
                        </label>
                        {errors?.errors?.lat ?  <p className='create-form-errors-text'>{errors?.errors?.lat}</p> : ''}
                        {parseInt(latitude) === 'NaN' ? <p className='create-form-errors-text'>Latitude is not valid.</p>  : ''}
                        {errors?.errors?.lng ?  <p className='create-form-errors-text'>{errors?.errors?.lng}</p> : ''}
                        {parseInt(longitude) === 'NaN' ? <p className='create-form-errors-text'>Longitude is not valid.</p> : ''}
                    </div> */}
                </div>
                <div id='form-section-two'>
                    <h2 className='form-section-header-text'>Describe your place to guests</h2>
                    <p className='form-section-desc-text'>Mention the best features of your space, any specifal amenities like fast wifi or parking, and what you love about the neighborhood.</p>
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
                    // required
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
                    // required
                    />
                    {/* {errors?.errors?.price ? <p className='create-form-errors-text'>{errors?.errors?.price}</p> : ''} */}
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