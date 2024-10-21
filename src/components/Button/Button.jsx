import React from "react";
import Button from "react-bootstrap/Button";

const ButtonComponent = ({ 
  componentFrom,
  title,
  buttonName,
  as,
  className,
  type,
  clickFunction,
  btnDisable
}) => {


  return (
    <Button
      as={as}
      type={type}
      className={className}
      onClick={clickFunction}
      title={title}
      disabled={btnDisable}
    >
      {buttonName}
    </Button>
  );
};

export default ButtonComponent;
