import Icons from './Icons';
import useCommonState, { useDispatch } from 'ResuableFunctions/CustomHooks';
import ShortUniqueId from 'short-unique-id';
import { handleInterviewRegistrationOnChange } from 'Views/InterviewCandidates/Action/interviewAction';
import { handleCreateCampaignOnChnage } from 'Views/Admin/Action/AdminAction';
import { assignQuestionTypes } from 'Views/Admin/Slice/AdminSlice';
import { updateFellowshipCandidatesData, updateToast } from 'Views/Common/Slice/Common_slice';

const readFile = (file) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onloadend = () => {
            resolve({
                id: new ShortUniqueId({ length: 10 }),
                filename: file.name,
                filetype: file.type,
                fileimage: reader.result,
                datetime: file.lastModifiedDate.toLocaleString("en-IN"),
                filesize: filesizes(file.size),
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// function formatDateForInput(date) {
//     if (!date) return ""; // Return empty if date is null
//     const d = new Date(date);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
// };

const filesizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const JsonData = () => {
    const dispatch = useDispatch();
    const { commonState, interviewState, adminState } = useCommonState();

    const jsonOnly = {
        adminSidebarMenus: [
            // {
            //     icon: Icons.dashboardIcon,
            //     name: "Dashboard",
            //     route: "/dashboard/home"
            // },
            // {
            //     icon: Icons?.employeeIcon,
            //     name: "Employees",
            //     route: "/dashboard/employees"
            // },
            // {
            //     icon: Icons.attendanceIcon,
            //     name: "Attendance",
            //     route: "/dashboard/attendance"
            // },
            // {
            //     icon: Icons.payrollIcon,
            //     name: "Payroll",
            //     route: "/dashboard/payroll"
            // },
            {
                icon: Icons.interviewIcon,
                name: "Interview",
                route: "/dashboard/interview"
            },
            // {
            //     icon: Icons.circularIcon,
            //     name: "Circular",
            //     route: "/dashboard/circular"
            // },
            // {
            //     icon: Icons.invoicesIcon,
            //     name: "Invoices",
            //     route: "/dashboard/invoices"
            // },
            // {
            //     icon: Icons.notesIcon,
            //     name: "Notes",
            //     route: "/dashboard/notes"
            // },
            // {
            //     icon: Icons.doocumentIcon,
            //     name: "Documents",
            //     route: "/dashboard/documents"
            // },
            // {
            //     icon: Icons.doocumentIcon,
            //     name: "Fellowship candidates",
            //     route: "/dashboard/fellowship_candidates"
            // }
        ],
        states: [
            { value: 1, label: 'Andaman and Nicobar Islands' },
            { value: 2, label: 'Andhra Pradesh' },
            { value: 3, label: 'Arunachal Pradesh' },
            { value: 4, label: 'Assam' },
            { value: 5, label: 'Bihar' },
            { value: 6, label: 'Chandigarh' },
            { value: 7, label: 'Chhattisgarh' },
            { value: 8, label: 'Dadra and Nagar Haveli' },
            { value: 9, label: 'Delhi' },
            { value: 10, label: 'Goa' },
            { value: 11, label: 'Gujarat' },
            { value: 12, label: 'Haryana' },
            { value: 13, label: 'Himachal Pradesh' },
            { value: 14, label: 'Jammu and Kashmir' },
            { value: 15, label: 'Jharkhand' },
            { value: 16, label: 'Karnataka' },
            { value: 17, label: 'Kerala' },
            { value: 18, label: 'Madhya Pradesh' },
            { value: 19, label: 'Maharashtra' },
            { value: 20, label: 'Manipur' },
            { value: 21, label: 'Meghalaya' },
            { value: 22, label: 'Mizoram' },
            { value: 23, label: 'Nagaland' },
            { value: 24, label: 'Odisha' },
            { value: 25, label: 'Puducherry' },
            { value: 26, label: 'Punjab' },
            { value: 27, label: 'Rajasthan' },
            { value: 28, label: 'Tamil Nadu' },
            { value: 29, label: 'Telangana' },
            { value: 30, label: 'Tripura' },
            { value: 31, label: 'Uttar Pradesh' },
            { value: 32, label: 'Uttarakhand' },
            { value: 33, label: 'West Bengal' }
        ],
        gender: [
            "Male",
            "Female"
        ],
        maritalStatus: [
            "Married",
            "Un Married"
        ],
        canditateRole: [
            "Front-End-Developer",
            "MERN-Stack-Developer"
        ],
        yearOfExp: [
            "0 to 6 Months",
            "6 Months & Above"
        ],
        interviewRound: [
            "HR Round",
            "Apptitude Round",
            "Technical Round",
            "Machine Test",
            "Face to Face Interview",
        ]

    }

    const jsxJson = {
        //                                                              candidate registration form                                                                  //
        candidateRegistration: [
            //                                                                       Candidate details                                                               //
            {
                category: "heading",
                title: "Candidate details",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                name: "Full Name",
                type: "text",
                category: "input",
                placeholder: "",
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                value: interviewState?.candidateData?.name || '',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ name: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.name ? "Full Name required" : null
            },
            {
                name: "Age",
                type: "text",
                category: "input",
                placeholder: "",
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                value: interviewState?.candidateData?.age || '',
                change: (e) => {
                    if (/^\d*$/.test(e.target.value) && e.target.value <= 100) {
                        dispatch(handleInterviewRegistrationOnChange({ age: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.age ? "Age required" : null
            },
            {
                name: "Phone Number",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.phoneNumber || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => {
                    if (/^\d*$/.test(e.target.value) && e.target.value.length <= 10) {
                        dispatch(handleInterviewRegistrationOnChange({ phoneNumber: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.phoneNumber ? "Phone number required" : null
            },
            {
                name: "Email",
                type: "email",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.email || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ email: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.email ? "Email required" : null
            },
            {
                name: "Gender",
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: interviewState?.candidateData?.gender || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                options: jsonOnly.gender,
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ gender: e.target.value })),
                Err: commonState?.validated && !interviewState?.candidateData?.gender ? "Gender required" : null,
                isMandatory: true
            },
            {
                name: "Candidate Recent photo",
                type: "file",
                category: "input",
                placeholder: "",
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                accept: "image/jpeg,image/jpg,image/png",
                value: interviewState?.candidateData?.image_show_ui || [],
                change: (e) => {
                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                    const files = Array.from(e.target.files);

                    const validFiles = files.filter(file => allowedTypes.includes(file.type));
                    if (validFiles.length === 0) return dispatch(updateToast({ type: "error", message: "Please upload valid image files (jpg, jpeg, png)" }));

                    Promise.all(validFiles.map((file) => readFile(file)))
                        .then((results) => {
                            dispatch(handleInterviewRegistrationOnChange({
                                image_show_ui: results,
                                image: validFiles,
                            }));
                        })
                        .catch((error) => console.error('Error reading files:', error));
                },
                deleteImg: (e) => {
                    let remove_image = interviewState?.candidateData?.image_show_ui.filter((item) => item?.id !== e);
                    dispatch(handleInterviewRegistrationOnChange({ image_show_ui: remove_image, image: {} }));
                },
                isMandatory: false,
                // Err: commonState?.validated && !interviewState?.candidateData?.image_show_ui?.length ? "Recent photo required" : null
            },
            {
                name: "Address",
                type: "textbox",
                category: "textbox",
                placeholder: "",
                value: interviewState?.candidateData?.address || '',
                divClassName: 'col-12 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ address: e.target.value })),
                Err: commonState?.validated && !interviewState?.candidateData?.address ? "Address required" : null,
                isMandatory: true
            },

            //                                                                      Family details                                                                 //
            {
                category: "heading",
                title: "Family details",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                name: `Parent ${interviewState?.candidateData?.gender === "Female" ? "/ Husband " : ""} name`,
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.parentName || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ parentName: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.parentName ? "Parent / Husband name required" : null
            },
            {
                name: `Parent ${interviewState?.candidateData?.gender === "Female" ? "/ Husband " : ""} occupation`,
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.parentOccupation || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ parentOccupation: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.parentOccupation ? "Parent / Husband occupation required" : null
            },
            {
                name: "Marital status",
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: interviewState?.candidateData?.maritalStatus || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                options: jsonOnly?.maritalStatus,
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ maritalStatus: e.target.value })),
                Err: commonState?.validated && !interviewState?.candidateData?.maritalStatus ? "Marital status required" : null,
                isMandatory: true
            },
            {
                name: "Childrens",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.childrens || '',
                divClassName: `col-12 col-md-6 col-lg-4 p-1 mt-2 ${interviewState?.candidateData?.maritalStatus ? interviewState?.candidateData?.maritalStatus === "Married" ? "" : "d-none" : "d-none"}`,
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ childrens: e.target.value })),
                isMandatory: interviewState?.candidateData?.maritalStatus === "Married" ? true : false,
                Err: commonState?.validated && !interviewState?.candidateData?.childrens ? "Childrens required" : null
            },
            {
                name: "Brother / Sister name",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.siblings || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ siblings: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.siblings ? "Brother / Sister name required" : null
            },
            {
                name: "Address (Cbe if Any)",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.addressIfAnyCbe || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ addressIfAnyCbe: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.addressIfAnyCbe ? "Address (Cbe if Any) required" : null
            },

            //                                                                Academics & Education                                                                //
            {
                category: "heading",
                title: "Academics & Education",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                name: "School Name (SSLC)",
                sub_heading: "school/college",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.sslcSchoolName || '',
                divClassName: 'col-6 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ sslcSchoolName: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.sslcSchoolName ? "School Name required" : null
            },
            {
                name: "Marks/Percentage",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.sslcMarks || '',
                divClassName: 'col-6 p-1 mt-2',
                change: (e) => {
                    if (/^\d*\.?\d*$/.test(e.target.value) && e.target.value <= 100) {
                        dispatch(handleInterviewRegistrationOnChange({ sslcMarks: e.target.value }));
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.sslcMarks ? "Marks/Percentage required" : null
            },
            {
                name: "School Name (HSC)",
                sub_heading: "school/college",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.hscSchoolName || '',
                divClassName: 'col-6 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ hscSchoolName: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.hscSchoolName ? "School Name required" : null
            },
            {
                name: "Marks/Percentage",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.hscMarks || '',
                divClassName: 'col-6 p-1 mt-2',
                change: (e) => {
                    if (/^\d*\.?\d*$/.test(e.target.value) && e.target.value <= 100) {
                        dispatch(handleInterviewRegistrationOnChange({ hscMarks: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.hscMarks ? "Marks/Percentage required" : null
            },
            {
                name: "College",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.collegeName || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ collegeName: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.collegeName ? "College Name required" : null
            },
            {
                name: "Qualification",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.candidateQualification || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ candidateQualification: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.candidateQualification ? "Qualification required" : null
            },
            {
                name: "CGPA/Percentage",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.collegeMarks || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => {
                    if (/^\d*\.?\d*$/.test(e.target.value) && e.target.value <= 100) {
                        dispatch(handleInterviewRegistrationOnChange({ collegeMarks: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.collegeMarks ? "Marks/Percentage required" : null
            },

            //                                                                Fresher or Experienced                                                              //
            {
                category: "heading",
                title: "Fresher / Experience",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                name: "Fresher",
                type: "radio",
                category: "Checkbox",
                placeholder: "",
                value: "fresher",
                divClassName: 'col-6 col-md-4 col-lg-2 col-xl-1 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ experience: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.experience ? "Experience type required" : null
            },
            {
                name: "Experienced",
                type: "radio",
                category: "Checkbox",
                placeholder: "",
                value: "experienced",
                divClassName: 'col-6 col-md-4 col-lg-2 col-xl-1 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ experience: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.experience ? "Experience type required" : null
            },


            //                                                                       Role                                                                         //
            {
                category: "heading",
                title: "Role",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: interviewState?.candidateData?.canditateRole || '',
                options: interviewState?.registration_roles?.map((item) => item?.job_title) || [],
                divClassName: 'col-12 col-md-8 col-lg-4 col-xl-3 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ canditateRole: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.canditateRole ? "Experience type required" : null
            },

            //                                                                  Work Experience                                                                   //
            {
                category: "heading",
                title: "Work Experience",
                divClassName: `col-12 p-1 mt-2 ${interviewState?.candidateData?.experience !== "experienced" ? "d-none" : ""}`,
            },
            {
                name: "Organization name",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.previousCompanyName || '',
                divClassName: `col-12 col-md-8 col-lg-4 p-1 mt-2 ${interviewState?.candidateData?.experience !== "experienced" ? "d-none" : ""}`,
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ previousCompanyName: e.target.value })),
                isMandatory: interviewState?.candidateData?.experience === "experienced" ? true : false,
                Err: commonState?.validated && !interviewState?.candidateData?.previousCompanyName ? "Organization name required" : null
            },
            {
                name: "Desigination",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.designation || '',
                divClassName: `col-12 col-md-8 col-lg-4 p-1 mt-2 ${interviewState?.candidateData?.experience !== "experienced" ? "d-none" : ""}`,
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ designation: e.target.value })),
                isMandatory: interviewState?.candidateData?.experience === "experienced" ? true : false,
                Err: commonState?.validated && !interviewState?.candidateData?.designation ? "Organization name required" : null
            },
            {
                name: "Years of Experience",
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: interviewState?.candidateData?.canditateExpType || '',
                options: jsonOnly?.yearOfExp,
                divClassName: `col-12 col-md-8 col-lg-4 p-1 mt-2 ${interviewState?.candidateData?.experience !== "experienced" ? "d-none" : ""}`,
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ canditateExpType: e.target.value })),
                isMandatory: interviewState?.candidateData?.experience === "experienced" ? true : false,
                Err: commonState?.validated && !interviewState?.candidateData?.canditateExpType ? "Years of Experience required" : null
            },


            //                                                             Expected Salary (if any)                                                              //
            {
                category: "heading",
                title: "Expected Salary (if any)",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                name: "Present Salary if applicable",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.currentSalary || '',
                divClassName: 'col-12 col-md-8 col-lg-4 p-1 mt-2',
                change: (e) => {
                    if (/^\d*$/.test(e.target.value)) {
                        dispatch(handleInterviewRegistrationOnChange({ currentSalary: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.currentSalary ? "Present Salary required" : null
            },
            {
                name: "Expected Salary",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.expectedSalary || '',
                divClassName: 'col-12 col-md-8 col-lg-4 p-1 mt-2',
                change: (e) => {
                    if (/^\d*$/.test(e.target.value)) {
                        dispatch(handleInterviewRegistrationOnChange({ expectedSalary: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.expectedSalary ? "Expected Salary required" : null
            },

            //                                                                      Remarks                                                                      //
            {
                category: "heading",
                title: "Remarks and Questions if any",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                name: "Write here",
                type: "textbox",
                category: "textbox",
                placeholder: "",
                value: interviewState?.candidateData?.remarks || '',
                divClassName: 'col-12 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ remarks: e.target.value })),
                isMandatory: false
            },
        ],

        create_campaign_inputs: [
            {
                name: "Job title",
                type: "text",
                category: "input",
                placeholder: "",
                divClassName: 'col-12 p-1',
                value: adminState?.create_campaign?.job_title || '',
                change: (e) => dispatch(handleCreateCampaignOnChnage({ job_title: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !adminState?.create_campaign?.job_title ? "Job title required" : ''
            },
            {
                name: "Interview date",
                type: "date",
                is_min: true,
                category: "input",
                placeholder: "",
                divClassName: 'col-12 p-1',
                value: adminState?.create_campaign?.interview_date || '',
                change: (e) => dispatch(handleCreateCampaignOnChnage({ interview_date: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !adminState?.create_campaign?.interview_date ? "Interview date required" : ''
            },
            {
                name: "Test time duration (in mins)",
                type: "text",
                is_min: true,
                category: "input",
                placeholder: "",
                divClassName: 'col-12 p-1',
                value: adminState?.create_campaign?.test_time_duration || '',
                change: (e) => {
                    if (/^\d*$/.test(e.target.value) ){
                        dispatch(handleCreateCampaignOnChnage({ test_time_duration: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !adminState?.create_campaign?.test_time_duration ? "Test time duration required" : ''
            },
        ],

        //                                                                 Admin Assign question
        admin_create_assigning_questions: [
            {
                category: "heading",
                title: "Available Questions",
                divClassName: 'col-12 p-1 mt-2 text-center',
            },
            {
                name: "Total Questions",
                type: "text",
                category: "input",
                placeholder: "",
                value: `Available Questions = ${adminState?.available_questions_data?.total_no_of_questions}`,
                divClassName: 'col-12 p-1 mt-2',
                isMandatory: false,
                disabled: true,
            },
            {
                name: "Question Type",
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: adminState?.create_assigning_questions?.question_type || '',
                options: adminState?.available_questions_data?.data?.map((item) => item?.question_types) || [],
                divClassName: 'col-12 p-1 mt-2',
                change: (e) => dispatch(assignQuestionTypes({ question_type: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !adminState?.create_assigning_questions?.question_type ? "Question type required" : null
            },
            {
                name: "Difficulty Level",
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: adminState?.create_assigning_questions?.difficulty_level || '',
                options: adminState?.available_questions_data?.difficulty_level?.map((item) => item?.level) || [],
                divClassName: 'col-12 p-1 mt-2',
                change: (e) => dispatch(assignQuestionTypes({ difficulty_level: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !adminState?.create_assigning_questions?.difficulty_level ? "Difficulty level required" : null
            },
            {
                name: "Question count",
                type: "text",
                category: "input",
                placeholder: "",
                value: adminState?.create_assigning_questions?.questions_count || '',
                divClassName: 'col-9 p-1',
                change: (e) => {
                    if (/^\d*$/.test(e.target.value) && e.target.value <= adminState?.available_questions_data?.total_count) {
                        dispatch(assignQuestionTypes({ questions_count: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !adminState?.create_assigning_questions?.questions_count ? "Count required" : null
            },
            {
                name: "",
                type: "text",
                category: "input",
                placeholder: "",
                value: `${adminState?.available_questions_data?.total_count || 0} Qs`,
                divClassName: 'col-3 p-1 mt-4',
                isMandatory: false,
                disabled: true,
            },
        ],
        fellowshipCandidatesRegistration: [
            {
                name: "Full Name",
                type: "text",
                category: "input",
                placeholder: "",
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                value: commonState?.fellowship_candidate_register?.fullname || '',
                change: (e) => dispatch(updateFellowshipCandidatesData({ fullname: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.fullname ? "Full Name required" : null
            },
            {
                name: "Age",
                type: "text",
                category: "input",
                placeholder: "",
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                value: commonState?.fellowship_candidate_register?.age || '',
                change: (e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && (value === '' || Number(value) <= 100)) {
                        dispatch(updateFellowshipCandidatesData({ age: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.age ? "Age required" : null
            },
            {
                name: "Phone number",
                type: "text",
                category: "input",
                placeholder: "",
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                value: commonState?.fellowship_candidate_register?.phone_no || '',
                change: (e) => {
                    if (/^\d*$/.test(e.target.value) && e.target.value.length <= 10) {
                        dispatch(updateFellowshipCandidatesData({ phone_no: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.phone_no ? "Phone number required" : null
            },
            {
                name: "Email",
                type: "email",
                category: "input",
                placeholder: "",
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                value: commonState?.fellowship_candidate_register?.email_id || '',
                change: (e) => dispatch(updateFellowshipCandidatesData({ email_id: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.email_id ? "Email id required" : null
            },
            {
                name: "Gender",
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.gender || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                options: jsonOnly.gender,
                change: (e) => dispatch(updateFellowshipCandidatesData({ gender: e.target.value })),
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.gender ? "Gender required" : null,
                isMandatory: true
            },
            {
                name: "Candidate Recent photo",
                type: "file",
                category: "input",
                placeholder: "",
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                accept: "image/jpeg,image/jpg,image/png",
                value: commonState?.fellowship_candidate_register?.image_show_ui || [],
                change: (e) => {
                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                    const files = Array.from(e.target.files);

                    const validFiles = files.filter(file => allowedTypes.includes(file.type));
                    if (validFiles.length === 0) return dispatch(updateToast({ type: "error", message: "Please upload valid image files (jpg, jpeg, png)" }));

                    Promise.all(validFiles.map((file) => readFile(file)))
                        .then((results) => {
                            dispatch(updateFellowshipCandidatesData({
                                image_show_ui: results,
                                image: validFiles,
                            }));
                        })
                        .catch((error) => console.error('Error reading files:', error));
                },
                deleteImg: (e) => {
                    let remove_image = commonState?.fellowship_candidate_register?.image_show_ui.filter((item) => item?.id !== e);
                    dispatch(updateFellowshipCandidatesData({ image_show_ui: remove_image, image: {} }));
                },
                isMandatory: true,
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.image_show_ui?.length ? "Recent photo required" : null
            },
            {
                name: "Work experience",
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.work_experience || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                options: ['Yes', 'No'],
                change: (e) => dispatch(updateFellowshipCandidatesData({ work_experience: e.target.value })),
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.work_experience ? "work experience required" : null,
                isMandatory: true
            },
            {
                name: "Having laptop",
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.have_laptop || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                options: ['Yes', 'No'],
                change: (e) => dispatch(updateFellowshipCandidatesData({ have_laptop: e.target.value })),
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.have_laptop ? "Having laptop required" : null,
                isMandatory: true
            },
            {
                name: "Address",
                type: "textbox",
                category: "textbox",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.address || '',
                divClassName: 'col-12 p-1 mt-2',
                change: (e) => dispatch(updateFellowshipCandidatesData({ address: e.target.value })),
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.address ? "Address required" : null,
                isMandatory: true
            },

            {
                category: "heading",
                title: "Family details",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                name: `Parent name`,
                type: "text",
                category: "input",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.parent_name || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(updateFellowshipCandidatesData({ parent_name: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.parent_name ? "Parent / Husband name required" : null
            },
            {
                name: `Parent occupation`,
                type: "text",
                category: "input",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.parent_occupation || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(updateFellowshipCandidatesData({ parent_occupation: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.parent_occupation ? "Parent / Husband occupation required" : null
            },
            {
                name: "Marital status",
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.marital_status || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                options: ['Yes', 'No'],
                change: (e) => dispatch(updateFellowshipCandidatesData({ marital_status: e.target.value })),
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.marital_status ? "Marital status required" : null,
                isMandatory: true
            },
            {
                name: "Childrens",
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.have_children || 'No',
                divClassName: `col-12 col-md-6 col-lg-4 p-1 mt-2 ${commonState?.fellowship_candidate_register?.marital_status ? commonState?.fellowship_candidate_register?.marital_status === "Yes" ? "" : "d-none" : "d-none"}`,
                options: ['Yes', 'No'],
                change: (e) => dispatch(updateFellowshipCandidatesData({ have_children: e.target.value })),
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.have_children ? "Marital status required" : null,
                isMandatory: true
            },
            {
                name: "Brother / Sister",
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.have_siblings || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                options: ['Yes', 'No'],
                change: (e) => dispatch(updateFellowshipCandidatesData({ have_siblings: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.have_siblings ? "Brother / Sister required" : null
            },

            {
                category: "heading",
                title: "Academics & Education",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                name: "School Name (SSLC)",
                sub_heading: "school/college",
                type: "text",
                category: "input",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.sslc_school_name || '',
                divClassName: 'col-6 p-1 mt-2',
                change: (e) => dispatch(updateFellowshipCandidatesData({ sslc_school_name: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.sslc_school_name ? "School Name required" : null
            },
            {
                name: "Marks/Percentage",
                type: "text",
                category: "input",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.sslc_percentage || '',
                divClassName: 'col-6 p-1 mt-2',
                change: (e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && (value === '' || Number(value) <= 100)) {
                        dispatch(updateFellowshipCandidatesData({ sslc_percentage: e.target.value }));
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.sslc_percentage ? "Marks/Percentage required" : null
            },
            {
                name: "School Name (HSC)",
                sub_heading: "school/college",
                type: "text",
                category: "input",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.hsc_school_name || '',
                divClassName: 'col-6 p-1 mt-2',
                change: (e) => dispatch(updateFellowshipCandidatesData({ hsc_school_name: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.hsc_school_name ? "School Name required" : null
            },
            {
                name: "Marks/Percentage",
                type: "text",
                category: "input",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.hsc_percentage || '',
                divClassName: 'col-6 p-1 mt-2',
                change: (e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && (value === '' || Number(value) <= 100)) {
                        dispatch(updateFellowshipCandidatesData({ hsc_percentage: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.hsc_percentage ? "Marks/Percentage required" : null
            },
            {
                name: "College",
                type: "text",
                category: "input",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.college_name || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(updateFellowshipCandidatesData({ college_name: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.college_name ? "College Name required" : null
            },
            {
                name: "Qualification",
                type: "text",
                category: "input",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.clg_qualification || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(updateFellowshipCandidatesData({ clg_qualification: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.clg_qualification ? "Qualification required" : null
            },
            {
                name: "CGPA/Percentage",
                type: "text",
                category: "input",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.clg_percentage || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && (value === '' || Number(value) <= 100)) {
                        dispatch(updateFellowshipCandidatesData({ clg_percentage: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.clg_percentage ? "Marks/Percentage required" : null
            },

            {
                category: "heading",
                title: "Additional Questions",
                divClassName: 'col-12 p-1 mt-2',
            },

            {
                name: "Why are you interested in software development?",
                type: "textbox",
                category: "textbox",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.software_interest_reason || '',
                divClassName: 'col-12 p-1 mt-2',
                change: (e) => dispatch(updateFellowshipCandidatesData({ software_interest_reason: e.target.value })),
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.software_interest_reason ? "Reason required" : null,
                isMandatory: true
            },
            {
                name: "Why do you want to join this fellowship?",
                type: "textbox",
                category: "textbox",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.reason_for_joining || '',
                divClassName: 'col-12 p-1 mt-2',
                change: (e) => dispatch(updateFellowshipCandidatesData({ reason_for_joining: e.target.value })),
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.reason_for_joining ? "Reason required" : null,
                isMandatory: true
            },
            {
                name: "If you are a college student (or) Currently working, how do you plan to balance your existing commitments with the fellowship?",
                type: "textbox",
                category: "textbox",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.commitment_balance_plan || '',
                divClassName: 'col-12 p-1 mt-2',
                change: (e) => dispatch(updateFellowshipCandidatesData({ commitment_balance_plan: e.target.value })),
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.commitment_balance_plan ? "Reason required" : null,
                isMandatory: true
            },
            {
                name: "Remarks and Questions if any",
                type: "textbox",
                category: "textbox",
                placeholder: "",
                value: commonState?.fellowship_candidate_register?.remarks || '',
                divClassName: 'col-12 p-1 mt-2',
                change: (e) => dispatch(updateFellowshipCandidatesData({ remarks: e.target.value })),
                Err: commonState?.validated && !commonState?.fellowship_candidate_register?.remarks ? "Reason required" : null,
                isMandatory: false
            }
        ]
    }

    return {
        "jsonOnly": jsonOnly,
        "jsxJson": jsxJson
    }
}

export default JsonData