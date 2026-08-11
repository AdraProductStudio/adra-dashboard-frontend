export const CANDIDATE_STAGES = Object.freeze({
    MCQ: "mcq",
    PROGRAMMING_PREPARATION: "programming_preparation",
    PROGRAMMING_ASSESSMENT: "programming_assessment",
    QA_PREPARATION: "qa_preparation",
    QA_ASSESSMENT: "qa_assessment",
    COMPLETED: "completed"
});

const candidateStageRoutes = Object.freeze({
    [CANDIDATE_STAGES.MCQ]: "/candidates_home",
    [CANDIDATE_STAGES.PROGRAMMING_PREPARATION]: "/candidates_home/programming-preparation",
    [CANDIDATE_STAGES.PROGRAMMING_ASSESSMENT]: "/candidates_home/programming-assessment",
    [CANDIDATE_STAGES.QA_PREPARATION]: "/candidates_home/programming-preparation-qa",
    [CANDIDATE_STAGES.QA_ASSESSMENT]: "/candidates_home/qa-assessment",
    [CANDIDATE_STAGES.COMPLETED]: "/candidates_home/completed"
});

export const getCandidateStageRoute = (stage) => candidateStageRoutes[stage] || null;
