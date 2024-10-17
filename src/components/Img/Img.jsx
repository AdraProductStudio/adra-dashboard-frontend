import React from 'react'
import { Image } from 'react-bootstrap'

const Img = ({
    componentFrom,
    src,
    alt,
    className,
    width,
    height,
    fluid,
}) => {

    return (
        <Image
            src={src}
            className={className}
            width={width}
            height={height}
            alt={alt}
            fluid={fluid}
        />
    )
}

export default Img