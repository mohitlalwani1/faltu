// Registration form specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initRegistrationForm();
    initFormEnhancements();
});

// Initialize registration form
function initRegistrationForm() {
    const registrationForm = document.getElementById('registrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistrationSubmit);
        
        // Add real-time validation
        addRealTimeValidation();
        
        // Add form progress indicator
        addProgressIndicator();
    }
}

// Handle registration form submission
async function handleRegistrationSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Store original button text
    const originalButtonText = submitButton.innerHTML;
    
    // Validate form before submission
    if (!validateRegistrationForm(form)) {
        showMessage('Please correct the errors in the form before submitting.', 'error');
        return;
    }
    
    // Show loading state
    setButtonLoading(submitButton, true);
    
    try {
        // Simulate form submission (replace with actual API call)
        await simulateRegistrationSubmission(formData);
        
        // Show success message
        showMessage('Registration successful! You will receive a confirmation email shortly.', 'success');
        
        // Optionally redirect to success page
        setTimeout(() => {
            // window.location.href = 'registration-success.html';
        }, 3000);
        
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('Registration failed. Please try again or contact support.', 'error');
    } finally {
        // Reset button state
        setButtonLoading(submitButton, false);
        submitButton.innerHTML = originalButtonText;
    }
}

// Validate registration form
function validateRegistrationForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Additional custom validations
    if (!validateAge()) isValid = false;
    if (!validatePhoneNumbers()) isValid = false;
    if (!validatePercentage()) isValid = false;
    
    return isValid;
}

// Validate age (must be between 16-25 for engineering)
function validateAge() {
    const dobField = document.getElementById('dob');
    if (!dobField.value) return true; // Will be caught by required validation
    
    const dob = new Date(dobField.value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    if (age < 16 || age > 25) {
        showFieldError(dobField, 'Age must be between 16 and 25 years');
        return false;
    }
    
    return true;
}

// Validate phone numbers
function validatePhoneNumbers() {
    const phoneField = document.getElementById('phone');
    const parentPhoneField = document.getElementById('parentPhone');
    let isValid = true;
    
    if (phoneField.value && !isValidIndianPhone(phoneField.value)) {
        showFieldError(phoneField, 'Please enter a valid Indian phone number');
        isValid = false;
    }
    
    if (parentPhoneField.value && !isValidIndianPhone(parentPhoneField.value)) {
        showFieldError(parentPhoneField, 'Please enter a valid Indian phone number');
        isValid = false;
    }
    
    return isValid;
}

// Validate percentage
function validatePercentage() {
    const percentageField = document.getElementById('class12Percentage');
    if (!percentageField.value) return true;
    
    const percentage = parseFloat(percentageField.value);
    if (percentage < 75) {
        showFieldError(percentageField, 'Minimum 75% required in 12th standard');
        return false;
    }
    
    return true;
}

// Validate Indian phone number
function isValidIndianPhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const indianPhoneRegex = /^(\+91|91|0)?[6789]\d{9}$/;
    return indianPhoneRegex.test(cleanPhone);
}

// Add real-time validation
function addRealTimeValidation() {
    // Phone number formatting
    const phoneFields = document.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
        field.addEventListener('input', function() {
            this.value = formatIndianPhone(this.value);
        });
    });
    
    // Name fields - only letters and spaces
    const nameFields = document.querySelectorAll('#firstName, #lastName, #fatherName, #motherName');
    nameFields.forEach(field => {
        field.addEventListener('input', function() {
            this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
        });
    });
    
    // PIN code - only 6 digits
    const pincodeField = document.getElementById('pincode');
    if (pincodeField) {
        pincodeField.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 6);
        });
    }
    
    // Percentage validation
    const percentageField = document.getElementById('class12Percentage');
    if (percentageField) {
        percentageField.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (value > 100) this.value = '100';
            if (value < 0) this.value = '0';
        });
    }
    
    // JEE Score validation
    const jeeField = document.getElementById('jeeScore');
    if (jeeField) {
        jeeField.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (value > 300) this.value = '300';
            if (value < 0) this.value = '0';
        });
    }
}

