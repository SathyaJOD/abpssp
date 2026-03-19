import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generate() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: 'A wide panoramic 8K ultra HD sky background with a smooth gradient from deep blue at the top to soft pastel tones near the horizon. Soft, fluffy clouds are scattered across the sky with warm sunlight glow near the bottom. On the right side, a semi-transparent Indian national flag is gently flowing in the air, with saffron, white, and green colors softly blended into the sky. The Ashoka Chakra is visible but subtle. The flag should appear light, elegant, and slightly blurred, blending naturally into the sky. Clean composition with empty space on the left side for text. No people, no buildings, minimal, professional website banner style.',
        },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64EncodeString = part.inlineData.data;
      fs.writeFileSync('public/hero-banner.png', Buffer.from(base64EncodeString, 'base64'));
      console.log('Image saved to public/hero-banner.png');
    }
  }
}

generate().catch(console.error);
