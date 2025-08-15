/**
 * Checks if any of the provided fields are missing or contain only whitespace.
 * @param  {...(string|undefined|null)} fields - One or more values to check.
 * @returns {boolean} Returns 'true' if any field is missing (null, undefined, empty string),
 * or contains only whitespace, otherwise returns false.
 * 
 * @example
 * isMissing('test', '');           // true
 * isMissing('hello', 'world');     // false
 * isMissing('  ', 'abc');          // true
 */
const isMissing = (...fields) => {
    return fields.some(f => !f?.trim());
};

module.exports = { isMissing }