/**
 * Main JavaScript for index.html
 * Handles dynamic content loading from Google Sheets
 */

// Navigation scroll effect
const nav = document.getElementById("navbar");
const splashHeight = document.querySelector(".splash").offsetHeight;

window.addEventListener("scroll", () => {
  if (window.scrollY > splashHeight - 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// Initialize page with data from Google Sheets
async function initializePage() {
  try {
    const data = await window.dataService.getAllData();
    
    // Update biography
    if (data.biography && data.biography.text) {
      updateBiography(data.biography.text);
    }
    
    // Update events
    if (data.events && data.events.length > 0) {
      updateEvents(data.events);
    }
  } catch (error) {
    console.error('Error loading page data:', error);
  }
}

// Update biography section
function updateBiography(bioText) {
  const bioSection = document.querySelector('#bio p');
  if (bioSection && bioText) {
    bioSection.textContent = bioText;
  }
}

// Update events section
function updateEvents(events) {
  const eventsSection = document.querySelector('#events');
  if (!eventsSection) return;
  
  // Find the container after the h2
  const h2 = eventsSection.querySelector('h2');
  if (!h2) return;
  
  // Remove all existing event items
  const existingEvents = eventsSection.querySelectorAll('.event-item');
  existingEvents.forEach(event => event.remove());
  
  // Add new events
  events.forEach(event => {
    const eventItem = createEventElement(event);
    eventsSection.appendChild(eventItem);
  });
}

// Create event element
function createEventElement(event) {
  const eventItem = document.createElement('div');
  eventItem.className = 'event-item';
  
  const title = document.createElement('div');
  title.className = 'event-title';
  title.textContent = event.title;
  eventItem.appendChild(title);
  
  const details = document.createElement('div');
  details.className = 'event-details';
  
  // Location
  if (event.location) {
    const locationLabel = document.createElement('span');
    locationLabel.className = 'event-label';
    locationLabel.textContent = 'LOCATION:';
    details.appendChild(locationLabel);
    
    const locationValue = document.createElement('span');
    locationValue.className = 'event-value';
    
    // Create Google Maps link
    const locationLink = document.createElement('a');
    locationLink.href = `https://maps.google.com/?q=${encodeURIComponent(event.location)}`;
    locationLink.target = '_blank';
    locationLink.textContent = event.location;
    locationValue.appendChild(locationLink);
    
    details.appendChild(locationValue);
  }
  
  // Date
  if (event.date) {
    const dateLabel = document.createElement('span');
    dateLabel.className = 'event-label';
    dateLabel.textContent = 'DATE:';
    details.appendChild(dateLabel);
    
    const dateValue = document.createElement('span');
    dateValue.className = 'event-value';
    dateValue.textContent = event.date;
    details.appendChild(dateValue);
  }
  
  // Time
  if (event.time) {
    const timeLabel = document.createElement('span');
    timeLabel.className = 'event-label';
    timeLabel.textContent = 'TIME:';
    details.appendChild(timeLabel);
    
    const timeValue = document.createElement('span');
    timeValue.className = 'event-value';
    timeValue.textContent = event.time;
    details.appendChild(timeValue);
  }
  
  // Additional notes
  if (event.notes) {
    const notesLabel = document.createElement('span');
    notesLabel.className = 'event-label';
    notesLabel.textContent = 'NOTES:';
    details.appendChild(notesLabel);
    
    const notesValue = document.createElement('span');
    notesValue.className = 'event-value';
    notesValue.textContent = event.notes;
    details.appendChild(notesValue);
  }
  
  eventItem.appendChild(details);
  return eventItem;
}

// Form validation and submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Clear previous errors
  document.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('error');
  });
  
  let isValid = true;
  
  // Validate name
  const name = document.getElementById('name');
  if (!name.value.trim()) {
    name.closest('.form-group').classList.add('error');
    isValid = false;
  }
  
  // Validate email
  const email = document.getElementById('email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value)) {
    email.closest('.form-group').classList.add('error');
    isValid = false;
  }
  
  // Validate instrument
  const instrument = document.getElementById('instrument');
  if (!instrument.value) {
    instrument.closest('.form-group').classList.add('error');
    isValid = false;
  }
  
  if (isValid) {
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
      // Submit form data to Google Sheets
      const formData = {
        name: name.value.trim(),
        email: email.value.trim(),
        instrument: instrument.value,
        inquiryType: document.getElementById('inquiryType').value,
        message: document.getElementById('message').value.trim()
      };
      
      const result = await window.dataService.submitContactForm(formData);
      
      if (result.success) {
        alert(result.message);
        contactForm.reset();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again later.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
});

// Initialize page when DOM and data service are ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}
