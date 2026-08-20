export const ASSESSMENT_FLOWS = Object.freeze({
    QA: 'qa',
    PROGRAMMING: 'programming',
    NONE: 'none'
});

export const ASSESSMENT_FLOW_OPTIONS = Object.freeze([
    'QA — QA Assessment + Programming Assessment',
    'Programming — MCQ + Programming Assessment',
    'MCQ Only — MCQ'
]);

const flowByOption = Object.freeze({
    [ASSESSMENT_FLOW_OPTIONS[0]]: ASSESSMENT_FLOWS.QA,
    [ASSESSMENT_FLOW_OPTIONS[1]]: ASSESSMENT_FLOWS.PROGRAMMING,
    [ASSESSMENT_FLOW_OPTIONS[2]]: ASSESSMENT_FLOWS.NONE
});

const optionByFlow = Object.freeze({
    [ASSESSMENT_FLOWS.QA]: ASSESSMENT_FLOW_OPTIONS[0],
    [ASSESSMENT_FLOWS.PROGRAMMING]: ASSESSMENT_FLOW_OPTIONS[1],
    [ASSESSMENT_FLOWS.NONE]: ASSESSMENT_FLOW_OPTIONS[2]
});

export const getAssessmentFlowFromOption = (option) => (
    flowByOption[option] || ASSESSMENT_FLOWS.PROGRAMMING
);

export const getAssessmentFlowOption = (flow) => (
    optionByFlow[flow] || optionByFlow[ASSESSMENT_FLOWS.PROGRAMMING]
);

export const getAssessmentFlowLabel = (flow) => {
    switch (flow) {
        case ASSESSMENT_FLOWS.QA:
            return 'QA Assessment → Programming Assessment';
        case ASSESSMENT_FLOWS.NONE:
            return 'MCQ only';
        default:
            return 'MCQ → Programming Assessment';
    }
};
