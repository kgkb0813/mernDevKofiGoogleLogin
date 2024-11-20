import React from 'react';

const CustomAlert = ({ message }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(true); // Show the alert when the component receives a message
  }, [message]); // Update isOpen only when message changes

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    isOpen && (
      <div className="custom-alert">
        <p>{message}</p>
        <button onClick={handleClose}>Close</button>
      </div>
    )
  );
};

export default CustomAlert;