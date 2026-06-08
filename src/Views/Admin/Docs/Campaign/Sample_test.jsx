import ButtonComponent from 'Components/Button/Button'
import CampaignCandidatesCard from 'Components/Card/CampaignCandidatesCard';
import Checkbox from 'Components/Input/Checkbox';
import SpinnerComponent from 'Components/Spinner/Spinner';
import React, { Fragment, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import useCommonState, { useCustomNavigate, useDispatch } from 'ResuableFunctions/CustomHooks'
import { handleGetIndividualCampaign, handleGetQuestionTypes, handleGetSampleTest } from 'Views/Admin/Action/AdminAction';

const Sample_test = () => {
    const { campaign_id } = useParams();
    const dispatch = useDispatch();
    const navigate = useCustomNavigate();
    const { adminState } = useCommonState();

    useEffect(() => {
        dispatch(handleGetSampleTest({ campaign_id }))
    }, [])

    return (
        <Fragment>
            <div className="campaign_header border-bottom">
                <div className="w-70">
                    <ButtonComponent type="button" buttonName="Back" className="btn btn-outline-secondary mb-2" clickFunction={() => navigate(`/dashboard/interview/${campaign_id}`)} />
                    <h6 className='mb-0 mt-2'>{adminState?.sample_test?.job_title || ''} campaign</h6>
                </div>
            </div>
            <div className="campaign_detail_body">
                {adminState?.sample_test_glow ?
                    <div className="campaign_detail_body d-flex flex-column justify-content-center align-items-center">
                        <div className="col-5 text-center">
                            <SpinnerComponent />
                            <p className='mt-2'>Getting sample test...</p>
                        </div>
                    </div>
                    :
                    adminState?.sample_test?.generated_questions?.length ?
                        <div className="row py-3 justify-content-center">
                            <h5 className='mb-5'>Sample test questions</h5>
                            {adminState?.sample_test?.generated_questions?.map((item, index) => (
                                <div className="col-11 py-2 border-bottom" >
                                    <p>{index + 1} .{item?.question}</p>
                                    <div className='w-100'>
                                        {item?.options?.map((val, ind) => (
                                            <div className='border p-3 my-2 rounded-2 cursor-pointer'>
                                                <Checkbox
                                                    formType="radio"
                                                    formLabel={val}
                                                    formValue={item?.answer}
                                                    name={val}
                                                    formClassName={`ps-4 test_radio_btn pe-none ${item?.candidate_answer === val ? item?.candidate_answer === item?.answer ? 'text-success' : 'text-danger' : ''}`}
                                                    formId={index + ind}
                                                    formName={`question_${index}`}
                                                    formChecked={item?.candidate_answer === val}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <p className='text-success'>Correct answer: {item?.answer}</p>
                                </div>
                            ))}
                        </div>
                        :
                        <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                            <div className="col-5 text-center">
                                <h6 className='text-secondary'>No Questions Found</h6>
                            </div>
                        </div>
                }
            </div>
        </Fragment>
    )
}

export default Sample_test