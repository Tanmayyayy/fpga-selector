# Hugging Face Setup Guide

## Step 1: Get Your Free API Key

1. Go to: https://huggingface.co/settings/tokens
2. Sign up for a free account (if you don't have one)
3. Click "New token"
4. Name it: "FPGA-Project"
5. Select "Read" permissions
6. Copy the token (starts with `hf_...`)

## Step 2: Add Your API Key

### Option A: Set Environment Variable (Recommended)
```powershell
$env:HUGGINGFACE_API_KEY="hf_your_actual_token_here"
```

### Option B: Edit the Backend File
Open `fpga-selector/backend/server.js` and replace:
```javascript
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || 'hf_your_key_here';
```
with:
```javascript
const HUGGINGFACE_API_KEY = 'hf_your_actual_token_here';
```

## Step 3: Restart the Backend

```powershell
cd "D:\fpga project\fpga-selector\backend"
npm run dev
```

## Step 4: Test the AI

1. Open: http://localhost:3000
2. Upload a Verilog file
3. Click "Analyze Code"
4. Scroll to "AI Assistant (Hugging Face)"
5. Click "Ask AI"

## Benefits of Hugging Face

- ✅ **Free**: No cost for reasonable usage
- ✅ **Reliable**: No rate limits for free tier
- ✅ **Fast**: Quick responses
- ✅ **No Setup**: Just need an API key

## Troubleshooting

If you get "API key not configured":
- Make sure you copied the full token (starts with `hf_`)
- Restart the backend after adding the key
- Check the token has "Read" permissions

If you get "Model loading" error:
- Wait 30 seconds and try again (first request loads the model)
- The model will stay loaded for faster subsequent requests


