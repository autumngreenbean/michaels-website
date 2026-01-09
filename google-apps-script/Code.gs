/**
 * Google Apps Script for Michael Rodenkirch Website
 * 
 * SETUP INSTRUCTIONS:
 * 1. In Google Sheets, go to Extensions > Apps Script
 * 2. Delete any existing code and paste this entire file
 * 3. Save the script
 * 4. Click "Run" > "initializeSheets" to set up the sheet structure automatically
 * 5. Click "Deploy" > "New deployment"
 * 6. Select type: "Web app"
 * 7. Execute as: "Me"
 * 8. Who has access: "Anyone"
 * 9. Click "Deploy" and copy the Web App URL
 * 10. Paste that URL into config.js in your website
 * 
 * SHEET STRUCTURE (auto-created by initializeSheets function):
 * - Tab 1: "Biography Discography Events Video Links" - Main content
 * - Tab 2: "CONTACT SUBMISSIONS" - Form submissions (contact form data will be written here)
 * - Tab 3: "EVENTS" - Event listings
 */

/**
 * Run this function ONCE to automatically set up your sheet structure
 * Go to: Run > initializeSheets
 */
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create or get Tab 1: Biography Discography Events Video Links
  let tab1 = ss.getSheetByName('Biography Discography Events Video Links');
  if (!tab1) {
    // Create new sheet or rename first sheet
    const sheets = ss.getSheets();
    if (sheets.length === 1 && sheets[0].getName() === 'Sheet1') {
      tab1 = sheets[0].setName('Biography Discography Events Video Links');
    } else {
      tab1 = ss.insertSheet('Biography Discography Events Video Links');
    }
  }
  
  // Set up Tab 1 structure
  setupTab1(tab1);
  
  // Create or get Tab 2: CONTACT SUBMISSIONS
  let tab2 = ss.getSheetByName('CONTACT SUBMISSIONS');
  if (!tab2) {
    tab2 = ss.insertSheet('CONTACT SUBMISSIONS');
  }
  
  // Set up Tab 2 structure
  setupTab2(tab2);
  
  // Create or get Tab 3: EVENTS
  let tab3 = ss.getSheetByName('EVENTS');
  if (!tab3) {
    tab3 = ss.insertSheet('EVENTS');
  }
  
  // Set up Tab 3 structure
  setupTab3(tab3);
  
  // Success message
  SpreadsheetApp.getUi().alert(
    'Sheet Setup Complete!',
    'Your sheet structure has been created with:\n\n' +
    '✅ Biography Discography Events Video Links\n' +
    '✅ CONTACT SUBMISSIONS\n' +
    '✅ EVENTS\n\n' +
    'You can now add your content and deploy the web app!',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Set up Tab 1: Biography Discography Events Video Links
 */
function setupTab1(sheet) {
  // Clear existing content
  sheet.clear();
  
  // Set column widths
  sheet.setColumnWidth(1, 120);  // Column A
  sheet.setColumnWidth(2, 400);  // Column B
  sheet.setColumnWidth(3, 100);  // Column C
  sheet.setColumnWidth(4, 200);  // Column D
  
  // DISCOGRAPHY SECTION (Rows 1-10)
  sheet.getRange('A1').setValue('Discography').setFontWeight('bold');
  sheet.getRange('B1').setValue('Title').setFontWeight('bold');
  sheet.getRange('C1').setValue('Year').setFontWeight('bold');
  sheet.getRange('D1').setValue('Association').setFontWeight('bold');
  
  // Add sample discography data
  const sampleDiscography = [
    ['Live at the Churchill School', '2021', 'Rob Scheps and the TBA Band'],
    ['Just Us, Just We', '2021', 'Shaymus Hanlin Quartet'],
    ['M.J. LIVE! Volume 2 (Trio Sessions)', '2023', 'M.J. Johnston'],
    ['Introducing the Jonathan Arcangel Quartet', '2023', 'Jonathan Arcangel'],
    ['The Stuff of Dreams', '2024', 'M.J. Johnston'],
    ['Live at Blue Butler', '2025', 'Wyatt Button']
  ];
  sheet.getRange(2, 2, sampleDiscography.length, 3).setValues(sampleDiscography);
  
  // BIOGRAPHY SECTION (Row 11)
  sheet.getRange('A11').setValue('Biography').setFontWeight('bold').setFontSize(12);
  const bioText = 'Michael Rodenkirch is a drummer, arranger, composer, and educator based in Portland, OR. ' +
    'He graduated from the University of North Texas in the winter of 2024 with a Bachelor of Arts degree in Music with a minor in History. ' +
    'Michael has a plethora of playing experience playing anything from musicals to playing jazz festivals. ' +
    'He has studied with many great musicians including Alan Jones, Quincy Davis, Richard DeRosa, and Chuck Israels. ' +
    'Since graduating, Michael has played as a member of the Chuck Israels trio and the Chuck Israels Orchestra. ' +
    'Through that experience and others, Michael has shared the stage playing with Portland legends such as Randy Porter, Joe Bagg, David Evans, Paul Mazzio, George Colligan, Darrell Grant, Kerry Politzer, Quinn Walker, Kiran Raphael, Wyatt Button, David Barber, and many more. ' +
    'As an educator, Michael has taught private lessons for 8 years. He teaches drum set, piano, guitar, music theory, and composition. ' +
    'He currently teaches at Lakeridge High School and Grant High School as a rhythm section coach.';
  
  // Merge cells B11:I23 for biography
  sheet.getRange('B11:I23').merge().setValue(bioText).setWrap(true).setVerticalAlignment('top');
  
  // VIDEO LINKS SECTION (Starting at Row 25)
  sheet.getRange('A25').setValue('Portfolio Videos').setFontWeight('bold').setFontSize(12);
  sheet.getRange('B25').setValue('YouTube Video ID').setFontWeight('bold');
  sheet.getRange('C25').setValue('Video Title').setFontWeight('bold');
  
  // Add sample videos
  const sampleVideos = [
    ['zpt7ffA5-Wc', 'Drum Set senior recital Mixed'],
    ['6dyFDNnSiY4', 'Laverne Walk'],
    ['11KM_ZOdqhA', 'White Christmas - The Rob Scheps Quartet'],
    ['BOV5sTbQxkQ', 'Para Volar'],
    ['P2xUt77qvDI', 'Lullaby in Blue (Concert Choir); MWC Concert'],
    ['aOg7lmnAd5E', 'The Song Is You']
  ];
  sheet.getRange(26, 2, sampleVideos.length, 2).setValues(sampleVideos);
  
  // Format header rows
  sheet.getRange('A1:D1').setBackground('#d9ead3');
  sheet.getRange('A11').setBackground('#c9daf8');
  sheet.getRange('A25:C25').setBackground('#fff2cc');
  
  // Freeze first row
  sheet.setFrozenRows(1);
}

/**
 * Set up Tab 2: CONTACT SUBMISSIONS
 */
function setupTab2(sheet) {
  // Clear existing content
  sheet.clear();
  
  // Set column widths
  sheet.setColumnWidth(1, 150);  // Name
  sheet.setColumnWidth(2, 250);  // Email
  sheet.setColumnWidth(3, 120);  // Instrument
  sheet.setColumnWidth(4, 150);  // Inquiry Type
  sheet.setColumnWidth(5, 400);  // Additional Notes
  sheet.setColumnWidth(6, 180);  // Timestamp
  
  // Set headers
  const headers = [['Name', 'Email', 'Instrument', 'Inquiry Type', 'Additional Notes', 'Timestamp']];
  sheet.getRange('A1:F1').setValues(headers).setFontWeight('bold').setBackground('#f3f3f3');
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Set up Tab 3: EVENTS
 */
function setupTab3(sheet) {
  // Clear existing content
  sheet.clear();
  
  // Set column widths
  sheet.setColumnWidth(1, 250);  // Event
  sheet.setColumnWidth(2, 150);  // Location
  sheet.setColumnWidth(3, 120);  // Date
  sheet.setColumnWidth(4, 100);  // Time
  sheet.setColumnWidth(5, 300);  // Additional Notes
  
  // Set headers
  const headers = [['Event', 'Location', 'Date', 'Time', 'Additional Notes']];
  sheet.getRange('A1:E1').setValues(headers).setFontWeight('bold').setBackground('#f3f3f3');
  
  // Add sample events
  const sampleEvents = [
    ['SUNDAY AFTERNOON JAZZ', 'FOXTROT', 'JULY 13', '4PM', ''],
    ['SHAYMUS HAMLIN QUARTET', '1905', 'AUGUST 15', '10:15PM', '']
  ];
  sheet.getRange(2, 1, sampleEvents.length, 5).setValues(sampleEvents);
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

function doGet(e) {
  const action = e.parameter.action || 'getAllData';
  
  try {
    switch(action) {
      case 'getAllData':
        return ContentService.createTextOutput(JSON.stringify(getAllData()))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'getBiography':
        return ContentService.createTextOutput(JSON.stringify(getBiography()))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'getDiscography':
        return ContentService.createTextOutput(JSON.stringify(getDiscography()))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'getEvents':
        return ContentService.createTextOutput(JSON.stringify(getEvents()))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'getVideos':
        return ContentService.createTextOutput(JSON.stringify(getVideos()))
          .setMimeType(ContentService.MimeType.JSON);
      
      default:
        return ContentService.createTextOutput(JSON.stringify({
          error: 'Invalid action'
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'submitContact';
    
    if (action === 'submitContact') {
      return ContentService.createTextOutput(JSON.stringify(submitContactForm(data)))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get all website data in one request
 */
function getAllData() {
  return {
    biography: getBiography(),
    discography: getDiscography(),
    events: getEvents(),
    videos: getVideos(),
    timestamp: new Date().toISOString()
  };
}

/**
 * Get biography text from the sheet
 * Expected format: Cell B11 contains the biography text
 */
function getBiography() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Biography Discography Events Video Links');
  if (!sheet) {
    throw new Error('Sheet "Biography Discography Events Video Links" not found');
  }
  
  // Biography is in cell B11 (merged B11:I23 in your export)
  const bioText = sheet.getRange('B11').getValue();
  
  return {
    text: bioText || ''
  };
}

/**
 * Get discography entries
 * Expected format: Starting at row 2, columns B (Title), C (Year), D (Association)
 */
function getDiscography() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Biography Discography Events Video Links');
  if (!sheet) {
    throw new Error('Sheet "Biography Discography Events Video Links" not found');
  }
  
  // Get discography data starting from row 2
  // Row 1 has headers: Title, Year, Association
  const dataRange = sheet.getRange('B2:D50'); // Adjust range as needed
  const values = dataRange.getValues();
  
  const discography = [];
  
  for (let i = 0; i < values.length; i++) {
    const [title, year, association] = values[i];
    
    // Stop at first empty row
    if (!title && !year && !association) {
      break;
    }
    
    // Only add if at least title is present
    if (title) {
      discography.push({
        title: title.toString().trim(),
        year: year ? year.toString().trim() : '',
        association: association ? association.toString().trim() : ''
      });
    }
  }
  
  return discography;
}

/**
 * Get video links for portfolio
 * Expected format: Starting at row 25 (after bio section)
 * Columns: B (YouTube Video ID), C (Title/Description)
 */
function getVideos() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Biography Discography Events Video Links');
  if (!sheet) {
    throw new Error('Sheet "Biography Discography Events Video Links" not found');
  }
  
  // Get video data starting from row 25
  const dataRange = sheet.getRange('B25:C50'); // Adjust range as needed
  const values = dataRange.getValues();
  
  const videos = [];
  
  for (let i = 0; i < values.length; i++) {
    const [videoId, title] = values[i];
    
    // Stop at first empty row
    if (!videoId && !title) {
      break;
    }
    
    // Only add if video ID is present
    if (videoId) {
      videos.push({
        id: videoId.toString().trim(),
        title: title ? title.toString().trim() : 'Untitled Video'
      });
    }
  }
  
  return videos;
}

/**
 * Get events from the EVENTS sheet
 * Expected format: Columns A (Event), B (Location), C (Date), D (Time), E (Additional Notes)
 */
function getEvents() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('EVENTS');
  if (!sheet) {
    throw new Error('Sheet "EVENTS" not found');
  }
  
  // Get events starting from row 2 (row 1 has headers)
  const dataRange = sheet.getRange('A2:E50'); // Adjust range as needed
  const values = dataRange.getValues();
  
  const events = [];
  
  for (let i = 0; i < values.length; i++) {
    const [event, location, date, time, notes] = values[i];
    
    // Stop at first empty row
    if (!event && !location && !date) {
      break;
    }
    
    // Only add if event name is present
    if (event) {
      events.push({
        title: event.toString().trim(),
        location: location ? location.toString().trim() : '',
        date: date ? formatDate(date) : '',
        time: time ? time.toString().trim() : '',
        notes: notes ? notes.toString().trim() : ''
      });
    }
  }
  
  return events;
}

/**
 * Submit contact form data to the CONTACT SUBMISSIONS sheet
 */
function submitContactForm(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CONTACT SUBMISSIONS');
  if (!sheet) {
    throw new Error('Sheet "CONTACT SUBMISSIONS" not found');
  }
  
  // Append new row with form data
  // Columns: Name, Email, Instrument, Inquiry Type, Additional Notes
  sheet.appendRow([
    data.name || '',
    data.email || '',
    data.instrument || '',
    data.inquiryType || '',
    data.message || '',
    new Date().toLocaleString() // Add timestamp
  ]);
  
  return {
    success: true,
    message: 'Form submitted successfully'
  };
}

/**
 * Helper function to format dates consistently
 */
function formatDate(date) {
  if (!date) return '';
  
  // If already a string, return as is
  if (typeof date === 'string') {
    return date;
  }
  
  // If it's a Date object, format it
  if (date instanceof Date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  
  return date.toString();
}
