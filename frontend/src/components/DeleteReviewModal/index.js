import './DeleteReviewModal.css'
import React from 'react'
import * as reviewActions from '../../store/reviews'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal.js'

function DeleteReviewModal({ review }) {
    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const handleDelete = (e) => {
        e.preventDefault()
        return dispatch(reviewActions.deleteUserReview(review.id, review)).then(closeModal)
    }

    return (
        <div id='confirm-delete-modal-parent'>
            <div id='confirm-delete-review-modal-text'>
                <h1 id='confirm-delete-title-text'>
                    Confirm Delete
                </h1>
                <p id='confirm-delete-p-text'>
                    Are you sure you want to delete this review?
                </p>
            </div>
            <div id='delete-spot-yes-button-div'>
                <button id='delete-review-confirm-yes-button' onClick={handleDelete}>
                    Yes (Delete Review)
                </button>
            </div>
            <div id='delete-spot-no-button-div'>
                <button id='delete-review-no-button-div' onClick={closeModal}>
                    No (Keep Review)
                </button>
            </div>
        </div>
    )
}

export default DeleteReviewModal;