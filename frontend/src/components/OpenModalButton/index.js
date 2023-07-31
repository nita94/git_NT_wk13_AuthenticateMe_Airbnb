// When the button is clicked, it should:

// Invoke onButtonClick if onButtonClick is a function
// Invoke setOnModalClose with onModalClose only if onModalClose is a function
// Open the modal with the modalComponent as the content of the modal by invoking setModalContent with modalComponent
import React from "react";
import { useModal } from "../../context/Modal";

// you can use the OpenModalButton component for many different use cases! You can use it to render buttons trigger the login and sign up forms as modals, but you could use it anywhere in your application where you want to trigger a modal to open by the click of a button!

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (typeof onButtonClick === "function") onButtonClick();
    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;