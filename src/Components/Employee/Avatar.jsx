import React from "react";

// Placeholder avatar (inline SVG, no asset) shown until a real photo exists.
const PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='#e9ebf0'/><circle cx='50' cy='38' r='17' fill='#b4bac6'/><path d='M16 94c3-20 18-30 34-30s31 10 34 30z' fill='#b4bac6'/></svg>"
);

const Avatar = ({ src, alt, className = "", eager = false }) => (
    <img className={className} src={src || PLACEHOLDER} alt={alt || ""} loading={eager ? "eager" : "lazy"} onError={(e) => { if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER; }} />
);

export default Avatar;
