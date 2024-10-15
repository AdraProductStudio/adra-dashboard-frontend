import React from 'react'
import Images from 'Utils/Image';
import Img from 'components/Img/Img';
import NavLinkComp from 'components/Nav/NavLink';

const Sidebar = ({
    menuOptions
}) => {

    const hanldeButton = (v) => {
        return <>
            <div className="col-3 pb-1 text-center">
                {v.icon}
            </div>
            <div className="col text-start">
                <p className='mb-0'>{v.name}</p>
            </div>
        </>
    }

    return (
        <div className="sidebar">
            <div className="container-fluid">
                {/* header */}
                <div className="sidebar-header">
                    <div className="row h-100 align-items-center justify-content-center">
                        <div className="col text-center">
                            <Img
                                src={Images.CompanyLogo}
                                alt='company logo'
                                width='70px'
                                height='70px'
                            />
                        </div>
                    </div>
                </div>
                <hr className='border-secondary' />


                {/* body */}
                <div className="sidebar-body">
                    {
                        menuOptions.map((v, i) => (
                            <React.Fragment key={i}>
                                <NavLinkComp
                                    as="div"
                                    type="button"
                                    className='w-100 btn-dark d-flex flex-wrap align-items-center mb-2 navlink-sidebar rounded p-2 text-decoration-none text-secondary'
                                    title={hanldeButton(v)}
                                    to={v.route}
                                />
                            </React.Fragment>
                        ))
                    }
                </div>


                {/* footer */}
                {/* <div className="sidebar-footer ">
                    hi
                </div> */}
            </div>
        </div>
    )
}

export default Sidebar