// Format Indian phone number
function formatIndianPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length <= 10) {
        return cleaned;
    }
    
    // Handle +91 prefix
    if (cleaned.startsWith('91') && cleaned.length === 12) {
        return cleaned.slice(2);
    }
    
    return cleaned.slice(0, 10);
}

// Add progress indicator
function addProgressIndicator() {
    const formSections = document.querySelectorAll('.form-section');
    const progressContainer = document.createElement('div');
    progressContainer.className = 'form-progress';
    progressContainer.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
        </div>
        <div class="progress-text">Form Progress: 0%</div>
    `;
    
    const form = document.getElementById('registrationForm');
    form.insertBefore(progressContainer, form.firstChild);
    
    // Update progress on input
    const allInputs = form.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
    });
    
    function updateProgress() {
        const requiredFields = form.querySelectorAll('[required]');
        const filledFields = Array.from(requiredFields).filter(field => {
            if (field.type === 'checkbox') {
                return field.checked;
            }
            return field.value.trim() !== '';
        });
        
        const progress = Math.round((filledFields.length / requiredFields.length) * 100);
        const progressFill = progressContainer.querySelector('.progress-fill');
        const progressText = progressContainer.querySelector('.progress-text');
        
        progressFill.style.width = progress + '%';
        progressText.textContent = `Form Progress: ${progress}%`;
        
        // Change color based on progress
        if (progress < 30) {
            progressFill.style.backgroundColor = '#e74c3c';
        } else if (progress < 70) {
            progressFill.style.backgroundColor = '#f39c12';
        } else {
            progressFill.style.backgroundColor = '#27ae60';
        }
    }
}

// Initialize form enhancements
function initFormEnhancements() {
    // Auto-capitalize names
    const nameFields = document.querySelectorAll('#firstName, #lastName, #fatherName, #motherName, #city, #state');
    nameFields.forEach(field => {
        field.addEventListener('blur', function() {
            this.value = this.value.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ');
        });
    });
    
    // Course selection enhancement
    const courseSelect = document.getElementById('course');
    if (courseSelect) {
        courseSelect.addEventListener('change', function() {
            showCourseInfo(this.value);
        });
    }
}

// Show course information
function showCourseInfo(courseValue) {
    const courseInfo = {
        'cse': 'Computer Science Engineering - Focus on programming, software development, and emerging technologies.',
        'ece': 'Electronics & Communication - Study of electronic circuits, communication systems, and signal processing.',
        'me': 'Mechanical Engineering - Learn about mechanics, thermodynamics, and manufacturing processes.',
        'ce': 'Civil Engineering - Construction, structural design, and infrastructure development.',
        'ee': 'Electrical Engineering - Power systems, electrical machines, and renewable energy.',
        'che': 'Chemical Engineering - Chemical processes, materials science, and biotechnology.'
    };
    
    // Remove existing info
    const existingInfo = document.querySelector('.course-info');
    if (existingInfo) {
        existingInfo.remove();
    }
    
    if (courseValue && courseInfo[courseValue]) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'course-info';
        infoDiv.innerHTML = `
            <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin-top: 10px; border-left: 4px solid #3498db;">
                <strong>Course Information:</strong><br>
                ${courseInfo[courseValue]}
            </div>
        `;
        
        const courseSelect = document.getElementById('course');
        courseSelect.parentNode.appendChild(infoDiv);
    }
}

// Simulate registration submission
function simulateRegistrationSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Log form data for debugging
            const data = Object.fromEntries(formData);
            console.log('Registration data:', data);
            
            // Simulate success (95% success rate)
            if (Math.random() > 0.05) {
                resolve({
                    success: true,
                    applicationId: 'SKIT' + Date.now(),
                    message: 'Registration successful'
                });
            } else {
                reject(new Error('Registration failed'));
            }
        }, 3000);
    });
}

// Add CSS for progress indicator
const progressStyle = document.createElement('style');
progressStyle.textContent = `
    .form-progress {
        margin-bottom: 30px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 10px;
        text-align: center;
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 10px;
    }
    
    .progress-fill {
        height: 100%;
        background: #3498db;
        transition: width 0.3s ease, background-color 0.3s ease;
        border-radius: 4px;
    }
    
    .progress-text {
        font-size: 14px;
        color: #666;
        font-weight: 500;
    }
    
    .course-info {
        animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(progressStyle);