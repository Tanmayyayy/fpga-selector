import { callGoogleGemini, callOpenAI, callAnthropic } from './_helpers.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { code, analysis, recommendations } = req.body || {};
    const prompt = `Analyze this Verilog code and suggest the best FPGA board.

Verilog Code:
${code || ''}

Analysis Results:
${JSON.stringify(analysis || {}, null, 2)}

Board Recommendations:
${JSON.stringify(recommendations || [], null, 2)}

Provide a concise recommendation in this exact format:

Best Board - [specific FPGA board name]
Concluding Statement - [brief 1-2 sentence explanation of why this board is best for this circuit]

Be specific about the board name and keep the explanation concise but technical.`;

    const results = [];
    const errors = [];

    if (process.env.GOOGLE_API_KEY) {
      try {
        const response = await callGoogleGemini(prompt);
        results.push({ provider: 'Google Gemini', response, success: true });
      } catch (err) {
        errors.push({ provider: 'Google Gemini', error: err.message });
      }
    }

    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await callOpenAI(prompt);
        results.push({ provider: 'OpenAI GPT-4', response, success: true });
      } catch (err) {
        errors.push({ provider: 'OpenAI GPT-4', error: err.message });
      }
    }

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const response = await callAnthropic(prompt);
        results.push({ provider: 'Anthropic Claude', response, success: true });
      } catch (err) {
        errors.push({ provider: 'Anthropic Claude', error: err.message });
      }
    }

    res.status(200).json({ success: true, results, errors, totalResponses: results.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

