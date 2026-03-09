'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type ModeType = 'text-to-json' | 'json-to-text';

const JSONFormatterPage = () => {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mode, setMode] = useState<ModeType>('text-to-json');

  // Preset examples
  const examples = {
    'Simple Text': 'Hello World',
    'JSON Object': '{"name":"John","age":30,"city":"New York"}',
    'Nested JSON': '{"user":{"name":"Jane","roles":["admin","editor"]}}',
    'Array': '["apple","banana","orange"]',
    'Escaped String': '"Hello \\"World\\""',
  };

  // Convert Text to JSON (Escape)
  const textToJSON = () => {
    if (!input.trim()) {
      setError('Please enter text to convert');
      return;
    }

    try {
      // Check if input is already valid JSON
      JSON.parse(input);
      setOutput(JSON.stringify(JSON.parse(input), null, 2));
      setSuccess('✅ Formatted as JSON');
    } catch {
      // If not JSON, convert text to JSON string
      const jsonString = JSON.stringify(input);
      setOutput(jsonString);
      setSuccess('✅ Text converted to JSON string');
    }
    setError('');
    setTimeout(() => setSuccess(''), 2000);
  };

  // Convert JSON to Text (Unescape)
  const jsonToText = () => {
    if (!input.trim()) {
      setError('Please enter JSON to convert');
      return;
    }

    try {
      // Try to parse as JSON
      const parsed = JSON.parse(input);
      
      if (typeof parsed === 'string') {
        // If parsed result is a string, show that string
        setOutput(parsed);
        setSuccess('✅ JSON converted to text');
      } else {
        // If parsed result is object/array, pretty print it
        setOutput(JSON.stringify(parsed, null, 2));
        setSuccess('✅ JSON formatted');
      }
    } catch {
      // If parsing fails, try to handle as escaped string
      try {
        // Try to parse as JSON string by adding quotes if needed
        const fixed = input.startsWith('"') ? input : `"${input}"`;
        const parsed = JSON.parse(fixed);
        setOutput(parsed);
        setSuccess('✅ Converted to text');
      } catch {
        setError('Invalid JSON format');
        setOutput('');
      }
    }
    setTimeout(() => setSuccess(''), 2000);
  };

  // Execute based on selected mode
  const execute = () => {
    if (mode === 'text-to-json') {
      textToJSON();
    } else {
      jsonToText();
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('✅ Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  // Clear input and output
  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <section className="pb-[120px] pt-[150px]">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          {/* Header with back button */}
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 p-2 text-body-color hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
                JSON Formatter
              </h1>
              <p className="text-body-color">Convert between text and JSON formats</p>
            </div>
          </div>

          {/* Mode Selection - Simple Toggle */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-lg border border-gray-200 p-1 dark:border-gray-700">
              <button
                onClick={() => setMode('text-to-json')}
                className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${
                  mode === 'text-to-json'
                    ? 'bg-primary text-white'
                    : 'text-body-color hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Text → JSON
              </button>
              <button
                onClick={() => setMode('json-to-text')}
                className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${
                  mode === 'json-to-text'
                    ? 'bg-primary text-white'
                    : 'text-body-color hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                JSON → Text
              </button>
            </div>
          </div>

          {/* Main Content - Dual Panels */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Panel - Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-black dark:text-white">
                  {mode === 'text-to-json' ? 'Enter Text' : 'Enter JSON'}
                </h2>
                <button
                  onClick={clearAll}
                  className="text-xs text-body-color hover:text-primary"
                >
                  Clear
                </button>
              </div>
              
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'text-to-json' 
                    ? "Type or paste your text here..." 
                    : "Paste JSON here..."}
                  rows={10}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 font-mono text-sm text-black outline-none focus:border-primary dark:border-gray-700 dark:text-white"
                />

                {/* Example Buttons */}
                <div className="mt-4">
                  <p className="mb-2 text-xs text-body-color">Try examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(examples).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setInput(value)}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs text-body-color hover:bg-primary/10 hover:text-primary dark:bg-gray-700"
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Output */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-black dark:text-white">
                  {mode === 'text-to-json' ? 'JSON Output' : 'Text Output'}
                </h2>
                {output && (
                  <button
                    onClick={() => copyToClipboard(output)}
                    className="text-xs text-body-color hover:text-primary"
                  >
                    Copy
                  </button>
                )}
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                {output ? (
                  <textarea
                    value={output}
                    readOnly
                    rows={10}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-sm text-black outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                ) : (
                  <div className="flex min-h-[250px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-sm text-body-color">Output will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={execute}
              disabled={!input.trim()}
              className="min-w-[200px] rounded-lg bg-primary px-8 py-4 text-white hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg font-medium"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {mode === 'text-to-json' ? 'Convert to JSON' : 'Convert to Text'}
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mt-4 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-6 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          {success && (
            <div className="mt-4 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-6 py-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                {success}
              </div>
            </div>
          )}

         {/* {/* Simple Info Card 
          <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">How to use</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  <span className="block">• <strong>Text → JSON:</strong> Converts any text to a JSON string (adds quotes and escapes special characters)</span>
                  <span className="block">• <strong>JSON → Text:</strong> Converts JSON string back to readable text</span>
                  <span className="block">• If input is valid JSON, it will be pretty-printed with 2 spaces</span>
                </p>
              </div>
            </div>
          </div>*/}
        </div>
      </div>
    </section>
  );
};

export default JSONFormatterPage;
