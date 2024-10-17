import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'components/Input/InputGroup';
import ButtonComponent from 'components/Button/Button';

const LoginForm = () => {
    const [validated, setValidated] = useState(false);
    const [eyeState, setEyeState] = useState(true);
    const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' })

    const handleSubmit = () => {
        setValidated(true);
    };
    
    return (
        <Form noValidate validated={validated} >
            <Row className="mb-3">
                <InputGroup
                    controlId="validationLoginUsername"
                    gropuClassName="col-12 py-2"
                    inputHeading="Username"
                    inputType="text"
                    placeholder="Username"
                    inputError={"Username required"}
                    inputSuccess={"Looks good"}
                    change={(e) => {
                        setLoginCredentials({ ...loginCredentials, username: e.target.value })
                        setValidated(false)
                    }}
                />

                <InputGroup
                    controlId="validationLoginPassword"
                    gropuClassName="col-12 py-2"
                    inputHeading="Password"
                    inputType="password"
                    placeholder="Password"
                    inputError={"Password required"}
                    inputSuccess={"Looks good"}
                    change={(e) => {
                        setLoginCredentials({ ...loginCredentials, password: e.target.value })
                        setValidated(false)
                    }}
                    eyeState={eyeState}
                    eyeFunctionClick={()=>{
                        setEyeState(!eyeState)
                    }}
                />
            </Row>

            <Form.Group className="mb-3">
                <Form.Check
                    required
                    label="Agree to terms and conditions"
                    feedback="You must agree before submitting."
                    feedbackType="invalid"
                />
            </Form.Group>

            <ButtonComponent
                type="button"
                className="btn-md w-100"
                clickFunction={handleSubmit}
                title="Submit form"
                buttonName="Submit form"
            />
        </Form>
    )
}

export default LoginForm