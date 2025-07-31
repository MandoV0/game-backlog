export const isMissing = (...fields) => {
    return fields.some(f => !f?.trim());
};