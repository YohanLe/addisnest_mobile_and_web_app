

export const validateEmail = (email) => {
    if (!email) {
        return false
    }
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


export const ValidateSignup = (obj) => {
    const errors = {};
    if (!obj.name) {
        errors.name = 'Please enter your full name';
    }
    if (!validateEmail(obj.email)) {
        errors.email = 'Please enter your valid email id';
    }
    if (!obj.password) {
        errors.password = 'Please enter your Password';
    }
    if (obj.password?.length<8) {
        errors.password = "Password should be at least 8 characters.";
    } 
    if (!obj.confirm_password) {
        errors.confirm_password = 'Please enter the confirm Password';
    }
    if (obj.confirm_password && obj.password && obj.password != obj.confirm_password) {
        errors.confirm_password = 'Password and confirm password does not match';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
};


export const ValidateForgotPassword = (obj) => {
    const errors = {};
    if (!obj.new_password) {
        errors.new_password = "Please enter new password.";
    }
    if (obj.new_password?.length<8) {
        errors.new_password = "Password should be at least 8 characters.";
    } 
    if (!obj.confirm_new_password) {
        errors.confirm_new_password = "Please confirm your password.";
    }
    if (obj.new_password!==obj.confirm_new_password) {
        errors.confirm_new_password = "New password and confirm password does not matched.";
    }
    return {
        isValid: Object.keys(errors).length===0,
        errors: errors
    };
}


export const ValidateAgentSignup = (obj) => {
    console.log("8 obj", obj);
    const errors = {};
    if (!obj.fullName) {
        errors.fullName = 'Please enter your full name';
    }
    if (!obj.companyName) {
        errors.companyName = 'Please enter your company name';
    }
    if (!obj.phoneNumber) {
        errors.phoneNumber = 'Please enter your nhone number';
    }
    
    if (!obj.country_name) {
        errors.country_name = 'Please select your country name';
    }
    if (!validateEmail(obj.businessEmail)) {
        errors.businessEmail = 'Please enter your valid email-id';
    }
    if (!obj.travelAgencyLicenceNumber) {
        errors.travelAgencyLicenceNumber = 'Please enter your licence number';
    }
    if (!obj.password) {
        errors.password = 'Please enter your password';
    }
    if (obj.password.length < 8) {
        errors.password = "Please enter the password at least 8 characters.";
    }
    if (!obj.confirmPassword) {
        errors.confirmPassword = 'Please enter the confirm password';
    }
    if (obj.confirmPassword && obj.password && obj.password != obj.confirmPassword) {
        errors.confirmPassword = 'Password and confirm password does not match';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
};

export const validateLogin = (obj) => {
    const errors = {};
    if (!obj.email) {
        errors.email = 'Please enter valid email';
    }
    if (!obj.password) {
        errors.password = 'Please enter Password';
    }
    if (obj.password.length < 8) {
        errors.password = "Please enter the password at least 8 characters.";
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
};

export const ValidateContactus = (obj) => {
    const errors = {};
    if (!obj.email) {
        errors.email = 'Please enter valid email';
    }
    if (!obj.first_name) {
        errors.first_name = 'Please enter first name';
    }
    if (!obj.last_name) {
        errors.last_name = 'Please enter last name';
    }
    if (!obj.phone) {
        errors.phone = 'Please enter phone';
    }
    if (!obj.message) {
        errors.message = 'Please enter message';
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
};


export const validateForgot = (obj) => {
    const errors = {};
    if (!obj.email) {
        errors.email = 'Please enter email';
    }
    if (!validateEmail(obj.email)) {
        errors.email = 'Please enter valid email';
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
};

export const ValidateResetpassword = (obj) => {
    const errors = {};
    if (!obj.password) {
        errors.password = 'Please enter Password';
    }
    if (obj.password.length < 8) {
        errors.password = "Please enter the password at least 8 characters.";
    }
    if (!obj.confirm_password) {
        errors.confirm_password = 'Please enter confirm Password';
    }
    if (obj.confirm_password && obj.password && obj.password !== obj.confirm_password) {
        errors.confirm_password = 'Password And confirm password does not match';
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
};

export const ValidateProfileUpdate = (obj) => {
    const errors = {};
    if (!obj.fullName) {
        errors.fullName = 'Please enter full name';
    }
    if (!obj.companyName) {
        errors.companyName = "Please enter company's Email";
    }
    if (!obj.country_name) {
        errors.country_name = "Please select country name";
    }
    if (!obj.description) {
        errors.description = 'Please enter description';
    }
    if (!obj.jobTitle) {
        errors.jobTitle = 'Please enter job title';
    }
    if (!obj.businessAddress) {
        errors.businessAddress = 'Please enter address';
    }
    if (!obj.state) {
        errors.state = 'Please enter state';
    }
    if (!obj.zipCode) {
        errors.zipCode = 'Please enter zip code';
    }
    if (!obj.DOB) {
        errors.DOB = 'Please enter Date of Birth';
    }
    if (!obj.gender) {
        errors.gender = 'Please enter gender';
    }
    if (!obj.website) {
        errors.website = 'Please enter website';
    }
    if (!(obj.email)) {
        errors.email = 'Please enter email';
    }
    if (!validateEmail(obj.email)) {
        errors.email = 'Please enter valid email';
    }
    if (!obj.phone) {
        errors.phone = 'Please enter phone number';
    }
    if (!obj.agencyLicenseNumber) {
        errors.agencyLicenseNumber = "Please enter travel agency's licence number";
    }
    if (!obj.issuingAuthority) {
        errors.issuingAuthority = "Please enter issuing authority's name";
    }
    if (!obj.expiryDate) {
        errors.expiryDate = 'Please enter expiry date';
    }
    
    if (!obj.referenceName) {
        errors.referenceName = 'Please enter reference name';
    }
    if (!obj.businessAddress) {
        errors.businessAddress = 'Please enter address';
    }
    if (!obj.referencePhone) {
        errors.referencePhone = 'Please enter reference phone';
    }
    if (!obj.referenceEmail) {
        errors.referenceEmail = 'Please enter Reference email';
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
};

export const ValidateUserCusProfileUpdate = (obj) => {
    const errors = {};
    if (!obj.name) {
        errors.name = 'Please enter full name';
    }
    if (!obj.email) {
        errors.email = "Please enter email";
    }
    if (!validateEmail(obj.email)) {
        errors.email = 'Please enter valid email';
    }
    if (!obj.phone) {
        errors.phone = 'Please enter phone number';
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
};


export const ValidateChangePassword = (obj) => {
    const errors = {};
    if (!obj.old_password) {
        errors.old_password = "Please enter old password";
    }
    if (!obj.new_password) {
        errors.new_password = "Please enter new password";
    }
    if (obj.new_password.length < 8) {
        errors.new_password = "Please enter the password at least 8 characters.";
    }
    if (!obj.confirm_new_password) {
        errors.confirm_new_password = "Please enter confirm password";
    }
    if (obj.new_password !== obj.confirm_new_password) {
        errors.confirm_new_password = "New password and Confirm password does not matched!";
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };

}




export const ValidatePropertyForm = (obj) => {
    const errors = {};
    if (!obj.property_address) {
        errors.property_address = "Please enter property address";
    }
    if (!obj.regional_state) {
        errors.regional_state = "Please enter regional state";
    }
    if (!obj.city) {
        errors.city = "Please enter city";
    }
    if (!obj.country) {
        errors.country = "Please enter country";
    }
    if (!obj.total_price) {
        errors.total_price = "Please enter total price";
    }
    if (!obj.description) {
        errors.description = "Please enter description";
    }
    if (!obj.property_size) {
        errors.property_size = "Please enter property size";
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };

}

