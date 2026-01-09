# Google Sheets CMS Setup Guide
## Michael Rodenkirch Website

This guide will walk you through setting up Google Sheets as a Content Management System (CMS) for the website, allowing your client to edit content without touching any code.

**🎉 NEW: Automatic sheet setup! No need to manually create tabs or headers.**

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Google Sheets Setup](#google-sheets-setup)
3. [Apps Script Deployment](#apps-script-deployment)
4. [Website Configuration](#website-configuration)
5. [Testing](#testing)
6. [How to Edit Content](#how-to-edit-content)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### What This System Does
- **Biography**: Editable text in Google Sheets appears on the website
- **Discography**: List of albums/recordings with title, year, and association
- **Events**: Upcoming events with location, date, time, and notes (auto-generates Google Maps links)
- **Portfolio Videos**: YouTube video IDs and titles for the portfolio page
- **Contact Form**: Form submissions are saved directly to Google Sheets

### Architecture
```
Google Sheets ←→ Apps Script (Web App) ←→ Website JavaScript
```

---

## 📊 Google Sheets Setup

### Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Michael Rodenkirch Website Content"

### Step 2: Set Up the Apps Script (Auto-Creates Structure!)

**You don't need to manually create tabs or headers anymore!** The script does it for you.

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of `google-apps-script/Code.gs` from this project
4. Paste it into the Apps Script editor
5. Click the **Save** icon (💾) or press `Ctrl+S` / `Cmd+S`
6. Name the project: "Michael Rodenkirch Website API"

### Step 3: Initialize the Sheet Structure

1. In the Apps Script editor, select the function dropdown (currently shows "Select function")
2. Choose **`initializeSheets`**
3. Click the **Run** button (▶️)
4. You may need to authorize:
   - Click **Review permissions**
   - Choose your Google account
   - Click **Advanced** if you see a warning
   - Click **Go to [Project Name] (unsafe)**
   - Click **Allow**
5. A popup will appear saying "Sheet Setup Complete!" ✅

**That's it!** Your sheet now has all 3 tabs with headers and sample data:
- ✅ "Biography Discography Events Video Links" - with sample albums and videos
- ✅ "CONTACT SUBMISSIONS" - ready to receive form submissions
- ✅ "EVENTS" - with sample events

You can now edit the sample data or replace it with your own content!

### Step 4: (Optional) Customize Your Content

Now that the structure is set up, you can:
- Edit the biography text in cell B11
- Replace sample discography entries (rows 2-10)
- Replace sample video IDs (starting at row 26)
- Replace sample events in the EVENTS tab

Or keep the samples and deploy first to test everything works!

---

## ⚙️ Apps Script Deployment

### Step 1: Open Apps Script Editor

✅ **Already done if you followed the Google Sheets Setup above!**

If not: In your Google Sheet, click **Extensions** > **Apps Script**

### Step 2: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Choose **Web app**
4. Fill in the settings:
   - **Description**: "Website Content API v1"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. Authorization may be requested again (same process as before)

### Step 3: Copy the Web App URL

After deployment, you'll see a **Web app URL** that looks like:
```
https://script.google.com/macros/s/AKfycby...LONG_STRING.../exec
```

**📝 COPY THIS URL - YOU'LL NEED IT NEXT!**

---

## 🌐 Website Configuration

### Step 1: Update Config File

1. Open `js/config.js` in your website files
2. Find this line:
   ```javascript
   GOOGLE_SCRIPT_URL: 'YOUR_GOOGLE_SCRIPT_URL_HERE',
   ```
3. Replace `'YOUR_GOOGLE_SCRIPT_URL_HERE'` with your copied Web App URL (keep the quotes)
4. Example:
   ```javascript
   GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycby...LONG_STRING.../exec',
   ```
5. Save the file

### Step 2: Upload to Your Web Host

Upload these files to your web server:
- `index.html`
- `portfolio.html`
- `js/config.js`
- `js/data-service.js`
- `js/index.js`
- `js/portfolio.js`

---

## 🧪 Testing

### Test 1: Check Data Loading

1. Open your website in a browser
2. Open the browser console (F12 or right-click > Inspect > Console)
3. Look for messages like:
   - ✅ "Fetching data from Google Sheets..."
   - ✅ "Data fetched successfully"
4. If you see errors, check the [Troubleshooting](#troubleshooting) section

### Test 2: Verify Content

1. **Biography**: Check that the biography text matches what's in your sheet
2. **Events**: Check that events appear with correct info and clickable location links
3. **Portfolio**: Check that videos load with correct thumbnails
4. **Discography**: Check that albums appear in the portfolio page

### Test 3: Test Contact Form

1. Fill out the contact form on your website
2. Submit it
3. Check the "CONTACT SUBMISSIONS" tab in your Google Sheet
4. You should see a new row with the form data

---

## ✏️ How to Edit Content

### For Your Client (Simple Instructions)

**To update the biography:**
1. Open the Google Sheet
2. Go to the "Biography Discography Events Video Links" tab
3. Find cell B11 (row 11, column B)
4. Edit the text
5. Wait 5 minutes, or refresh the website to see changes

**To add/edit an event:**
1. Go to the "EVENTS" tab
2. Add a new row or edit an existing one
3. Fill in: Event name, Location, Date, Time, Notes
4. Changes appear within 5 minutes (or refresh)

**To add/edit discography:**
1. Go to "Biography Discography Events Video Links" tab
2. Find rows 2-10 (below the "Discography" header)
3. Add/edit: Title, Year, Association
4. Leave a row blank to stop the list

**To add/edit portfolio videos:**
1. Go to "Biography Discography Events Video Links" tab
2. Starting at row 25
3. Add YouTube Video ID in column B, Title in column C
4. To find video ID: Look at YouTube URL after `v=`

**To view form submissions:**
1. Go to "CONTACT SUBMISSIONS" tab
2. View all submitted forms with timestamps

---

## 🔧 Troubleshooting

### Problem: Website shows default data, not sheet data

**Solutions:**
1. Check that the Web App URL in `js/config.js` is correct
2. Make sure you deployed the script as "Anyone" can access
3. Check browser console for error messages
4. Try clearing the cache: In console, type `dataService.clearCache()` and refresh

### Problem: Data is outdated

**Solutions:**
1. Wait 5 minutes - data is cached for performance
2. Force refresh: Open console and type `dataService.clearCache()`, then refresh
3. Reduce cache time in `js/config.js` by changing `CACHE_DURATION`

### Problem: Form submissions not appearing in sheet

**Solutions:**
1. Check that "CONTACT SUBMISSIONS" tab exists with correct spelling
2. Make sure column headers are in row 1: Name, Email, Instrument, Inquiry Type, Additional Notes
3. Check if the sheet is protected - remove any protection
4. Look for error messages in the Apps Script logs:
   - Open Apps Script editor
   - Click **Executions** (clock icon)
   - Look for failed executions

### Problem: Apps Script authorization issues

**Solutions:**
1. Re-deploy the script:
   - Click **Deploy** > **Manage deployments**
   - Click **Edit** (pencil icon)
   - Click **Deploy**
2. Make sure "Execute as: Me" is selected
3. Try from an incognito/private browser window

### Problem: CORS errors in console

This is normal! The form submission uses `no-cors` mode, which means you won't see the response but it still works. Check your Google Sheet to verify submissions.

---

## 🚀 Advanced Configuration

### Disable Google Sheets Integration (Testing Mode)

Edit `js/config.js`:
```javascript
USE_GOOGLE_SHEETS: false
```
The site will use default/fallback data instead.

### Change Cache Duration

Edit `js/config.js`:
```javascript
CACHE_DURATION: 1 * 60 * 1000  // 1 minute instead of 5
```

### Add More Video Fields

In `Code.gs`, modify the `getVideos()` function to read additional columns (D, E, etc.)

---

## 📞 Support

If you encounter issues not covered here:
1. Check browser console for error messages
2. Check Apps Script execution logs
3. Verify sheet tab names and structure match exactly
4. Test with a simple entry first before bulk updates

---

## 🎉 You're Done!

Your client can now edit the website content through Google Sheets without any coding knowledge. Changes will appear on the website within 5 minutes, or immediately after a manual refresh.
