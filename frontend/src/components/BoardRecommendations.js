import React from 'react';
import { Cpu, CheckCircle, Star, TrendingUp, Zap, Shield } from 'lucide-react';

const BoardRecommendations = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="card p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Recommendations</h3>
          <p className="text-sm">
            No suitable FPGA boards found for your design requirements.
          </p>
        </div>
      </div>
    );
  }

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 dark:text-green-400';
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (percentage >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getFeatureIcon = (feature) => {
    switch (feature.toLowerCase()) {
      case 'high performance':
        return <TrendingUp className="h-3 w-3" />;
      case 'low power':
        return <Zap className="h-3 w-3" />;
      case 'industrial use':
        return <Shield className="h-3 w-3" />;
      default:
        return <CheckCircle className="h-3 w-3" />;
    }
  };

  const getPriceColor = (priceRange) => {
    switch (priceRange?.toLowerCase()) {
      case 'low':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'high':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center space-x-2 mb-4">
        <Cpu className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recommended FPGA Boards
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({recommendations.length} found)
        </span>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={rec.board.id}
            className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
              index === 0
                ? 'border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {rec.board.name}
                  </h4>
                  {index === 0 && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {rec.board.description}
                </p>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-bold ${getMatchColor(rec.match_percentage)}`}>
                  {Math.round(rec.match_percentage)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Match Score
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {rec.board.luts.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  LUTs
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {rec.board.io_pins}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  I/O Pins
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                  {rec.board.frequency}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Frequency
                </div>
              </div>
            </div>

            {/* Features */}
            {rec.board.features && rec.board.features.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {rec.board.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                    >
                      {getFeatureIcon(feature)}
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            {rec.board.price_range && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Price Range:</span>
                <span className={`font-medium ${getPriceColor(rec.board.price_range)}`}>
                  {rec.board.price_range}
                </span>
              </div>
            )}

            {/* Reasons */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Why this board:
              </h5>
              <ul className="space-y-1">
                {rec.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start space-x-2">
          <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Recommendation Tips:</p>
            <ul className="space-y-1 text-xs">
              <li>• Higher match scores indicate better suitability</li>
              <li>• Consider your budget and complexity requirements</li>
              <li>• Check vendor-specific tools and documentation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardRecommendations; 