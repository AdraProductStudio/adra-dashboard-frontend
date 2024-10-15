import React from "react";
import Button from "react-bootstrap/Button";

const ButtonComponent = ({ title,
  rootComponent,
  as,
  className,
  type,
  clickFunction 
}) => {


  return (
    <Button
      as={as}
      type={type}
      className={`btn ${className}`}
      onClick={clickFunction}
    >
      {title}
    </Button>
  );
};

export default ButtonComponent;
