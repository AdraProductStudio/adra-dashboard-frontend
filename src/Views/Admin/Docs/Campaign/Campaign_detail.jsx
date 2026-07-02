import ButtonComponent from 'Components/Button/Button'
import CampaignCandidatesCard from 'Components/Card/CampaignCandidatesCard';
import SpinnerComponent from 'Components/Spinner/Spinner';
import React, { Fragment, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import useCommonState, { useCustomNavigate, useDispatch } from 'ResuableFunctions/CustomHooks'
import { handleGetIndividualCampaign, handleGetQuestionTypes } from 'Views/Admin/Action/AdminAction';

const Campaign_detail = () => {
    const { campaign_id } = useParams();
    const dispatch = useDispatch();
    const navigate = useCustomNavigate();
    const { adminState } = useCommonState();

    useEffect(() => {
        dispatch(handleGetIndividualCampaign({ campaign_id }))
    }, [])

    return (
        <Fragment>
            <div className="campaign_header border-bottom">
                <div className="w-70">
                    <ButtonComponent type="button" buttonName="Back" className="btn btn-outline-secondary mb-2" clickFunction={() => navigate("/dashboard/interview")} />
                    <h6 className='mb-0 mt-2'>{adminState?.campaigns_data?.job_title || ''} campaign</h6>
                </div>

                <div className="flex-grow-1 text-end">
                    <div className="w-100 h-100 d-flex justify-content-end align-items-center">
                        <div className="px-2">
                            <ButtonComponent type="button" buttonName="Generate Sample Test" className="btn btn-outline-primary" clickFunction={() => navigate(`/dashboard/interview/${campaign_id}/generate_sample_test`)} btnDisable={!adminState?.campaigns_data?.question_pattern?.length} />
                        </div>
                        <div className="px-2">
                            <ButtonComponent type="button" buttonName="Generate Questions" className="btn btn-outline-primary" clickFunction={() => dispatch(handleGetQuestionTypes())} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="campaign_detail_body">
                {adminState?.campaign_placeholder ?
                    <div className="campaign_detail_body d-flex flex-column justify-content-center align-items-center">
                        <div className="col-5 text-center">
                            <SpinnerComponent />
                            <p className='mt-2'>Getting campaign datas</p>
                        </div>
                    </div>
                    :
                    adminState?.campaigns_data?.candidates?.length ?
                        <div className="row py-3">
                            {adminState?.campaigns_data?.candidates?.map((item, index) => (
                                <div className='col-12 col-md-6 col-lg-4 col-xl-3 p-2' key={index}>
                                    <CampaignCandidatesCard data={item} clickFunction={() => navigate(`/dashboard/interview/${campaign_id}/${item?.candidate_id}`)} />
                                </div>
                            ))}
                        </div>
                        :
                        <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                            <div className="col-5 text-center">
                                <h6 className='text-secondary'>No Candidates Found</h6>
                            </div>
                        </div>
                }
            </div>
        </Fragment>
    )
}

export default Campaign_detail