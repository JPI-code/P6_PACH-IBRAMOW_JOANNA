
const passwordValidator = require('password-validator');

// Create a Schema for more secure Password
const passwordSchema = new passwordValidator();

// Add properties to it
passwordSchema
.is().min(8)                                    // Minimun lenght : 8
.has().uppercase()                              // Must contain at least one uppercase letters
.has().lowercase()                              // Must contain at least one lowercase letters
.has().digits()                                 // Must contain digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these "weak" values

module.exports = passwordSchema;