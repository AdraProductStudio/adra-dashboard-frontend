import React, { Fragment, useEffect, useState } from 'react'
import ButtonComponent from 'Components/Button/Button'
import Img from 'Components/Img/Img'
import Image from 'Utils/Image'
import { updateOverallModalData } from 'Views/Common/Slice/Common_slice'
import useCommonState, { useCustomNavigate, useDispatch } from 'ResuableFunctions/CustomHooks'
import { handleGetCampaign } from '../../Action/AdminAction'
import CampaignCard from 'Components/Card/CampaignCard'

const Campaign = () => {
    const dispatch = useDispatch();
    const { adminState } = useCommonState();
    const navigate = useCustomNavigate();
    const [activeCompanyFilter, setActiveCompanyFilter] = useState('Applied Automation Systems');

    const campaigns = adminState?.campaigns_data?.campaign || [];
    const companyFilters = ['Applied Automation Systems', 'Adra Product Studio'];
    const selectedCompanyFlag = activeCompanyFilter === 'Applied Automation Systems' ? 'applied' : 'adra';
    const filteredCampaigns = campaigns.filter((campaign) => {
        const companyBadgeLabel = campaign?.company_flag === "applied" ? 'Applied Automation Systems' : 'Adra Product Studio';
        return companyBadgeLabel === activeCompanyFilter;
    });

    useEffect(() => {
        dispatch(handleGetCampaign())
    }, [])

    return (
        <Fragment>
            <div className="campaign_header border-bottom">
                {
                    adminState?.campaign_placeholder ? null :
                        <div className="campaign_header_filters" role="tablist" aria-label="Campaign source filter">
                            {
                                companyFilters.map((filterName) => (
                                    <ButtonComponent key={filterName} buttonName={filterName} type="button" className={`campaign_filter_tab ${filterName === activeCompanyFilter ? 'active' : ''}`} clickFunction={() => setActiveCompanyFilter(filterName)} />
                                ))
                            }
                        </div>
                }
                <div className="campaign_header_action">
                    <ButtonComponent type="button" buttonName="Create Campaign" className="btn btn-primary" clickFunction={() => dispatch(updateOverallModalData({ size: 'md', from: 'admin', type: 'create_campaign', data: { company_flag: selectedCompanyFlag } }))} />
                </div>
            </div>
            <div className="campaign_body">
                <div className={`d-flex flex-wrap py-4 ${!adminState?.campaign_placeholder && !adminState?.campaigns_data?.campaignCount ? 'justify-content-center align-items-center h-100' : ''}`}>
                    {
                        adminState?.campaign_placeholder ?
                            Array.from({ length: 6 }, (_, i) => (
                                <div className="col-12 col-md-6 col-lg-4 col-xxl-3 p-2">
                                    <CampaignCard cardClassName="w-100" placeholder={true} />
                                </div>
                            ))
                            :
                            adminState?.campaigns_data?.campaignCount ?
                                filteredCampaigns?.length ?
                                    filteredCampaigns.map((campaign, index) => (
                                        <div className="col-12 col-md-6 col-lg-4 col-xxl-3 p-2" key={index}>
                                            <CampaignCard cardClassName="w-100" campaign={campaign} clickFunction={() => navigate(campaign?._id)} />
                                        </div>
                                    ))
                                    :
                                    <div className="col-12 text-center py-5">
                                        <h6 className='mb-2'>No {activeCompanyFilter} campaigns found</h6>
                                        <p className='mb-0 text-secondary'>Try switching between Adra and Applied.</p>
                                    </div>
                                :
                                <div className="col-md-9 col-lg-6 text-center">
                                    <Img src={Image?.Task_empty} alt="no_campaigns" width="170em" />
                                    <h6 className='mt-2'>No Campaigns are being created</h6>
                                    <div className="px-2 mt-3">
                                        <ButtonComponent type="button" buttonName="Create Campaign" className="btn btn-dark" clickFunction={() => dispatch(updateOverallModalData({ size: 'md', from: 'admin', type: 'create_campaign', data: { company_flag: selectedCompanyFlag } }))} />
                                    </div>
                                </div>
                    }

                </div>
            </div>
        </Fragment>
    )
}

export default Campaign
