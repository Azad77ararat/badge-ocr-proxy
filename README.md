# Badge OCR Proxy

Tiny Express server that forwards a cropped badge photo to the OCR.space
cloud API (far more accurate than running Tesseract.js in the browser) and
returns the recognized text.

## Deploy to Render.com

1. Go to https://ocr.space/ocrapi and sign up for a **free API key**
   (no credit card required).
2. Push this folder to a GitHub repo (or use Render's "deploy from folder"
   if you prefer).
3. On Render: **New** → **Web Service** → connect the repo.
   - Build command: `npm install`
   - Start command: `npm start`
4. Under **Environment**, add a variable:
   - Key: `OCR_SPACE_API_KEY`
   - Value: the key from step 1
5. Deploy. Render gives you a URL like
   `https://badge-ocr-proxy.onrender.com`.
6. Open `index.html` in the frontend app, find this line near the top of
   the `<script>` block:
   ```js
   var OCR_ENDPOINT = 'https://REPLACE-WITH-YOUR-RENDER-URL.onrender.com/ocr';
   ```
   Replace it with your real URL + `/ocr`, e.g.:
   ```js
   var OCR_ENDPOINT = 'https://badge-ocr-proxy.onrender.com/ocr';
   ```
7. Re-deploy the frontend to Netlify as usual.

## Notes

- Free Render web services sleep after inactivity; the first scan after a
  while may take a few extra seconds while it wakes up.
- OCR.space free tier: 25,000 requests/month, no card required.
