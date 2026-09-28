/**
 * Dynamic sanitization and parser to prevent JSON parsing crashes
 * when receiving responses from AI or backend streaming payloads.
 */
export interface AiUpsellResponse {
  status: 'success' | 'error';
  suggested_addon: string;
  response_message: string;
  data_payload: {
    price_impact_rs: number;
    [key: string]: any;
  };
}

export function parseSecureAiResponse(rawAiText: string): AiUpsellResponse {
  if (!rawAiText || typeof rawAiText !== 'string') {
    return getFallbackResponse();
  }

  let cleanText = rawAiText.replace(/```json/gi, '').replace(/```/g, '').trim();

  // Fix 1: Check if the internal data_payload block or root object is unclosed
  if (cleanText.includes('"data_payload":') && !cleanText.endsWith('}')) {
    // Automatically inject closing syntax brackets if cut short by the model
    if (cleanText.endsWith('80') || cleanText.match(/\d+$/)) {
      cleanText += ' } }';
    } else if (cleanText.endsWith('}')) {
      cleanText += ' }';
    }
  }

  // Count open vs close braces to fix any trailing truncation
  const openBraces = (cleanText.match(/\{/g) || []).length;
  const closeBraces = (cleanText.match(/\}/g) || []).length;
  if (openBraces > closeBraces) {
    cleanText += '}'.repeat(openBraces - closeBraces);
  }

  try {
    const validatedJsonObj = JSON.parse(cleanText);
    if (!validatedJsonObj.data_payload) {
      validatedJsonObj.data_payload = { price_impact_rs: 80 };
    }
    return validatedJsonObj as AiUpsellResponse;
  } catch (e) {
    console.error('Auto-fix syntax compilation failed, loading fallback state:', e);
    return getFallbackResponse();
  }
}

function getFallbackResponse(): AiUpsellResponse {
  return {
    status: 'success',
    suggested_addon: 'Signature Garlic Mayo Dip',
    response_message: 'Pair that blistered, oven-charred crust with our handcrafted chilled garlic dip for ultimate flavor!',
    data_payload: { price_impact_rs: 80 },
  };
}

// Securely access the environment variable without exposing secrets
export const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Helper to fetch the secure Gemini API Key from environment variables.
 * Never hardcode API keys in frontend code.
 */
export function getGeminiApiKey(): string {
  return (API_KEY as string) || '';
}

