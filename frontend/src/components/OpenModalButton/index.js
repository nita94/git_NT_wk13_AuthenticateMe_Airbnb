import React from 'react'
import { useModal } from '../../context/Modal.js'
import './OpenModalButton.css'

function OpenModalButton({
    modalComponent,
    buttonText,
    onButtonClick,
    onModalClose
}) {
    const { setModalContent, setOnModalClose } = useModal()

    const onClick = () => {
        if(typeof onButtonClick === 'function') onButtonClick()
        if(typeof onModalClose === 'function') setOnModalClose(onModalClose)
        setModalContent(modalComponent)
    }

    return <button className='modal-buttons' onClick={onClick}>{buttonText}</button>
}

export default OpenModalButton;