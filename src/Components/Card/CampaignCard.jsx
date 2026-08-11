import ButtonComponent from 'Components/Button/Button';
import React from 'react';
import Card from 'react-bootstrap/Card';
import { useDispatch } from 'ResuableFunctions/CustomHooks';
import IsoStringDateConverter from 'ResuableFunctions/IsoStringDateConverter';
import Icons from 'Utils/Icons';
import { updateOverallModalData } from 'Views/Common/Slice/Common_slice';
import { getAssessmentFlowLabel } from 'Utils/assessmentFlow';


const CampaignCard = ({
    componentFrom,
    placeholder,
    campaign,
    clickFunction
}) => {
    const dispatch = useDispatch();
    const companyBadgeLabel = campaign?.company_flag === 'applied' ? 'Applied' : 'Adra';
    const companyBadgeStyles = {
        position: 'absolute',
        top: '0.85rem',
        right: '0.85rem',
        zIndex: 1,
        fontSize: '0.72rem',
        fontWeight: 600,
        lineHeight: 1.2,
        padding: '0.28rem 0.58rem',
        borderRadius: '999px',
        whiteSpace: 'nowrap',
        color: campaign?.company_flag === "applied" ? '#1D4ED8' : '#F3F4F6',
        backgroundColor: campaign?.company_flag === "applied" ? '#DBEAFE' : '#272829'
    };

    const cardStyles = {
        border: '1px solid #E9ECEF',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFCFD 100%)'
    };

    const metaCardStyles = {
        border: '1px solid #EEF1F4',
        borderRadius: '18px',
        backgroundColor: '#FFFFFF',
        minHeight: '100%'
    };

    const iconWrapStyles = {
        width: '2.75rem',
        height: '2.75rem',
        borderRadius: '14px',
        backgroundColor: '#F6F8FA'
    };

    const card_content = [
        {
            icon: Icons.campaign_calender_icon,
            title: 'Interview Schedule Date',
            value: campaign?.interview_date ? IsoStringDateConverter(campaign?.interview_date)?.date : ''
        },
        {
            icon: Icons.campaign_total_candidate_icon,
            title: 'No of Candidates',
            value: campaign?.no_of_candidates || 0
        },
        {
            icon: Icons.campaign_confirm_candidate_icon,
            title: 'Confirm Candidates',
            value: campaign?.confirmed_candidates || 0
        },
        {
            icon: Icons.interviewIcon,
            title: 'Assessment Flow',
            value: getAssessmentFlowLabel(
                campaign?.assessment_flow || campaign?.next_assessment_type
            )
        }
    ]

    return (
        <Card className='border-0 shadow-sm rounded-4 h-100 overflow-hidden position-relative' style={cardStyles}>
            <Card.Header className='bg-transparent border-0 px-3 px-xl-4 pt-4 pb-2'>
                {/* {
                    placeholder ? null :
                        <span style={companyBadgeStyles}>
                            {companyBadgeLabel}
                        </span>
                } */}
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                    <div className="flex-grow-1 pe-md-3">
                        <h6
                            className={placeholder ? "placeholder w-75 py-3 rounded mb-2" : 'mb-2 fw-semibold text-dark lh-sm'}
                            style={{ overflowWrap: 'anywhere' }}
                        >
                            {campaign?.job_title || ''}
                        </h6>

                        <p className={placeholder ? "placeholder w-50 py-2 rounded mb-0" : 'mb-0 text-secondary fs-13'}>
                            Posted on :
                            {
                                campaign?.created_at || campaign?.createdAt ? IsoStringDateConverter(campaign?.created_at || campaign?.createdAt)?.date
                                    :
                                    ''
                            }
                        </p>
                    </div>

                    {
                        placeholder ? null :
                            <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-auto">
                                <ButtonComponent
                                    type="button"
                                    buttonName={Icons.editIcon}
                                    className="text-center d-inline-flex align-items-center justify-content-center rounded-circle border bg-white p-2"
                                    clickFunction={() => dispatch(updateOverallModalData({ size: 'md', from: 'admin', type: 'create_campaign', data: campaign }))}
                                />

                                <ButtonComponent
                                    type="button"
                                    buttonName={Icons.deleteIcon}
                                    className="text-center d-inline-flex align-items-center justify-content-center rounded-circle border bg-white p-2"
                                    clickFunction={() => dispatch(updateOverallModalData({ size: 'md', from: 'admin', type: 'delete_campaign', data: campaign }))}
                                />
                            </div>
                    }
                </div>
            </Card.Header>

            <Card.Body className='px-3 px-xl-4 pb-3 pb-xl-4 pt-2'>
                <div className="row g-3 cursor-pointer" onClick={clickFunction}>
                    {
                        card_content.map((item, index) => (
                            <div className="col-12" key={index}>
                                <div className="d-flex align-items-start gap-3 p-3" style={metaCardStyles}>
                                    <div
                                        className={placeholder ? "placeholder rounded" : 'd-inline-flex align-items-center justify-content-center flex-shrink-0'}
                                        style={placeholder ? { width: '2.75rem', height: '2.75rem', borderRadius: '14px' } : iconWrapStyles}
                                    >
                                        {placeholder ? null : item.icon}
                                    </div>

                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                        <div
                                            className={placeholder ? "placeholder w-75 py-2 rounded mb-2" : 'text-secondary fs-14 mb-2'}
                                            style={{ overflowWrap: 'anywhere' }}
                                        >
                                            {placeholder ? '' : item.title}
                                        </div>

                                        <div
                                            className={placeholder ? "placeholder w-50 py-2 rounded" : 'fw-semibold text-dark'}
                                            style={{ fontSize: '0.98rem', lineHeight: '1.4', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                                        >
                                            {placeholder ? '' : item.value}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Card.Body>
        </Card >
    )
}

export default CampaignCard
