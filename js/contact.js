// Contact page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    initContactForm();
});

// Initialize Leaflet Map
function initMap() {
    // SKIT coordinates (approximate location in Jaipur)
    const skitLocation = [26.9124, 75.7873];
    
    // Initialize map
    const map = L.map('map').setView(skitLocation, 15);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Custom marker icon
    const customIcon = L.divIcon({
        html: '<i class="fas fa-map-marker-alt" style="color: #3498db; font-size: 30px;"></i>',
        iconSize: [30, 30],
        className: 'custom-div-icon'
    });
    
    // Add marker for SKIT
    const marker = L.marker(skitLocation, { icon: customIcon }).addTo(map);
    
    // Add popup to marker
    marker.bindPopup(`
        <div style="text-align: center; padding: 10px;">
            <h3 style="margin: 0 0 10px 0; color: #2c3e50;">SKIT</h3>
            <p style="margin: 0; color: #666;">Swami Keshvanand Institute of Technology</p>
            <p style="margin: 5px 0 0 0; color: #666;">Jaipur, Rajasthan</p>
        </div>
    `).openPopup();
    
    // Add circle to show campus area
    L.circle(skitLocation, {
        color: '#3498db',
        fillColor: '#3498db',
        fillOpacity: 0.1,
        radius: 500
    }).addTo(map);
    
    // Add map controls
    map.addControl(new L.Control.Fullscreen());
}

// Initialize Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

// Handle contact form submission
async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Store original button text
    const originalButtonText = submitButton.textContent;
    
    // Show loading state
    setButtonLoading(submitButton, true);
    
    try {
        // Simulate form submission (replace with actual API call)
        await simulateFormSubmission(formData);
        
        // Show success message
        showMessage('Thank you for your message! We will get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        // Reset button state
        setButtonLoading(submitButton, false);
        submitButton.textContent = originalButtonText;
    }
}

// Simulate form submission (replace with actual API call)
function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate success (90% success rate)
            if (Math.random() > 0.1) {
                console.log('Form data:', Object.fromEntries(formData));
                resolve();
            } else {
                reject(new Error('Simulated network error'));
            }
        }, 2000);
    });
}

// Add custom CSS for map
const mapStyle = document.createElement('style');
mapStyle.textContent = `
    .custom-div-icon {
        background: transparent;
        border: none;
    }
    
    .leaflet-popup-content-wrapper {
        border-radius: 10px;
    }
    
    .leaflet-popup-tip {
        background: white;
    }
    
    .leaflet-control-fullscreen a {
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNyAxNEg1djVoNXYtMkg3di0zem0tMi00aDJWN2gzVjVINXY1em0xMiA3aC0zdjJoNXYtNWgtMnYzek0xNCA1djJoM3YzaDJWNWgtNXoiLz48L3N2Zz4=');
    }
    
    .leaflet-control-fullscreen.leaflet-control-fullscreen-on a {
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNSAxNmgzdjNoMnYtNUg1djJ6bTMtOEg1djJoNVY1SDh2M3ptNiAxMWgydi0zaDN2LTJoLTV2NXptMi0xMVY1aC0ydjVoNVY4aC0zeiIvPjwvc3ZnPg==');
    }
`;
document.head.appendChild(mapStyle);