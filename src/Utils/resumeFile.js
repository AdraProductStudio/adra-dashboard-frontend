export const RESUME_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const RESUME_MAX_SIZE_LABEL = "5 MB";

export const formatFileSize = (bytes) => {
    const size = Number(bytes) || 0;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

// Returns an error message, or null when the file is acceptable.
export const validateResumeFile = (file) => {
    if (!file) return "Please choose a resume file";
    const isPdf = file.type === "application/pdf" && /\.pdf$/i.test(file.name || "");
    if (!isPdf) return "Invalid file format. Only PDF resumes are allowed.";
    if (file.size === 0) return "The selected file is empty.";
    if (file.size > RESUME_MAX_SIZE_BYTES) {
        return `File is too large (${formatFileSize(file.size)}). Resume must not exceed ${RESUME_MAX_SIZE_LABEL}.`;
    }
    return null;
};
