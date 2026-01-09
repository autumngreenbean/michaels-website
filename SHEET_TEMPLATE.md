# Google Sheet Template Structure
## Quick Reference for Sheet Setup

This document provides the exact structure needed for your Google Sheet.

---

## Sheet Tab Names (MUST match exactly!)

1. **Biography Discography Events Video Links**
2. **CONTACT SUBMISSIONS**
3. **EVENTS**

---

## Tab 1: Biography Discography Events Video Links

### Layout:

```
Row 1:  | Discography | Title | Year | Association | [empty] | [empty] | [empty] | [empty] |
Row 2:  | [empty]     | Title | Year | Association | [empty] | [empty] | [empty] | [empty] |
Row 3:  | [empty]     | Title | Year | Association | [empty] | [empty] | [empty] | [empty] |
Row 4:  | [empty]     | Title | Year | Association | [empty] | [empty] | [empty] | [empty] |
...
Row 10: | [empty]     | Title | Year | Association | [empty] | [empty] | [empty] | [empty] |

Row 11: | Biography   | YOUR FULL BIOGRAPHY TEXT (MERGE CELLS B11:I23) |

Row 12-23: [Biography continues in merged cell]

Row 24: [empty]

Row 25: | [empty] | YouTube Video ID | Video Title | [empty] | [empty] | [empty] |
Row 26: | [empty] | YouTube Video ID | Video Title | [empty] | [empty] | [empty] |
Row 27: | [empty] | YouTube Video ID | Video Title | [empty] | [empty] | [empty] |
...
```

### Example Data:

**Discography (Rows 1-10):**
```
A1: Discography          B1: Title                                        C1: Year    D1: Association
A2: [empty]              B2: Live at the Churchill School                 C2: 2021    D2: Rob Scheps and the TBA Band
A3: [empty]              B3: Just Us, Just We                             C3: 2021    D3: Shaymus Hanlin Quartet
A4: [empty]              B4: M.J. LIVE! Volume 2 (Trio Sessions)          C4: 2023    D4: M.J. Johnston
A5: [empty]              B5: Introducing the Jonathan Arcangel Quartet    C5: 2023    D5: Jonathan Arcangel
A6: [empty]              B6: The Stuff of Dreams                          C6: 2024    D6: M.J. Johnston
A7: [empty]              B7: Live at Blue Butler                          C7: 2025    D7: Wyatt Button
```

**Biography (Row 11):**
```
A11: Biography
B11: Michael Rodenkirch is a drummer, arranger, composer, and educator based in Portland, OR...
     [This cell should be MERGED from B11 to I23 to create a large text area]
```

**Video Links (Starting Row 25):**
```
B25: zpt7ffA5-Wc    C25: Drum Set senior recital Mixed
B26: 6dyFDNnSiY4    C26: Laverne Walk
B27: 11KM_ZOdqhA    C27: White Christmas - The Rob Scheps Quartet
B28: BOV5sTbQxkQ    C28: Para Volar
B29: P2xUt77qvDI    C29: Lullaby in Blue (Concert Choir); MWC Concert
B30: aOg7lmnAd5E    C30: The Song Is You
```

### Finding YouTube Video IDs:

From a YouTube URL like: `https://www.youtube.com/watch?v=zpt7ffA5-Wc`

The Video ID is: `zpt7ffA5-Wc` (the part after `v=`)

For short URLs like: `https://youtu.be/zpt7ffA5-Wc`

The Video ID is: `zpt7ffA5-Wc` (the part after `youtu.be/`)

---

## Tab 2: CONTACT SUBMISSIONS

### Layout:

```
A1: Name    B1: Email    C1: Instrument    D1: Inquiry Type    E1: Additional Notes    F1: Timestamp
```

**This tab should have ONLY the header row.** Form submissions will automatically add new rows.

**Note:** The F column (Timestamp) is automatically added by the script - you don't need to manually enter it in the header, but it's good to include for clarity.

---

## Tab 3: EVENTS

### Layout:

```
A1: Event    B1: Location    C1: Date    D1: Time    E1: Additional Notes
A2: [data]   B2: [data]      C2: [data]  D2: [data]  E2: [data]
A3: [data]   B3: [data]      C3: [data]  D3: [data]  E3: [data]
...
```

### Example Data:

```
A1: Event                        B1: Location    C1: Date        D1: Time    E1: Additional Notes
A2: SUNDAY AFTERNOON JAZZ        B2: FOXTROT     C2: JULY 13     D2: 4PM     E2: [empty]
A3: SHAYMUS HAMLIN QUARTET       B3: 1905        C3: AUGUST 15   D3: 10:15PM E3: [empty]
```

### Notes:
- **Event**: The name/title of the event
- **Location**: Venue name (will automatically link to Google Maps)
- **Date**: Any format works (e.g., "JULY 13", "July 13, 2026", "7/13/2026")
- **Time**: Any format (e.g., "4PM", "4:00 PM", "16:00")
- **Additional Notes**: Optional extra information

---

## Important Tips:

1. **Tab names must match EXACTLY** - spelling and capitalization matter!
2. **Don't delete or rename tabs** - the script looks for these specific names
3. **Leave rows blank** if you have fewer items than the template shows
4. **Don't add extra header rows** - the script expects data to start at specific rows
5. **Merging cells for biography** - Select B11:I23, then Format > Merge cells
6. **Order doesn't matter within sections** - you can rearrange discography, events, etc.
7. **The script auto-stops** at the first completely empty row in each section

---

## Cell References Quick Guide:

| Content Type | Tab Name | Start Cell | Notes |
|--------------|----------|------------|-------|
| Discography Headers | Tab 1 | B1:D1 | Title, Year, Association |
| Discography Data | Tab 1 | B2:D10 | Can extend beyond row 10 |
| Biography | Tab 1 | B11 | Merge B11:I23 for text area |
| Video IDs | Tab 1 | B25 | YouTube video IDs |
| Video Titles | Tab 1 | C25 | Video descriptions |
| Contact Form Headers | Tab 2 | A1:E1 | Don't add data manually |
| Event Data | Tab 3 | A2:E2 | Start from row 2 |

---

## Color Coding (Optional but Helpful):

You can color code sections to make editing easier:

- **Headers**: Light gray background
- **Biography section**: Light blue
- **Discography section**: Light green
- **Video section**: Light yellow
- **Events**: Light orange

This is purely visual and won't affect functionality.

---

## Testing Your Sheet Structure:

After setting up your sheet:

1. Make sure tab names are exact
2. Add at least one item to each section
3. Deploy the Apps Script
4. Check the website
5. Use browser console to see if data loads correctly

If you see "Sheet not found" errors, check your tab names!

---

## Need to Start Fresh?

If you want to create a new sheet from scratch:

1. Create a new Google Spreadsheet
2. Create 3 tabs with the exact names above
3. Copy the structure from this guide
4. Add your content
5. The Apps Script code doesn't need to change - just redeploy if needed
