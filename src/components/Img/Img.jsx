import React from 'react'
import { Image } from 'react-bootstrap'

const Img = ({
    rootComponent,
    src,
    alt,
    className,
    width,
    height
}) => {

    return (
        <Image
            src={src}
            className={className}
            width={width}
            height={height}
            alt={alt}
            fluid
        />
    )
}

export default Img