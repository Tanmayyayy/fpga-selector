import React, { useState } from 'react';

const AIAssistant = ({ code, analysis, recommendations, onAsk }) => {
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const handleAISuggest = async () => {
    if (!code?.trim()) {
      setErr('Enter Verilog first.');
      return;
    }
    setErr(null);
    setLoading(true);
    setSuggestion('');
    try {
      const res = await onAsk({
        code,
        analysis,
        recommendations,
        userQuestion: 'Based on the provided code, suggest me the best FPGA board for implementing this circuit. Format: Best Board - [board name], Concluding Statement - [brief explanation]'
      });
      setSuggestion(res.answer || '');
    } catch (e) {
      setErr(e.message || 'Failed to get AI suggestion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        AI Board Recommendation
      </h3>

      <div className="flex justify-center mb-4">
        <button 
          onClick={handleAISuggest} 
          disabled={loading || !code?.trim()} 
          className="btn-primary px-6 py-2 text-sm font-medium"
        >
          {loading ? 'AI Analyzing...' : 'AI Suggest'}
        </button>
      </div>

      {err && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded mb-3 text-sm">
          {err}
        </div>
      )}

      {suggestion && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            AI Recommendation:
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap">
            {suggestion}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;







