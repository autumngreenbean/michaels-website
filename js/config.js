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
  // Apps Script URL (only used for contact form submissions now)
  GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyXC6J33xRjrRXlLT3Zukpo2r02kv0qiMrYpKkY6v8N51-3zxgXif-95cdwLtNvLetm/exec',
  
  // Cache duration in milliseconds (5 minutes)
  // Website now loads from fast static JSON, updated automatically by Google Sheets!
  CACHE_DURATION: 5 * 60 * 1000
};

// Export for use in other files
window.CONFIG = CONFIG;
