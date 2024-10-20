import React from 'react';
import ButtonComponent from 'components/Button/Button';
import HeaderCard from 'components/Card/HeaderCard';
import Icons from 'Utils/Icons';

const Header = ({
  offcanvasOn,
  offcanvasOnButton
}) => {

  const headerContentFunc = () => {
    return <>
      <div className="col-sm-8 d-flex flex-wrap align-items-center justify-content-end">
        <div className="header-icon-tag-width">
          <ButtonComponent
            type="button"
            className={'header-icon-width'}
            buttonName= {Icons.notificationIcon}
          />
        </div>

        <div className="header-icon-tag-width">
            <ButtonComponent
              type="button"
              className={'header-icon-width'}
              buttonName={Icons.profileIcon}
            />
        </div>

        {
          offcanvasOn ?
            <div className={`d-inline-block header-icon-tag-width ${offcanvasOn !== '' ? `d-${offcanvasOn}-none` : 'd-none'}`}>
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
    </>
  }

  return (

    <HeaderCard
      cardClassName='w-100 border-0 header-card'
      cardTitleClassName="row justify-content-end mb-0"
      cardContent={headerContentFunc()}
    />

  )
}

export default Header