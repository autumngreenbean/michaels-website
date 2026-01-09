/**
 * Data fetching service for Michael Rodenkirch Website
 * Handles all communication with Google Sheets via Apps Script
 */

class DataService {
  constructor() {
    this.cache = {
      data: null,
      timestamp: null
    };
  }

  /**
   * Check if cached data is still valid
   */
  isCacheValid() {
    if (!this.cache.data || !this.cache.timestamp) {
      return false;
    }
    const now = Date.now();
    return (now - this.cache.timestamp) < CONFIG.CACHE_DURATION;
  }

  /**
   * Fetch all data from Google Sheets
   */
  async getAllData() {
    // Return cached data if valid
    if (this.isCacheValid()) {
      console.log('Using cached data');
      return this.cache.data;
    }

    // If Google Sheets is disabled, return default data
    if (!CONFIG.USE_GOOGLE_SHEETS) {
      console.log('Google Sheets integration disabled, using default data');
      return this.getDefaultData();
    }

    try {
      console.log('Fetching data from Google Sheets...');
      const response = await fetch(`${CONFIG.GOOGLE_SCRIPT_URL}?action=getAllData`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Update cache
      this.cache.data = data;
      this.cache.timestamp = Date.now();
      
      console.log('Data fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
      console.log('Falling back to default data');
      return this.getDefaultData();
    }
  }

  /**
   * Submit contact form to Google Sheets
   */
  async submitContactForm(formData) {
    if (!CONFIG.USE_GOOGLE_SHEETS) {
      console.log('Google Sheets integration disabled');
      return {
        success: false,
        message: 'Form submission is currently disabled'
      };
    }

    try {
      const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submitContact',
          ...formData
        })
      });

      // Note: With no-cors mode, we can't read the response
      // We assume success if no error was thrown
      console.log('Form submitted successfully');
      return {
        success: true,
        message: 'Thank you for your message! I will get back to you soon.'
      };
    } catch (error) {
      console.error('Error submitting form:', error);
      return {
        success: false,
        message: 'There was an error submitting your form. Please try again or contact me directly via email.'
      };
    }
  }

  /**
   * Default/fallback data when Google Sheets is unavailable
   */
  getDefaultData() {
    return {
      biography: {
        text: "Michael Rodenkirch is a drummer, arranger, composer, and educator based in Portland, OR. He graduated from the University of North Texas in the winter of 2024 with a Bachelor of Arts degree in Music with a minor in History. Michael has a plethora of playing experience playing anything from musicals to playing jazz festivals. He has studied with many great musicians including Alan Jones, Quincy Davis, Richard DeRosa, and Chuck Israels. Since graduating, Michael has played as a member of the Chuck Israels trio and the Chuck Israels Orchestra. Through that experience and others, Michael has shared the stage playing with Portland legends such as Randy Porter, Joe Bagg, David Evans, Paul Mazzio, George Colligan, Darrell Grant, Kerry Politzer, Quinn Walker, Kiran Raphael, Wyatt Button, David Barber, and many more. As an educator, Michael has taught private lessons for 8 years. He teaches drum set, piano, guitar, music theory, and composition. He currently teaches at Lakeridge High School and Grant High School as a rhythm section coach."
      },
      discography: [
        { title: "Live at the Churchill School", year: "2021", association: "Rob Scheps and the TBA Band" },
        { title: "Just Us, Just We", year: "2021", association: "Shaymus Hanlin Quartet" },
        { title: "M.J. LIVE! Volume 2 (Trio Sessions)", year: "2023", association: "M.J. Johnston" },
        { title: "Introducing the Jonathan Arcangel Quartet", year: "2023", association: "Jonathan Arcangel" },
        { title: "The Stuff of Dreams", year: "2024", association: "M.J. Johnston" },
        { title: "Live at Blue Butler", year: "2025", association: "Wyatt Button" }
      ],
      events: [
        {
          title: "SUNDAY AFTERNOON JAZZ",
          location: "FOXTROT",
          date: "JULY 13",
          time: "4PM",
          notes: ""
        },
        {
          title: "SHAYMUS HAMLIN QUARTET",
          location: "1905",
          date: "AUGUST 15",
          time: "10:15PM",
          notes: ""
        }
      ],
      videos: [
        { id: 'zpt7ffA5-Wc', title: 'Drum Set senior recital Mixed' },
        { id: '6dyFDNnSiY4', title: 'Laverne Walk' },
        { id: '11KM_ZOdqhA', title: 'White Christmas - The Rob Scheps Quartet' },
        { id: 'BOV5sTbQxkQ', title: 'Para Volar' },
        { id: 'P2xUt77qvDI', title: 'Lullaby in Blue (Concert Choir); MWC Concert' },
        { id: 'aOg7lmnAd5E', title: 'The Song Is You' }
      ],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Clear the cache (useful for forcing a refresh)
   */
  clearCache() {
    this.cache.data = null;
    this.cache.timestamp = null;
  }
}

// Create global instance
window.dataService = new DataService();
