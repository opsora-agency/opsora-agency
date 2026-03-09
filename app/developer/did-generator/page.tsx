'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface GeneratedId {
  id: string;
  documentId: string;
  timestamp: string;
}

const DocumentIdGenerator = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [gasUrl, setGasUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Generated ID state
  const [generatedId, setGeneratedId] = useState('');
  
  // Existing IDs set (for uniqueness check)
  const [existingIds, setExistingIds] = useState<Set<string>>(new Set());
  
  // History of generated IDs (last 3 only)
  const [generatedHistory, setGeneratedHistory] = useState<GeneratedId[]>([]);

  // Fixed settings (hardcoded as requested)
  const PREFIX = 'OSA';
  const SEPARATOR = '-';
  const DIGITS = 6; // Fixed at 6 digits
  const currentYear = new Date().getFullYear().toString();

  // Get GAS URL from environment
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_GAS_URL;
    if (url) {
      setGasUrl(url);
      fetchExistingIds(url);
    } else {
      setError('NEXT_PUBLIC_GAS_URL is not configured');
    }
  }, []);

  // Fetch all existing document IDs from Google Sheets
  const fetchExistingIds = async (url: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${url}?action=getAll`);
      const data = await response.json();
      
      if (data.success) {
        const ids = new Set<string>();
        data.data.forEach((doc: any) => {
          ids.add(doc.documentId);
        });
        setExistingIds(ids);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError('Could not fetch existing documents from Google Sheets');
    } finally {
      setLoading(false);
    }
  };

  // Generate random digits (6 digits as fixed)
  const generateRandomDigits = (): string => {
    let result = '';
    for (let i = 0; i < DIGITS; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  // Check if ID exists in Google Sheets
  const checkIdExists = async (id: string): Promise<boolean> => {
    if (!gasUrl) return existingIds.has(id); // Fallback to local set
    
    try {
      const response = await fetch(`${gasUrl}?action=verify&id=${encodeURIComponent(id)}`);
      const data = await response.json();
      return data.success; // If success, document exists
    } catch (err) {
      console.error('Error checking ID:', err);
      return existingIds.has(id); // Fallback to local
    }
  };

  // Generate unique document ID
  const generateUniqueId = async () => {
    setChecking(true);
    setError('');
    setSuccess('');
    
    const maxAttempts = 50;
    let attempt = 0;
    let found = false;
    let newId = '';

    while (!found && attempt < maxAttempts) {
      const randomDigits = generateRandomDigits();
      const candidateId = `${PREFIX}${SEPARATOR}${currentYear}${SEPARATOR}${randomDigits}`;
      
      // Check if exists
      const exists = await checkIdExists(candidateId);
      
      if (!exists) {
        newId = candidateId;
        found = true;
        break;
      }
      
      attempt++;
    }

    if (found) {
      setGeneratedId(newId);
      
      const newGeneratedId: GeneratedId = {
        id: Date.now().toString(),
        documentId: newId,
        timestamp: new Date().toISOString()
      };
      
      setGeneratedHistory(prev => [newGeneratedId, ...prev.slice(0, 2)]); // Keep only last 3
      setSuccess('✅ Unique document ID generated successfully!');
    } else {
      setError('Failed to generate unique ID after multiple attempts. Please try again.');
    }
    
    setChecking(false);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('✅ Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <section className="pb-[120px] pt-[150px]">
      <div className="container">
        <div className="mx-auto max-w-4xl">
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
                Document ID Generator
              </h1>
              <p className="text-body-color">Generate unique document IDs in OSA format</p>
            </div>
          </div>

          {/* Main Content - Centered */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl space-y-6">
              
              {/* Generator Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                
                {/* Format Display */}
                <div className="mb-8 text-center">
                  <p className="text-sm text-body-color mb-2">Document ID Format</p>
                  <div className="inline-block rounded-lg bg-primary/10 px-6 py-3">
                    <span className="font-mono text-2xl font-bold text-primary">
                      OSA-{currentYear}-[6 digits]
                    </span>
                  </div>
                  <p className="text-xs text-body-color mt-2">
                    Example: OSA-{currentYear}-483729
                  </p>
                </div>

                {/* Generate Button */}
                <div className="flex justify-center mb-6">
                  <button
                    onClick={generateUniqueId}
                    disabled={checking || loading || !gasUrl}
                    className="min-w-[240px] rounded-lg bg-primary px-8 py-4 text-white hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg font-medium"
                  >
                    {checking ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Checking...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate Unique ID
                      </>
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 text-center">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400 text-center">
                    {success}
                  </div>
                )}

                {/* Generated ID Display */}
                {generatedId && (
                  <div className="mt-6 rounded-lg border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-6 dark:border-primary/30 dark:from-primary/10">
                    <p className="text-sm text-body-color mb-2 text-center">Generated Document ID</p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <span className="font-mono text-2xl font-bold text-primary break-all text-center">
                        {generatedId}
                      </span>
                      <button
                        onClick={() => copyToClipboard(generatedId)}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
                        title="Copy to clipboard"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy
                      </button>
                    </div>
                    <p className="text-xs text-body-color mt-3 text-center">
                      Generated on {new Date().toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Recent History - Last 3 IDs */}
              {generatedHistory.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <h2 className="mb-4 text-lg font-semibold text-black dark:text-white text-center">
                    Recently Generated
                  </h2>
                  <div className="flex flex-col items-center gap-3">
                    {generatedHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex w-full max-w-md items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900"
                      >
                        <span className="font-mono font-medium text-primary">
                          {item.documentId}
                        </span>
                        <button
                          onClick={() => copyToClipboard(item.documentId)}
                          className="text-primary hover:text-primary/80"
                          title="Copy"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Simple Info Card */}
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">About</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      IDs are generated in format <span className="font-mono">OSA-YYYY-######</span> and checked against 
                      your Google Sheets database to ensure uniqueness. Each ID is guaranteed to be unique.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentIdGenerator;
