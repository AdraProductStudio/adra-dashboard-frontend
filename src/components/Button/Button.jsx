import React from "react";
import Button from "react-bootstrap/Button";

const ButtonComponent = ({title, variant, as, rootComponent, clickFunction}) => {  
  return (
    <Button as={as} variant={variant} rootComponent={rootComponent} onClick={clickFunction}>
      {title}
    </Button>
  );
};

export default ButtonComponent;
