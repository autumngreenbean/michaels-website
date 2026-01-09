/**
 * Configuration file for Michael Rodenkirch Website
 * 
 * SETUP INSTRUCTIONS:
 * 1. Deploy the Google Apps Script (Code.gs) as a Web App
 * 2. Copy the Web App URL you receive
 * 3. Paste it below in the GOOGLE_SCRIPT_URL constant
 * 
 * The URL should look like:
 * https://script.google.com/macros/s/AKfycby.../exec
 */

const CONFIG = {
  // Replace this with your deployed Google Apps Script Web App URL
  GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzjB5CXwU_k9RVgpf8FXb91JRfqrx3Q8R0_6gbcpWU4HSJKciXVAsyJebuWCHxj9XUT/exec',
  
  // Cache duration in milliseconds (5 minutes default)
  CACHE_DURATION: 5 * 60 * 1000,
  
  // Enable/disable Google Sheets integration
  USE_GOOGLE_SHEETS: true
};

// Export for use in other files
window.CONFIG = CONFIG;
