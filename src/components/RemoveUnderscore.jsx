export const formatCategory = (text) => {
    if (!text) return "";
    return text
        .replace(/_/g, " ") // replace underscores with space
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};