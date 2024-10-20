import React, { useState } from 'react'
import JsonData from 'Utils/JsonData'
import ButtonComponent from 'components/Button/Button'
import Img from 'components/Img/Img'
import InputGroup from 'components/Input/InputGroup'
import ModalComponent from 'components/Modal/Modal'
import Icons from 'Utils/Icons'
import Image from 'Utils/Image'
import { Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'




const CampaignDetails = () => {
    const campaignDetailsSlice = useSelector((state)=>state.campaignStates);
    const form_data = JsonData().createCandidateData

    const campaignDetailedData = [];
    const [modalShow, setModalShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [modalType, setModalType] = useState('');
    const [csvFile, SetCsvFile] = useState(null);

    const [createCandidate, setCreateCandidate] = useState({
        full_name: '',
        mail_id: '',
        mobile_number: '',
        education: '',
        location: '',
        current_role: ''
    })

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

    const handleModel = () => setModalShow(!modalShow);

    const handleButtonName = (v) => {
        return <div className='row'>
            <div className="col-2 text-center">
                {v.icon}
            </div>
            <div className="col d-none d-md-block text-center ps-2">
                <p className='mb-0'>{v.name}</p>
            </div>
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
                                            inputType="text"
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

    return (
        <>
            <div className="row align-items-center border-bottom pb-3 pe-4">
                <div className="col-4">
                    <h5>Backend developer</h5>
                </div>
                <div className="col row justify-content-end">
                    <div className="col-12 text-end">
                        <ButtonComponent
                            type="button"
                            className="btn-brand-outerLayer-color me-3"
                            title="Create campaign"
                            clickFunction={() => {
                                setModalType('manual')
                                handleModel()
                            }}
                            buttonName={handleButtonName({
                                icon: Icons.pulsIconBlack,
                                name: 'Create Manual'
                            })}
                        />

                        <ButtonComponent
                            type="button"
                            className="btn-brand-color create-button-size"
                            title="Create campaign"
                            clickFunction={() => {
                                setModalType('csv')
                                handleModel()
                            }}
                            buttonName={handleButtonName({
                                icon: Icons.uploadIcon,
                                name: 'Upload CSV File'
                            })}
                        />
                    </div>
                </div>
            </div>

            <div className="interview_create_button_below_content">
                <div className="container-fluid h-100">
                    <div className={`${campaignDetailedData.length ? '' : 'h-75 align-items-center justify-content-center'} row w-100 `}>
                        <div className="col-12 col-sm-10 col-md-6 col-lg-5 col-xxl-3 text-center">
                            <div className="w-100">
                                <Img
                                    src={Image.CandidatesNotFound}
                                    alt="no campaign found"
                                    width="150em"
                                />
                            </div>
                            <p className='my-3'>No candidates found</p>
                            <p className='text-secondary'>Create or Upload candidate details</p>
                            <ButtonComponent
                                type="button"
                                className="btn-brand-outerLayer-color me-4"
                                title="Create campaign"
                                clickFunction={() => {
                                    setModalType('manual')
                                    handleModel()
                                }}
                                buttonName={handleButtonName({
                                    icon: Icons.pulsIconBlack,
                                    name: 'Create Manual'
                                })}
                            />

                            <ButtonComponent
                                type="button"
                                className="btn-brand-color col-md-6"
                                title="Create campaign"
                                clickFunction={() => {
                                    setModalType('csv')
                                    handleModel()
                                }}
                                buttonName={handleButtonName({
                                    icon: Icons.uploadIcon,
                                    name: 'Upload CSV File'
                                })}
                            />
                        </div>
                    </div>
                </div>
            </div>


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
        </>
    )
}

export default CampaignDetails