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
  GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzobJsLw3arG2Mon8lXKTkxbLd12D7_l9ACR5_59KbWxThpFINRtXFvLIwmVqGDYZM/exec',
  
  // Cache duration in milliseconds (5 minutes default)
  CACHE_DURATION: 5 * 60 * 1000,
  
  // Enable/disable Google Sheets integration
  USE_GOOGLE_SHEETS: true
};

// Export for use in other files
window.CONFIG = CONFIG;
