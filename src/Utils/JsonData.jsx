import { useSelector } from 'react-redux'


const JsonData = () => {
    //main selectors
    const campaignDetailsSlice = useSelector((state) => state.campaignStates);


    //
    const json = {
        // Hr create candidate datas 
        createCandidateData: [
            {
                control_id: "validationFullname",
                inputHeading: "Full Name",
                inputValue: campaignDetailsSlice.create_candidate?.full_name,
                inputId: "full_name",
                inputERR: "Name required"
            },
            {
                control_id: "validationMailid",
                inputHeading: "Mail id",
                inputValue: campaignDetailsSlice.create_candidate?.mail_id,
                inputId: "mail_id",
                inputERR: "Mail id required"
            },
            {
                control_id: "validationFullMobilenumber",
                inputHeading: "Mobile Number",
                inputValue: campaignDetailsSlice.create_candidate?.mobile_number,
                inputId: "mobile_number",
                inputERR: "Mobile number required"
            },
            {
                control_id: "validationFullEducation",
                inputHeading: "Education",
                inputValue: campaignDetailsSlice.create_candidate?.education,
                inputId: "education",
                inputERR: "Education required"
            },
            {
                control_id: "validationLocation",
                inputHeading: "Location",
                inputValue: campaignDetailsSlice.create_candidate?.location,
                inputId: "location",
                inputERR: "Location required"
            },
            {
                control_id: "validationCurrentRole",
                inputHeading: "Current Role",
                inputValue: campaignDetailsSlice.create_candidate?.current_role,
                inputId: "current_role",
                inputERR: "Current role required"
            }
        ],


    }
    
    return json
}

export default JsonData