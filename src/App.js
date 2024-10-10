import React from "react";
import Button from "./components/Button/Button";

const App = () => {
  const makeApiCall = () => {
    alert("Test");
  };

  return (
    <Button
      as="a"
      title="Click Here"
      variant="primary"
      rootComponent="app"
      clickFunction={makeApiCall}
    />
  );
};

export default App;
