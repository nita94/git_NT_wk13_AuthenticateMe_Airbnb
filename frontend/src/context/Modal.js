import React, { useRef, useState, useContext } from 'react'
import ReactDOM from 'react-dom'
import './Modal.css'

// Define the context for the modal
const ModalContext = React.createContext()

// This is the provider component for the modal. All components within this provider will have access to the modal's context.
export function ModalProvider({ children }) {
    // This is a ref object that's going to point to the div where the modal will be rendered.
    const modalRef = useRef()
    // These are the states for the modal's content and the callback function when the modal is closed.
    const [modalContent, setModalContent] = useState(null)
    const [onModalClose, setOnModalClose] = useState(null)

    // This function is used to close the modal and optionally call a callback function.
    const closeModal = () => {
        setModalContent(null)

        if(typeof onModalClose === 'function') {
            setOnModalClose(null)
            onModalClose()
        }
    }

    // This is the value that's going to be passed down to the context.
    const contextValue = {
        modalRef,
        modalContent,
        setModalContent,
        setOnModalClose,
        closeModal,
    }

    return (
        <>
            <ModalContext.Provider value={contextValue}>
                {children} {/* Render the children inside the provider */}
            </ModalContext.Provider>
            <div ref={modalRef} /> {/* This div is where the modal will be rendered */}
        </>
    )
}

// This is the actual Modal component.
export function Modal() {
    // Get the modal's context.
    const { modalRef, modalContent, closeModal } = useContext(ModalContext)

    // Don't render the modal if there's no ref or no content.
    if(!modalRef || !modalRef.current || !modalContent) return null;

    // Render the modal in the div pointed to by the ref. When the background is clicked, the modal closes.
    return ReactDOM.createPortal(
        <div id='modal'>
            <div id='modal-background' onClick={closeModal} />
            <div id='modal-content'>{modalContent}</div>
        </div>,
        modalRef.current
    )
}

// Export a custom hook that will provide the modal context.
export const useModal = () => useContext(ModalContext)
