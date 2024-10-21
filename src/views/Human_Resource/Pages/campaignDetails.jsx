import React, { Fragment, useState } from 'react'
import JsonData from 'Utils/JsonData'
import ButtonComponent from 'components/Button/Button'
import Img from 'components/Img/Img'
import InputGroup from 'components/Input/InputGroup'
import ModalComponent from 'components/Modal/Modal'
import Icons from 'Utils/Icons'
import Image from 'Utils/Image'
import { Form, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import OffCanvas from 'components/Offcanvas/OffCanvas'
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import MetaData from 'components/Helmet/MetaData'




const CampaignDetails = () => {
    const campaignDetailsSlice = useSelector((state) => state.campaignStates);
    const form_data = JsonData().createCandidateData;

    const buttonDataOne = [
        { title: "Create Manual", setModalType: "manual", icon: Icons.pulsIconBlack, name: 'Create Manual', className: "btn-brand-outerLayer-color me-3" },
        { title: "Upload CSV File", setModalType: "csv", icon: Icons.uploadIcon, name: 'Upload CSV File', className: "btn-brand-color create-button-size" },
    ]


    const [offCanvasShow, setoffCanvasShow] = useState(false);
    const handleCanvasOpenOrClose = () => setoffCanvasShow(!offCanvasShow);


    const candidateDetails = [
        {
            name: "Prakash",
            email: "prakash@gmail.com",
            phone: "9874563210",
            education: "B.E MEchanical",
            location: "Coimbatore",
            currentRole: "Backend Developer",
        },
        {
            name: "Marshal",
            email: "marshal@gmail.com",
            phone: "4578458965",
            education: "B.E Computer Science",
            location: "Chennai",
            currentRole: "Full Stack Developer",
        },
        {
            name: "Krishna Kumar",
            email: "krishna@gmail.com",
            phone: "8787458685",
            education: "B.E Information Technology",
            location: "Madurai",
            currentRole: "Front End Developer",
        },
        {
            name: "Anbhu",
            email: "anbu@gmail.com",
            phone: "7485547854",
            education: "B.E Electronics",
            location: "Erode",
            currentRole: "Backend Developer",
        },
        {
            name: "Rajan",
            email: "rajan@gmail.com",
            phone: "7458658475",
            education: "B.E Computer Science",
            location: "Salem",
            currentRole: "UI/UX Designer",
        },
    ];


    const campaignDetailedData = [];
    const [modalShow, setModalShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [modalType, setModalType] = useState('');
    const [csvFile, SetCsvFile] = useState(null);
    const handleModel = () => setModalShow(!modalShow);

    const [createCandidate, setCreateCandidate] = useState({
        full_name: '',
        mail_id: '',
        mobile_number: '',
        education: '',
        location: '',
        current_role: ''
    })
    const handleShow = (type) => {
        setModalType(type);
        setModalShow(true);
    };

    const handleOnchange = (event) => {
        if (event.target.name === "Full Name") {
            setCreateCandidate({ ...createCandidate, full_name: event.target.value })
        } else if (event.target.name === "Mail id") {
            setCreateCandidate({ ...createCandidate, mail_id: event.target.value })
        } else if (event.target.name === "Mobile Number") {
            const value = event.target.value;
            if (/^\d*$/.test(value) && value.length <= 10) {
                setCreateCandidate({ ...createCandidate, mobile_number: event.target.value })
            }
        } else if (event.target.name === "Education") {
            setCreateCandidate({ ...createCandidate, education: event.target.value })
        } else if (event.target.name === "Location") {
            setCreateCandidate({ ...createCandidate, location: event.target.value })
        } else {
            setCreateCandidate({ ...createCandidate, current_role: event.target.value })
        }


        const remove_mobile_number_invalid_class = document.getElementById("mobile_number")
        remove_mobile_number_invalid_class.classList.remove("is-invalid")
        setValidated(false)
    }

    const handleSubmit = () => {
        if (createCandidate.mobile_number.length !== 10) {
            const check_mobile_number = document.getElementById("mobile_number")
            check_mobile_number.classList.add("is-invalid")
        }

        setValidated(true);
    };

    const handleButtonName = (v) => {
        return <div className="text-start">
            {v.icon}
            <span className="d-none d-md-inline-block ps-1">
                {v.name}
            </span>
        </div>
    }

    const modalHeaderFun = () => {
        switch (modalType) {
            case "manual":
                return "Create Candidate";

            case "csv":
                return "Upload CSV File";

            default:
                break;
        }
    }

    const modalBody = () => {
        switch (modalType) {
            case "manual":
                return <div className="container">
                    <Form noValidate validated={validated}>
                        <div className='d-flex flex-wrap'>
                            {
                                form_data.map((data, index) => {
                                    return <div className="col-6 p-3" key={index}>
                                        <InputGroup
                                            inputControlId={data.control_id}
                                            className="py-2 rounded-2"
                                            inputType={data.inputType}
                                            inputHeading={data.inputHeading}
                                            inputId={data.inputId}
                                            value={data.inputValue}
                                            inputError={data.inputHeading === "Mobile Number" ?
                                                campaignDetailsSlice.create_candidate?.mobile_number?.length !== 10 ?
                                                    "Mobile number should be 10 digit"
                                                    :
                                                    data.inputERR
                                                :
                                                data.inputERR
                                            }
                                            change={handleOnchange}
                                        />
                                    </div>
                                })
                            }
                        </div>
                    </Form>
                </div>

            case "csv":
                return <div className='text-center py-4'>
                    <InputGroup
                        inputType="file"
                        className="form-control"
                        inputId="uploadCSV"
                        inputHidden={true}
                        inputAccept=".csv"
                        change={(e) => SetCsvFile(e.target.files[0])}
                    />

                    <div className="col-12 cursor-pointer" onClick={() => document.getElementById('uploadCSV').click()}>
                        {
                            csvFile ?
                                <>
                                    {Icons.uploadModalIcon}
                                    <p className='text-muted py-2'>{csvFile?.name}</p>
                                </>
                                :
                                <>
                                    {Icons.uploadModalIcon}
                                    <p className='text-muted py-2'>Click here to upload CSV</p>
                                </>
                        }

                    </div>

                    <ButtonComponent
                        as="div"
                        type="button"
                        className="btn-brand-color w-75"
                        title="Create campaign"
                        buttonName='Upload'
                    />
                </div >

            default:
                break;
        }
    }

    const modalFooter = () => {
        switch (modalType) {
            case "manual":
                return <ButtonComponent
                    type="button"
                    className="btn-md btn-brand-color "
                    clickFunction={handleSubmit}
                    title="Create candidate"
                    buttonName="Create"
                />

            default:
                break;
        }
    }

    const canvasBody = () => {
        return (
            <>
                <div className="p-2">
                    <Form>
                        <Row className="">
                            <Form.Group className="mb-3 me-5" as={Col}>
                                <Form.Label>Mail Id</Form.Label>
                                <Form.Control type="email" />
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3 me-5" as={Col}>
                                <Form.Label>Education</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>location</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>Current Role</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                        </Row>
                        <div
                            className="d-flex justify-content-between align-items-center mb-3"
                            style={{ width: "65%" }}
                        >
                            <div className="resume-box d-flex  gap-2 p-3 ">
                                <ButtonComponent
                                    buttonName="Prakash Resume"
                                    className={"resume-btn"}
                                />
                            </div>
                            <div>
                                <ButtonComponent
                                    buttonName={handleButtonName({
                                        icon: (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 25 24"
                                                fill="none"
                                            >
                                                <path
                                                    d="M21.5 5.97998C18.17 5.64998 14.82 5.47998 11.48 5.47998C9.5 5.47998 7.52 5.57998 5.54 5.77998L3.5 5.97998"
                                                    stroke="red"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M9 4.97L9.22 3.66C9.38 2.71 9.5 2 11.19 2H13.81C15.5 2 15.63 2.75 15.78 3.67L16 4.97"
                                                    stroke="red"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M19.35 9.14001L18.7 19.21C18.59 20.78 18.5 22 15.71 22H9.28999C6.49999 22 6.40999 20.78 6.29999 19.21L5.64999 9.14001"
                                                    stroke="red"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M10.83 16.5H14.16"
                                                    stroke="red"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M10 12.5H15"
                                                    stroke="red"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        ),
                                        name: "Delete",
                                    })}
                                    className={"del-btn"}
                                    type={"button"}
                                />
                            </div>
                        </div>
                        <Form.Label>
                            <h4>Questions</h4>
                        </Form.Label>
                        <Form.Group className="mb-3">
                            <Form.Label>Question 1</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Question 2</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Question 3</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Question 4</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                    </Form>
                </div>
            </>
        );
    };

    const canvasFooter = () => {
        return (
            <div className="d-flex justify-content-around mb-3">
                <ButtonComponent
                    // title={v.title}
                    buttonName={handleButtonName({
                        icon: Icons.deleteIcon,
                        name: "Delete",
                    })}
                    className={"box-btn btn-light border border-secondary "}
                    type={"button"}
                />
                <ButtonComponent
                    buttonName={handleButtonName({
                        icon: Icons.pendingIcon,
                        name: "Pending",
                    })}
                    className={"box-btn btn-light border border-secondary "}
                    type={"button"}
                />
                <ButtonComponent
                    buttonName={handleButtonName({
                        icon: Icons.callIcon,
                        name: "make a call",
                    })}
                    className={"box-btn btn-light border border-secondary "}
                    type={"button"}
                    clickFunction={() => {
                        handleShow("make a call");
                    }}
                />
            </div>
        );
    };

    return (
        <Fragment>
            <MetaData title="campaign detail" />
            
            <div className="row align-items-center border-bottom pb-3 pe-4">
                <div className="col-4">
                    <h5>Backend developer</h5>
                </div>
                <div className="col row justify-content-end">
                    <div className="col-12 text-end">
                        {buttonDataOne.map((v, i) => {
                            return <Fragment>
                                <ButtonComponent
                                    type="button"
                                    className={v.className}
                                    title={v.title}
                                    clickFunction={() => {
                                        setModalType(v.setModalType)
                                        handleModel()
                                    }}
                                    buttonName={handleButtonName({
                                        icon: v.icon,
                                        name: v.name
                                    })}
                                />
                            </Fragment>
                        })}
                    </div>
                </div>
            </div>

            <div className="interview_create_button_below_content">
                <div className="container-fluid h-100">
                    {
                        candidateDetails.length ?
                            <div className="card border-0">
                                <div className="card-body p-1 " style={{ minHeight: "80vh", height: "auto" }}>
                                    <Table className="table-responsive" responsive>
                                        <thead>
                                            <tr>
                                                <th>S.no</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>MobileNumber</th>
                                                <th>Education</th>
                                                <th>Location</th>
                                                <th>Current Role</th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        {candidateDetails.map((item, index) => {
                                            return (
                                                <tbody key={index}>
                                                    <tr >
                                                        <td >{index + 1}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.phone}</td>
                                                        <td>{item.education}</td>
                                                        <td>{item.location}</td>
                                                        <td>{item.currentRole}</td>
                                                        <td className='text-center'>
                                                            <ButtonComponent
                                                                className={"btn-transparent border-0"}
                                                                buttonName={Icons.resumeAvailable}
                                                            />
                                                        </td>
                                                        <td className='text-center'>
                                                            <ButtonComponent
                                                                className={"btn-transparent border-0"}
                                                                buttonName={Icons.editIcon}
                                                            />
                                                        </td>
                                                        <td className='text-center'>
                                                            <ButtonComponent
                                                                className={"btn-transparent border-0"}
                                                                clickFunction={handleCanvasOpenOrClose}
                                                                buttonName={Icons.expandIcon}
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            );
                                        })}
                                    </Table>
                                </div>
                            </div>
                            :
                            <div className={`${campaignDetailedData.length ? '' : 'h-75 align-items-center justify-content-center'} row w-100 `}>
                                <div className="col-12 responsive-not-found-width text-center">
                                    <div className="w-100">
                                        <Img
                                            src={Image.CandidatesNotFound}
                                            alt="no campaign found"
                                            width="150em"
                                        />
                                    </div>
                                    <p className='my-3'>No candidates found</p>
                                    <p className='text-secondary'>Create or Upload candidate details</p>
                                    {buttonDataOne.map((v, i) => {
                                        return <Fragment>
                                            <ButtonComponent
                                                type="button"
                                                className={v.className}
                                                title={v.title}
                                                clickFunction={() => {
                                                    setModalType(v.setModalType)
                                                    handleModel()
                                                }}
                                                buttonName={handleButtonName({
                                                    icon: v.icon,
                                                    name: v.name
                                                })}
                                            />
                                        </Fragment>
                                    })}
                                </div>
                            </div>
                    }
                </div>
            </div>


            <OffCanvas
                offCanvasShow={offCanvasShow}
                offcanvasClassname={"rounded-start-4 border-0 candidateTableOffcanvas "}
                offcanvasHeaderClassname={"offcanvasHeaderHeight text-primary"}
                handleCanvasOpenOrClose={handleCanvasOpenOrClose}
                offcanvasBodyClassname={"offcanvasBodyHeight"}
                canvasBody={canvasBody()}
                offcanvasPlacement={"end"}
                canvasHeader={"Prakash S"}
                offcanvasHeaderTitleClassname={"fs-2"}
                canvasFooter={canvasFooter()}
            />


            <ModalComponent
                modalShow={modalShow}
                modalSize={modalType === "manual" ? "lg" : "md"}
                modalCentered={true}
                handleModel={handleModel}
                showModalHeader={true}
                modalHeaderTitleClassname='fs-5'
                modalHeader={modalHeaderFun()}
                modalBody={modalBody()}
                showModalFooter={modalType === "manual" ? true : false}
                modalFooter={modalFooter()}
            />
        </Fragment>
    )
}

export default CampaignDetails