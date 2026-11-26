// Shared helpers + validation that mirrors the backend rules (src/utils/employeeValidators.js on the API).
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;
export const PHOTO_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
export const DOCUMENT_EXTENSIONS = ["pdf", "docx", "doc", "jpg", "png"];
export const MAX_VALUE_LENGTH = 200;
export const MAX_LONG_VALUE_LENGTH = 500;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// "2024-07-15" -> "15-07-2024"
export const formatDate = (iso) => {
    if (!iso) return "";
    const [y, m, d] = String(iso).slice(0, 10).split("-");
    return y && m && d ? `${d}-${m}-${y}` : "";
};

// "2024-07-15" -> "July 15, 2024"
export const formatLongDate = (iso) => {
    if (!iso) return "";
    const [y, m, d] = String(iso).slice(0, 10).split("-");
    return y && m && d ? `${MONTHS[Number(m) - 1]} ${Number(d)}, ${y}` : "";
};

export const todayIso = () => new Date().toISOString().slice(0, 10);

export const periodBadgeClass = (name = "") => (name.toLowerCase() === "intern" ? "emp-badge emp-badge--intern" : "emp-badge emp-badge--default");

export const fileExtension = (file) => (file?.name?.split(".").pop() || "").toLowerCase();

export const formatSize = (bytes) => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

export const validateFile = (file, { extensions, maxBytes, label }) => {
    if (!file) return `${label} is required`;
    if (!extensions.includes(fileExtension(file))) return `Invalid file type. Allowed formats: ${extensions.join(", ")}.`;
    if (file.size === 0) return `${label} is empty.`;
    if (file.size > maxBytes) return `${label} is too large. Maximum size is ${Math.round(maxBytes / 1048576)} MB.`;
    return "";
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const validIsoDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`)) && new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v;

export const validateEmail = (v) => (!v.trim() ? "Email ID is required" : EMAIL_RE.test(v.trim()) ? "" : "Please enter a valid email address");
export const validatePhone = (v) => {
    const s = v.trim();
    const digits = s.replace(/\D/g, "");
    if (!s) return "Phone number is required";
    return /^\+?[0-9 ()-]+$/.test(s) && digits.length >= 7 && digits.length <= 15 ? "" : "Please enter a valid phone number";
};

export const validateEmployeeForm = (v, { photoRequired }) => {
    const e = {};
    if (!v.full_name.trim()) e.full_name = "Full name is required";
    else if (v.full_name.trim().length > 80) e.full_name = "Full name must not exceed 80 characters";
    const em = validateEmail(v.email); if (em) e.email = em;
    const ph = validatePhone(v.phone); if (ph) e.phone = ph;
    if (!v.department) e.department = "Department is required";
    if (!v.job_role) e.job_role = "Job role is required";
    if (!v.joining_date) e.joining_date = "Joining date is required";
    else if (!validIsoDate(v.joining_date)) e.joining_date = "Joining date must be a valid date";
    if (v.contract_period.length > 60) e.contract_period = "Contract period must not exceed 60 characters";
    if (v.photo) { const pe = validateFile(v.photo, { extensions: PHOTO_EXTENSIONS, maxBytes: PHOTO_MAX_BYTES, label: "Photo" }); if (pe) e.photo = pe; }
    else if (photoRequired) e.photo = "Employee photo is required";
    return e;
};

// Format rules of the default fields (same as the API). Only applied to non-empty values.
export const applyRule = (rule, label, value) => {
    switch (rule) {
        case "email": return validateEmail(value);
        case "phone10": return /^\d{10}$/.test(value) ? "" : `${label} must be a 10-digit number`;
        case "pincode": return /^\d{6}$/.test(value) ? "" : `${label} must be a 6-digit pincode`;
        case "ifsc": return /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(value) ? "" : `${label} must be a valid IFSC code (e.g. SBIN0001234)`;
        case "account": return /^\d{9,18}$/.test(value) ? "" : `${label} must be 9 to 18 digits`;
        case "amount": return /^[\d,]+(\.\d{1,2})?$/.test(value) ? "" : `${label} must be a non-negative amount`;
        case "past_date": return new Date(`${value}T00:00:00Z`) > new Date() ? `${label} cannot be in the future` : "";
        default: return "";
    }
};

// Validates one dynamic field value. `field` comes from the API definition.
export const validateFieldValue = (field, raw) => {
    const value = (raw ?? "").toString().trim();
    if (!value) return field.required ? `${field.label} is required` : "";
    if (field.type === "dropdown") return field.options.includes(value) ? "" : `${field.label} must be one of the available options`;
    if (field.type === "date") return validIsoDate(value) ? applyRule(field.rule, field.label, value) : `${field.label} must be a valid date`;
    if (field.rule) { const m = applyRule(field.rule, field.label, value); if (m) return m; }
    if (field.source_key === "email") return validateEmail(value);
    if (field.source_key === "phone") return validatePhone(value);
    return value.length > MAX_LONG_VALUE_LENGTH ? `${field.label} must not exceed ${MAX_LONG_VALUE_LENGTH} characters` : "";
};

// Opens a file link returned by the API. data: URLs (local dev storage) are converted to a blob first.
export const openFileUrl = async (url, { download = false, fileName = "file" } = {}) => {
    let href = url;
    let revoke = null;
    if (url.startsWith("data:")) {
        const blob = await (await fetch(url)).blob();
        href = URL.createObjectURL(blob);
        revoke = href;
    }
    if (download) {
        const a = document.createElement("a");
        a.href = href;
        a.download = fileName;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
    } else {
        window.open(href, "_blank", "noopener");
    }
    if (revoke) setTimeout(() => URL.revokeObjectURL(revoke), 60000);
};

// Job Type dropdown: fixed display order and labels (matched case-insensitively against the lookup names).
export const JOB_TYPES = ["Permanent", "Full-time", "Probationary", "Part-time", "Contract", "Intern"];
export const jobTypeOpts = (list = []) => {
    const norm = (n) => String(n).trim().toLowerCase();
    const rank = (n) => { const i = JOB_TYPES.findIndex((t) => norm(t) === norm(n)); return i < 0 ? JOB_TYPES.length : i; };
    return [...list].sort((a, b) => rank(a.name) - rank(b.name))
        .map((x) => ({ value: x._id, label: rank(x.name) < JOB_TYPES.length ? JOB_TYPES[rank(x.name)] : x.name }));
};
