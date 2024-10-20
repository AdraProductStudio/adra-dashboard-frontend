import React from 'react';
import Card from 'react-bootstrap/Card';

const HeaderCard = ({
    componentFrom,
    cardClassName,
    cardTitleClassName,
    cardContent
}) => {

    return (
        <Card className={cardClassName}>
            <Card.Body>
                <Card.Title className={cardTitleClassName}>
                    {cardContent}
                </Card.Title>
            </Card.Body>
        </Card>
    )
}

export default HeaderCard