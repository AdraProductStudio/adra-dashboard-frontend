import React from 'react'
import Form from 'react-bootstrap/Form';
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";

const InputGroup = ({
    componentFrom,
    inputType,
    inputControlId,
    className,
    change,
    gropuClassName,
    placeholder,
    value,
    inputHeading,
    inputError,
    inputSuccess,
    eyeState,
    eyeFunctionClick,
    inputId,
    inputAccept,
    inputHidden,
    inputPattern
}) => {

    return (
        <Form.Group className={
            inputType === "password" ?
                `position-relative ${gropuClassName ? gropuClassName : ''}`
                :
                gropuClassName
        } controlId={inputControlId}>
            <Form.Label>{inputHeading}</Form.Label>
            <Form.Control
                required
                className={className}
                type={
                    inputType === "password" ?
                        eyeState ? "password" : "text"
                        :
                        inputType
                }
                placeholder={placeholder}
                value={value}
                name={inputHeading}
                onChange={change}
                id={inputId}
                accept={inputAccept}
                hidden={inputHidden}
                pattern={inputPattern}
            />
            <Form.Control.Feedback type="valid">
                {inputSuccess}
            </Form.Control.Feedback>

            <Form.Control.Feedback type="invalid">
                {inputError}
            </Form.Control.Feedback>
            {
                inputType === "password" ?
                    eyeState ?
                        <IoEyeOutline className='fs-4 eye-absolute' onClick={eyeFunctionClick} />
                        :
                        <IoEyeOffOutline className='fs-4 eye-absolute' onClick={eyeFunctionClick} />
                    :
                    null
            }
        </Form.Group>
    )
}

export default InputGroup