import React, { Fragment } from 'react';
import ButtonComponent from 'Components/Button/Button';
import HeaderCard from 'Components/Card/HeaderCard';
import Icons from 'Utils/Icons';
import { CiLogout } from 'react-icons/ci';

const Header = ({
  offcanvasOn,
  offcanvasOnButton,
  logoutClickFunction
}) => {

  const headerContentFunc = () => {
    return <Fragment>
      <div className="col-sm-8 d-flex flex-wrap align-items-center justify-content-end">
        <div>
          <ButtonComponent
            type="button"
            clickFunction={logoutClickFunction}
            className={'btn-outline-danger px-3 py-2 d-none d-xl-block'}
              buttonName={<>
              <CiLogout className='fs-4' /> Logout
            </>}
          />
        </div>

        {
          offcanvasOn ?
            <div className={`d-inline-block header-icon-tag-width ${offcanvasOn !== '' ? `d-${offcanvasOn}-none` : 'd-none'}`}>
              <ButtonComponent
                type="button"
                className="border border-secondary-subtle"
                clickFunction={offcanvasOnButton}
                buttonName={Icons?.profileDefautUserIcon}
              />
            </div>
            :
            null
        }
      </div>
    </Fragment>
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
