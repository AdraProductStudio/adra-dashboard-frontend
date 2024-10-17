import ButtonComponent from 'components/Button/Button';
import React from 'react'
import Card from 'react-bootstrap/Card';
import { useLocation } from 'react-router-dom';

const Header = ({
  offcanvasOn,
  offcanvasOnButton
}) => {

  const location = useLocation()

  const handleHeaderTitle = () => {
    const path = location.pathname.split('/');
    return path[path.length - 1];
  }

  return (
    <Card className='w-100 border-0'>
      <Card.Body>
        <Card.Title className='mb-0 row justify-content-evenly align-items-center'>
          <div className="col">
            {handleHeaderTitle()}
          </div>

          <div className="col text-end">
            {
              offcanvasOn ?
                <div className={`d-block ${offcanvasOn !== '' ? `d-${offcanvasOn}-none` : 'd-none'}`}>
                  <ButtonComponent
                    type="button"
                    clickFunction={offcanvasOnButton}
                    buttonName="open"
                  />
                </div>
                :
                null
            }
          </div>
        </Card.Title>
      </Card.Body>
    </Card>
  )
}

export default Header