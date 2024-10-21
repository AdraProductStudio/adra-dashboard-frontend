import React, { Fragment, useEffect, useState } from 'react'
import ButtonComponent from 'components/Button/Button'
import Img from 'components/Img/Img';
import Image from 'Utils/Image';
import ModalComponent from 'components/Modal/Modal';
import InputGroup from 'components/Input/InputGroup';
import CampaignCard from 'components/Card/CampaignCard';
import Icons from 'Utils/Icons';
import useCustomNavigate from 'components/CustomHooks';
import MetaData from 'components/Helmet/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { updateModalShow } from 'Redux/Slices/Common_Slice/Common_slice';
import { handleGetCampaign, handleClearApiErrors, handleClearPopUpId, handleCreateJobInput, handlePopUpId, handleCreateCampaign } from 'Redux/Actions/Human_Resource_actions/Campaign_action';
import { toast } from 'react-toastify';

const InterviewComp = () => {
    const { cardEditAndDeletePopUpId,createCampaignBtn, apiErr, campaign_cards_data, createJobInput } = useSelector((state) => state.campaignStates);
    const navigate = useCustomNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(handleGetCampaign())
    }, [])

    useEffect(() => {
        if (apiErr) {
            toast(apiErr, {
                position: "top-right",
                type: 'error',
                onOpen: () => { dispatch(handleClearApiErrors) }
            })
            return

        }
    }, [apiErr])


    // useEffect(() => {


    //     const handler = (e) => {
    //         if (!e.target.closest('.campaign-edit-or-delete-dot')) {
    //         }
    //     }

    //     document.addEventListener("mousedown", handler);

    //     return () => {
    //         document.removeEventListener("mousedown", handler);
    //     }


    // }, [])

    const handleButtonName = (v) => {
        return <div className="text-center">
            {v.icon}
            <span className="d-none d-md-inline-block text-center ps-2">
                {v.name}
            </span>
        </div>
    }

    const modalBody = () => {
        return <>
            <InputGroup
                inputHeading='Enter a Job Title:'
                className="py-2 rounded-2"
                inputType="text"
                defaultValue={createJobInput}
                change={(e) => dispatch(handleCreateJobInput(e.target.value))}
            />

            {
                createCampaignBtn ?
                    <ButtonComponent
                        type="button"
                        className="btn-brand-color create-button-size mt-3 w-100 rounded-3 py-2"
                        title="creating..."
                        buttonName={'creating...'}
                        btnDisable={true}
                    />
                    :
                    <ButtonComponent
                        type="button"
                        className="btn-brand-color create-button-size mt-3 w-100 rounded-3 py-2"
                        title="Create campaign"
                        clickFunction={() => dispatch(handleCreateCampaign(createJobInput))}
                        buttonName={'Create Job'}
                        
                    />
            }

        </>
    }

    const cardTitleFun = (v) => {
        return <>
            <div className="col-11">
                <h5>{v?.job_title}</h5>
                <p className='text-muted small-size-font'>Post On:{v?.created_at}</p>
            </div>
            <div className="col-1 text-center" onClick={() => dispatch(handlePopUpId(v?._id))}>
                {Icons.threeDotMenuIcon}
            </div>
            {cardEditAndDeletePopUpId === v?._id ?
                <div className="campaign-edit-or-delete-card campaign-edit-or-delete-dot shadow">
                    <ul className='mb-0 ps-0'>
                        <li onClick={() => {
                            dispatch(updateModalShow())
                            dispatch(handleClearPopUpId)
                        }}>Edit </li>

                        <li>Delete</li>
                    </ul>
                </div>
                :
                null
            }
        </>
    }

    const cardBodyFun = (v) => {
        return <Fragment>
            <div className="col-12 d-inline-flex flex-wrap align-items-center pb-3">
                <div className="col-1 text-center">
                    {Icons.InterviewScheduleIcon}
                </div>
                <div className="col-7 ps-2 text-muted">
                    <p className='mb-0'>Interview Schedule Date</p>
                </div>
                <div className="col-4">
                    <span className='pe-2'>:</span>
                    <span className='mb-0 d-inline-flex'>DD-MM-YY</span>
                </div>
            </div>

            <div className="col-12 d-inline-flex pb-3">
                <div className="col-1 text-center">
                    {Icons.campaignNoOfCandidates}
                </div>
                <div className="col-7 ps-2 text-muted">
                    <p className='mb-0'>No of Candidates</p>
                </div>
                <div className="col-4">
                    <span className='pe-2'>:</span>
                    <span className='mb-0 d-inline-flex'>0</span>
                </div>
            </div>

            <div className="col-12 d-inline-flex pb-3">
                <div className="col-1 text-center">
                    {Icons.campaignConfirmCandidatesIcon}
                </div>
                <div className="col-7 ps-2 text-muted">
                    <p>Confirm Candidates</p>
                </div>
                <div className="col-4">
                    <span className='pe-2'>:</span>
                    <span className='mb-0 d-inline-flex'>0</span>
                </div>
            </div>
        </Fragment>
    }

    return (
        <Fragment>
            <MetaData title="interview campaign" />

            <div className="row align-items-center border-bottom pb-3 pe-4">
                <div className="col-4">
                    <h5>Interview</h5>
                </div>
                <div className="col row justify-content-end">
                    <div className="col-9 col-md-10 col-lg-9 col-xxl-10 col text-end">
                        <ButtonComponent
                            type="button"
                            className="btn-brand-outerLayer-color me-3"
                            title="Sort by"
                            buttonName={handleButtonName({
                                icon: Icons.sortbyIcon,
                                name: 'Sort by'
                            })}
                        />

                        <ButtonComponent
                            type="button"
                            className="btn-brand-outerLayer-color me-3"
                            title="Filter"
                            buttonName={handleButtonName({
                                icon: Icons.filterIcon,
                                name: 'Filter'
                            })}
                        />
                    </div>

                    <div className="col text-end">
                        <ButtonComponent
                            type="button"
                            className="btn-brand-color "
                            title="Create campaign"
                            clickFunction={() => dispatch(updateModalShow())}
                            buttonName={handleButtonName({
                                icon: Icons.pulsIcon,
                                name: 'Create Job'
                            })}
                        />
                    </div>
                </div>
            </div>

            <div className="interview_create_button_below_content">
                <div className="container-fluid h-100 overflow-scroll pb-5">
                    <div className={`${campaign_cards_data.length ? '' : 'h-75 align-items-center justify-content-center'} row w-100 `}>
                        {
                            campaign_cards_data.length ?
                                campaign_cards_data.map((v,i) => {
                                    return <div className="p-2 col-12 col-md-6 col-lg-4 col-xxl-3" key={i}>
                                        <CampaignCard
                                            cardClassName="w-100 campaign-card"
                                            cardBodyClassName="p-0 row campagin-card-body-fs"
                                            cardTitleClassName="px-3 pt-4 campaign-card-header row"
                                            cardTitle={cardTitleFun(v)}
                                            cardTextClassName="p-3 py-4"
                                            cardBody={cardBodyFun()}
                                            clickFunction={() => navigate(`/interview/${v._id}`)}
                                        />
                                    </div>
                                })
                                :
                                <div className="col-12 col-sm-10 col-md-6 col-lg-5 col-xxl-3 text-center">
                                    <div className="w-100">
                                        <Img
                                            src={Image.CampainEmpty}
                                            alt="no campaign found"
                                            width="150em"
                                        />
                                    </div>
                                    <p className='my-3'>No jobs are being created</p>
                                    <p className='text-secondary'>Create and send to your customers an offer they can't refuse!</p>
                                    <ButtonComponent
                                        type="button"
                                        className="btn-brand-color create-button-size"
                                        title="Create campaign"
                                        clickFunction={() => dispatch(updateModalShow())}
                                        buttonName={handleButtonName({
                                            icon: Icons.pulsIcon,
                                            name: 'Create Job'
                                        })}
                                    />
                                </div>
                        }

                    </div>
                </div>
            </div>

            <ModalComponent
                modalClickOutsideHide={false}
                modalSize="md"
                modalClassname='modal-border-radius'
                modalCentered={true}
                showModalHeader={true}
                modalHeader='Create a job'
                modalHeaderTitleClassname='fs-5'
                modalBodyClassname='px-5 py-5'
                modalBody={modalBody()}
            />
        </Fragment>
    )
}

export default InterviewComp