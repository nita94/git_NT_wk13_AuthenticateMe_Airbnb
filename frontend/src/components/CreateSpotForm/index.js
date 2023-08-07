import './CreateSpotForm.css'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as spotActions from '../../store/spots'
import * as spotImgActions from '../../store/spotimages'
import { useHistory } from 'react-router-dom'

function CreateSpotForm() {
    const [country, setCountry] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [city, setCity] = useState('')
    const [addressState, setAddressState] = useState('')
    // const [latitude, setLatitude] = useState('')
    // const [longitude, setLongitude] = useState('')
    const [description, setDescription] = useState('')
    const [spotName, setSpotName] = useState('')
    const [price, setPrice] = useState('')
    const [previewImage, setPreviewImage] = useState('')
    const [imgTwo, setImgTwo] = useState('')
    const [imgThree, setImgThree] = useState('')
    const [imgFour, setImgFour] = useState('')
    const [imgFive, setImgFive] = useState('')
    const [errors, setErrors] = useState({})
    const [priceError, setPriceError] = useState('')

    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const history = useHistory()

    const reset = () => {
        setCountry('')
        setStreetAddress('')
        setCity('')
        setAddressState('')
        // setLatitude('')
        // setLongitude('')
        setDescription('')
        setSpotName('')
        setPrice('')
        setPreviewImage('')
        setImgTwo('')
        setImgThree('')
        setImgFour('')
        setImgFive('')
        setErrors({})
        setPriceError('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors({})

        const spotImgs = []
        spotImgs.push({ url: previewImage, preview: true })

        if(imgTwo.length > 1) {
            spotImgs.push({ url: imgTwo, preview: false })
        }

        if(imgThree.length > 1) {
            spotImgs.push({ url: imgThree, preview: false })
        }

        if(imgFour.length > 1) {
            spotImgs.push({ url: imgFour, preview: false })
        }

        if(imgFive.length > 1) {
            spotImgs.push({ url: imgFive, preview: false })
        }

        let spotId

        if(sessionUser) {
            const newSpot = {
                country: country,
                address: streetAddress,
                city: city,
                state: addressState,
                // lat: latitude,
                // lng: longitude,
                description: description,
                name: spotName,
                price: price,
                ownerId: sessionUser.id,
                // previewImage: previewImage
            }


            // const spotImgs = [{ url: previewImage, preview: true }]


            dispatch(spotActions.createNewSpot(newSpot)).then( async res => {
                spotId = res.id
                spotImgs.forEach(img => dispatch(spotImgActions.createNewImage(spotId, img)))
                reset()
                return history.push(`/spots/${spotId}`)
            })
            .catch(async res => {
                const data = await res.json()
                if(data && data.errors) {
                        setErrors(data)
                }
            })

        } else {
            setErrors({ user: 'You must be logged in to create a new spot!'})
        }



    }


    return (
        <div id='create-spot-form-parent-div'>
            <h1 className='form-title-text'>Create a new Spot</h1>
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
                    <div id='city-and-state-parent-div'>
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
                    {/* {description.length < 30 ? <p>Please write at least 30 characters.</p> : ''} */}
                    {/* {descriptionError} */}
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
                    {errors?.errors?.price ? <p className='create-form-errors-text'>{errors?.errors?.price}</p> : ''}
                    {priceError}
                </div>
                <div id='form-section-five'>
                    <h2 className='form-section-header-text'>Liven up your spot with photos</h2>
                    <p className='form-section-desc-text'>Submit a link to at least one photo to publish your spot.</p>
                    <div id='section-five-photo-inputs'>
                        <div>
                            <input
                            type='url'
                            placeholder='Preview Image URL'
                            name='prev-img'
                            value={previewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}
                            className='form-preview-img-input'
                            // required
                            />
                        </div>
                        <div>
                            <input
                            type='url'
                            placeholder='Image URL'
                            name='img-two'
                            value={imgTwo}
                            onChange={(e) => setImgTwo(e.target.value)}
                            className='form-img-input'
                            />
                        </div>
                        <div>
                            <input
                            type='url'
                            placeholder='Image URL'
                            name='img-three'
                            value={imgThree}
                            onChange={(e) => setImgThree(e.target.value)}
                            className='form-img-input'
                            />
                        </div>
                        <div>
                            <input
                            type='url'
                            placeholder='Image URL'
                            name='img-four'
                            value={imgFour}
                            onChange={(e) => setImgFour(e.target.value)}
                            className='form-img-input'
                            />
                        </div>
                        <div>
                            <input
                            type='url'
                            placeholder='Image URL'
                            name='img-five'
                            value={imgFive}
                            onChange={(e) => setImgFive(e.target.value)}
                            className='form-img-input'
                            id='final-img-input'
                            />
                        </div>
                    </div>
                </div>
                {/* <button disabled={(country.length > 0 && streetAddress.length > 0 && city.length > 0 && addressState.length > 0 && description.length > 0 && spotName.length > 0 && price.length > 0 && previewImage.length > 0) ? false : true} id='new-spot-form-submit-button' type='submit'>Create Spot</button> */}
                <button id='new-spot-form-submit-button' type='submit'>Create Spot</button>
            </form>
        </div>
    )
}

export default CreateSpotForm;