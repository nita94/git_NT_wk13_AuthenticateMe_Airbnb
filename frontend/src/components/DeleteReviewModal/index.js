// Importing CSS for the DeleteReviewModal component
import './DeleteReviewModal.css';
// Importing React library
import React from 'react';
// Importing review actions from the review store
import * as reviewActions from '../../store/reviews';
// Importing useDispatch hook from react-redux for dispatching actions
import { useDispatch } from 'react-redux';
// Importing useModal custom hook from context for handling modal operations
import { useModal } from '../../context/Modal.js';

// Defining the DeleteReviewModal functional component
// It receives review and props as arguments
function DeleteReviewModal({ review, props }) {
    // Dispatch function from useDispatch hook for dispatching actions
    const dispatch = useDispatch();
    // closeModal function from useModal custom hook for closing the modal
    const { closeModal } = useModal();

    // Handler for delete operation
    const handleDelete = (e) => {
        // Preventing default form submission
        e.preventDefault()
        // Dispatching deleteUserReview action with review id and review as arguments
        // After the action is dispatched, it closes the modal and if onReviewDeleted function exists in props, it calls that function
        return dispatch(reviewActions.deleteUserReview(review.id, review)).then(() => { closeModal(); if (props.onReviewDeleted) props.onReviewDeleted(); })
    }

    // The JSX returned by the component
    // It includes a confirmation message and two buttons: one for confirming the deletion and the other for cancelling it
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

// Exporting DeleteReviewModal as a default export
export default DeleteReviewModal;
