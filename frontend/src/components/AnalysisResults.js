import React from 'react';
import { CheckCircle, XCircle, BarChart3, Cpu, Zap, Layers } from 'lucide-react';

const AnalysisResults = ({ result }) => {
  if (!result) return null;

  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  const getComplexityColor = (complexity) => {
    switch (complexity?.toLowerCase()) {
      case 'simple':
        return 'text-green-600 dark:text-green-400';
      case 'moderate':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'complex':
        return 'text-orange-600 dark:text-orange-400';
      case 'very complex':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Analysis Results
        </h3>
      </div>

      {result.compilation_error ? (
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  Compilation Error
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {result.error}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatNumber(result.estimated_luts)}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Estimated LUTs
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatNumber(result.estimated_flip_flops)}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                Flip-Flops
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatNumber(result.total_io)}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Total I/O
              </div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatNumber(result.total_gates)}
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                Total Gates
              </div>
            </div>
          </div>

          {/* Complexity */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Design Complexity:
              </span>
            </div>
            <span className={`text-sm font-semibold ${getComplexityColor(result.complexity_score)}`}>
              {result.complexity_score}
            </span>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <Layers className="h-4 w-4" />
              <span>Resource Breakdown</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gate Counts */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gate Types
                </h5>
                <div className="space-y-1">
                  {result.gate_counts && Object.entries(result.gate_counts).map(([gate, count]) => (
                    count > 0 && (
                      <div key={gate} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {gate} gates:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {count}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* I/O Counts */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  I/O & Signals
                </h5>
                <div className="space-y-1">
                  {result.io_counts && Object.entries(result.io_counts).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                        {type}:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Control Structures */}
            {result.control_counts && Object.values(result.control_counts).some(count => count > 0) && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Control Structures
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(result.control_counts).map(([structure, count]) => (
                    count > 0 && (
                      <div key={structure} className="flex justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {structure}:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {count}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults; 