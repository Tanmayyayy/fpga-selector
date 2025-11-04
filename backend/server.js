import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyD8JxH14Y6JJYFJoBmg38EMWPx691EJRlE';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const PORT = process.env.PORT || 3001;

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    providers: {
      google: Boolean(GOOGLE_API_KEY),
      openai: Boolean(OPENAI_API_KEY),
      anthropic: Boolean(ANTHROPIC_API_KEY)
    }
  });
});

const callGoogleGemini = async (prompt) => {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  if (!response.ok) throw new Error(`Google API error: ${response.status}`);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
};

const callOpenAI = async (prompt) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7
    })
  });
  if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response';
};

const callAnthropic = async (prompt) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`);
  const data = await response.json();
  return data.content?.[0]?.text || 'No response';
};

app.post('/api/llm/compare', async (req, res) => {
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

    if (GOOGLE_API_KEY) {
      try {
        const response = await callGoogleGemini(prompt);
        results.push({ provider: 'Google Gemini', response, success: true });
      } catch (err) {
        errors.push({ provider: 'Google Gemini', error: err.message });
      }
    }

    if (OPENAI_API_KEY) {
      try {
        const response = await callOpenAI(prompt);
        results.push({ provider: 'OpenAI GPT-4', response, success: true });
      } catch (err) {
        errors.push({ provider: 'OpenAI GPT-4', error: err.message });
      }
    }

    if (ANTHROPIC_API_KEY) {
      try {
        const response = await callAnthropic(prompt);
        results.push({ provider: 'Anthropic Claude', response, success: true });
      } catch (err) {
        errors.push({ provider: 'Anthropic Claude', error: err.message });
      }
    }

    res.json({ success: true, results, errors, totalResponses: results.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/llm/analyze', async (req, res) => {
  try {
    if (!GOOGLE_API_KEY) {
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
    res.json({ success: true, answer: response });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
  console.log(`Google: ${GOOGLE_API_KEY ? 'Yes' : 'No'} | OpenAI: ${OPENAI_API_KEY ? 'Yes' : 'No'} | Anthropic: ${ANTHROPIC_API_KEY ? 'Yes' : 'No'}`);
});
