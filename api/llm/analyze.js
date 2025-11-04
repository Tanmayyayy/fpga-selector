import { callGoogleGemini } from './_helpers.js';

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
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({ success: false, error: 'Google API key not configured' });
    }

    const { code, analysis, recommendations, userQuestion } = req.body || {};
    const prompt = `You are an expert FPGA and Verilog assistant. Analyze the following Verilog code and suggest the best FPGA board.

Verilog Code:
${code || ''}

Analysis Results:
${JSON.stringify(analysis || {}, null, 2)}

Board Recommendations:
${JSON.stringify(recommendations || [], null, 2)}

Based on the code complexity, resource requirements, and analysis results, provide a concise recommendation in this exact format:

Best Board - [specific FPGA board name]
Concluding Statement - [brief 1-2 sentence explanation of why this board is best for this circuit]

Be specific about the board name and keep the explanation concise but technical.`;

    const response = await callGoogleGemini(prompt);
    res.status(200).json({ success: true, answer: response });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

