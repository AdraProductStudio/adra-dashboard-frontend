import Form from 'react-bootstrap/Form';

const Input = ({ 
    componentFrom,
    className,
    htmlFor,
    as,
    placeholder,
    inputHeading,
    inputError 
}) => {

    return (
        <>
            <Form.Label htmlFor={htmlFor}>{inputHeading}</Form.Label>
            <Form.Control
                type={as}
                id={htmlFor}
                placeholder={placeholder}
                className={className}
                aria-describedby={inputHeading + "Block"}
            />
            {
                inputError ?
                    <Form.Text id={inputHeading + "Block"} muted>
                        {inputError}
                    </Form.Text>
                    :
                    null
            }

        </>
    )
}

export default Input