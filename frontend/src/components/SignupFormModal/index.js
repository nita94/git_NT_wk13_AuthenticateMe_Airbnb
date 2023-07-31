import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

// The SignupFormModal component is responsible for handling user sign up.
function SignupFormModal() {
  // Using useDispatch hook to dispatch actions
  const dispatch = useDispatch();
  
  // Using useState hook to create controlled inputs for the form fields
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // State to store any validation errors
  const [errors, setErrors] = useState({});
  
  // Using useModal hook to get the closeModal function
  const { closeModal } = useModal();

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      // If password and confirm password match, dispatch signup action with form input values
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          // If there are any errors, set them in the errors state
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    // If confirm password and password do not match, set an error message
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  // Rendering the signup form with controlled inputs
  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        {/* Each label and input pair represents a field on the signup form */}
        {/* Error messages are displayed next to the relevant field if there are any */}
        {/* ... */}
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
