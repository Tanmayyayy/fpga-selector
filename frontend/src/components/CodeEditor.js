import React from 'react';

const CodeEditor = ({ value, onChange, placeholder, className = '' }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    // Auto-indent on Enter
    if (e.key === 'Enter') {
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      
      // Get the current line
      const currentLine = value.substring(0, start).split('\n').pop();
      const indentMatch = currentLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : '';
      
      // Check if we should increase indent
      const shouldIncreaseIndent = /^\s*(module|always|if|else|case|for|while|begin)\s*/.test(currentLine);
      const newIndent = shouldIncreaseIndent ? currentIndent + '  ' : currentIndent;
      
      // Insert newline with proper indent
      const newValue = value.substring(0, start) + '\n' + newIndent + value.substring(end);
      target.value = newValue;
      
      // Set cursor position
      const newCursorPos = start + 1 + newIndent.length;
      target.setSelectionRange(newCursorPos, newCursorPos);
      
      e.preventDefault();
      onChange(newValue);
    }
  };

  return (
    <div className={`relative h-[400px] ${className}`}>
      <div className="flex h-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Line numbers */}
        <div className="w-12 flex-shrink-0 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs font-mono select-none overflow-hidden">
          <div className="h-full py-2">
            {value.split('\n').map((_, index) => (
              <div key={index} className="h-6 leading-6 px-2 text-right">
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Code editor */}
        <div className="flex-grow relative">
          <textarea
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="code-editor absolute inset-0 w-full h-full font-mono text-sm leading-6 pl-4 pr-8 py-2 resize-none"
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            style={{ minWidth: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor; 