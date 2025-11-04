import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, Clock } from 'lucide-react';

const AIComparison = ({ code, analysis, recommendations, onCompare }) => {
  const [comparisonResults, setComparisonResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const handleCompareAIs = async () => {
    if (!code?.trim()) {
      setErr('Enter Verilog first.');
      return;
    }
    setErr(null);
    setLoading(true);
    setComparisonResults(null);
    try {
      const res = await onCompare({
        code,
        analysis,
        recommendations
      });
      setComparisonResults(res);
    } catch (e) {
      setErr(e.message || 'Failed to compare AIs');
    } finally {
      setLoading(false);
    }
  };

  const getProviderIcon = (provider) => {
    switch (provider) {
      case 'Google Gemini':
        return '🤖';
      case 'OpenAI GPT-4':
        return '🧠';
      case 'Anthropic Claude':
        return '🎭';
      default:
        return '🤖';
    }
  };

  const getProviderColor = (provider) => {
    switch (provider) {
      case 'Google Gemini':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
      case 'OpenAI GPT-4':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      case 'Anthropic Claude':
        return 'border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800';
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Multi-AI Board Comparison
        </h3>
      </div>

      <div className="flex justify-center mb-4">
        <button 
          onClick={handleCompareAIs} 
          disabled={loading || !code?.trim()} 
          className="btn-primary px-6 py-2 text-sm font-medium flex items-center space-x-2"
        >
          {loading ? (
            <>
              <Clock className="h-4 w-4 animate-spin" />
              <span>Comparing AIs...</span>
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              <span>Compare All AIs</span>
            </>
          )}
        </button>
      </div>

      {err && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded mb-3 text-sm">
          {err}
        </div>
      )}

      {comparisonResults && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {comparisonResults.totalResponses} AI(s) responded successfully
              </span>
            </div>
            {comparisonResults.errors.length > 0 && (
              <div className="flex items-center space-x-2 text-sm mt-1">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-600 dark:text-red-400">
                  {comparisonResults.errors.length} AI(s) failed
                </span>
              </div>
            )}
          </div>

          {/* AI Results */}
          <div className="space-y-3">
            {comparisonResults.results.map((result, index) => (
              <div 
                key={index}
                className={`border rounded-lg p-4 ${getProviderColor(result.provider)}`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getProviderIcon(result.provider)}</span>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {result.provider}
                  </h4>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {result.response}
                </div>
              </div>
            ))}
          </div>

          {/* Errors */}
          {comparisonResults.errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Failed AIs:</h4>
              {comparisonResults.errors.map((error, index) => (
                <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm">
                  <div className="font-medium text-red-800 dark:text-red-200">
                    {error.provider}
                  </div>
                  <div className="text-red-600 dark:text-red-400">
                    {error.error}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIComparison;

