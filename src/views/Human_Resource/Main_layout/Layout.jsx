import React, { useState } from 'react';
import Header from 'components/Panel_compnent/Header';
import Sidebar from 'components/Panel_compnent/Sidebar';
import Images from 'Utils/Image';
import Icons from 'Utils/Icons';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const [offCanvasShow, setoffCanvasShow] = useState(false)
    const handleCanvasOpenOrClose = () => setoffCanvasShow(!offCanvasShow)
    const menuOptions = [
        {
            icon: Icons.dashboardIcon,
            name: "Dashboard",
            route: "/"
        },
        {
            icon: Icons.employeeIcon,
            name: "Employees",
            route: "/employees"
        },
        {
            icon: Icons.attendancecardIcon,
            name: "Attendance",
            route: "/attendance"
        },
        {
            icon: Icons.payrollIcon,
            name: "Payroll",
            route: "/payroll"
        },
        {
            icon: Icons.calenderIcon,
            name: "Interview",
            route: "/interview"
        },
        {
            icon: Icons.circularIcon,
            name: "Circular",
            route: "/circular"
        },
        {
            icon: Icons.invoiceIcon,
            name: "Invoices",
            route: "/invoices"
        },
        {
            icon: Icons.notesIcon,
            name: "Notes",
            route: "/notes"
        },
        {
            icon: Icons.documentsIcon,
            name: "Documents",
            route: "/documents"
        }
    ]

    return (
        <div className="d-flex flex-wrap">
            {/* sidebar  */}
            <Sidebar
                responsiveOn={"xl"}
                offCanvasShow={offCanvasShow}
                handleCanvasOpenOrClose={handleCanvasOpenOrClose}
                menuOptions={menuOptions}
                header={true}
                companyLogo={Images.CompanyLogo}
            />

            <div className="col">
                <main className="main w-100">
                    <div className="container-fluid">
                        {/* header  */}
                        <header className='d-flex align-items-center'>
                            <Header
                                offcanvasOn={"xl"}
                                offcanvasOnButton={handleCanvasOpenOrClose}
                            />
                        </header>

                        {/* main content  */}
                        <div className="hr_main_rendering_contents_height">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout