// خادم بسيط جداً: يستقبل صورة من تطبيق الموبايل، يرسلها لخدمة OCR.space
// السحابية (أدق بكثير من OCR المحلي بالمتصفح)، ويرجع النص المقروء.
//
// يحتاج متغير بيئة واحد: OCR_SPACE_API_KEY
// احصل عليه مجاناً من: https://ocr.space/ocrapi (بدون بطاقة ائتمان)

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '12mb' }));

const OCR_API_KEY = process.env.OCR_SPACE_API_KEY;

app.get('/', (req, res) => {
  res.send('Badge OCR proxy is running.');
});

app.post('/ocr', async (req, res) => {
  try {
    if (!OCR_API_KEY) {
      return res.status(500).json({ error: 'Server misconfigured: OCR_SPACE_API_KEY is not set.' });
    }

    const { imageBase64 } = req.body || {};
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required.' });
    }

    const params = new URLSearchParams();
    params.append('apikey', OCR_API_KEY);
    params.append('base64Image', imageBase64);
    params.append('language', 'eng');
    params.append('OCREngine', '2'); // محرك OCR.space الأحدث والأدق للنصوص القصيرة
    params.append('scale', 'true');
    params.append('isOverlayRequired', 'false');

    const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const data = await ocrResponse.json();

    if (data.IsErroredOnProcessing) {
      const message = Array.isArray(data.ErrorMessage) ? data.ErrorMessage.join(', ') : (data.ErrorMessage || 'OCR failed');
      return res.status(502).json({ error: message });
    }

    const parsedText =
      (data.ParsedResults && data.ParsedResults[0] && data.ParsedResults[0].ParsedText) || '';

    res.json({ text: parsedText.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unknown server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Badge OCR proxy listening on port ' + PORT);
});
