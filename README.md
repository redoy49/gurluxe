TypeScript → Development-time type safety

Zod → Validate request data before it reaches the application

Mongoose → Database schema validation before saving data to the database

Font size hierarchy (professional standard)

Hero / Banner
36–48px · Playfair Display
Section heading
24–32px · Playfair Display
Product name
16–20px · Playfair Display
Body / Description
14–16px · DM Sans
Price / Button / Label
13–15px · DM Sans 500


<!-- Font working flow -->
1. layout.jsx

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
});

↓
Next.js font load করে

↓
একটা CSS variable তৈরি করে

--font-playfair-display: "__Playfair_xxx"


2. layout.jsx

<html className={playfairDisplay.variable}>

↓

playfairDisplay.variable
return করে

"__playfair"

↓

Final HTML

<html class="__playfair">


3. Next.js generated CSS

.__playfair {
  --font-playfair-display: "__Playfair_xxx";
}

↓

এখন html element এ
--font-playfair-display
available


4. globals.css

@theme inline {
  --font-sans: var(--font-playfair-display);
}

↓

Browser বলে:

--font-playfair-display এর value কত?

↓

html element এ খুঁজে পায়

--font-playfair-display: "__Playfair_xxx";

↓

তাই

--font-sans = "__Playfair_xxx"


5. layout.jsx

<body className="font-sans">

↓

Tailwind

font-sans

↓

font-family: var(--font-sans)


6. Browser resolve করে

var(--font-sans)

↓

var(--font-playfair-display)

↓

"__Playfair_xxx"

↓

Playfair Display Font


FINAL RESULT

body
 ↓
font-sans
 ↓
--font-sans
 ↓
--font-playfair-display
 ↓
Playfair Display

font-sans → --font-sans → --font-playfair-display → Playfair Display 