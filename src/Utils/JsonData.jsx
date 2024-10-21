import { useSelector } from 'react-redux'


const JsonData = () => {
    //main selectors
    const campaignDetailsSlice = useSelector((state) => state.campaignStates);



    const json = {
        // Hr create candidate datas 
        createCandidateData: [
            {
                control_id: "validationFullname",
                inputHeading: "Full Name",
                inputType:"text",
                inputValue: campaignDetailsSlice.create_candidate?.full_name,
                inputId: "full_name",
                inputERR: "Name required"
            },
            {
                control_id: "validationMailid",
                inputHeading: "Mail id",
                inputType:"email",
                inputValue: campaignDetailsSlice.create_candidate?.mail_id,
                inputId: "mail_id",
                inputERR: "Mail id required"
            },
            {
                control_id: "validationFullMobilenumber",
                inputHeading: "Mobile Number",
                inputType:"text",
                inputValue: campaignDetailsSlice.create_candidate?.mobile_number,
                inputId: "mobile_number",
                inputERR: "Mobile number required"
            },
            {
                control_id: "validationFullEducation",
                inputHeading: "Education",
                inputType:"text",
                inputValue: campaignDetailsSlice.create_candidate?.education,
                inputId: "education",
                inputERR: "Education required"
            },
            {
                control_id: "validationLocation",
                inputHeading: "Location",
                inputType:"text",
                inputValue: campaignDetailsSlice.create_candidate?.location,
                inputId: "location",
                inputERR: "Location required"
            },
            {
                control_id: "validationCurrentRole",
                inputHeading: "Current Role",
                inputType:"text",
                inputValue: campaignDetailsSlice.create_candidate?.current_role,
                inputId: "current_role",
                inputERR: "Current role required"
            }
        ],


    }
    
    return json
}

export default JsonData