'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type IDType = 'DID' | 'CID' | 'UID';

interface IDConfig {
  name: string;
  description: string;
  sheetColumn: string; // Column name in VerificationLog
  format: string;
  example: string;
}

interface GeneratedId {
  id: string;
  type: IDType;
  value: string;
  timestamp: string;
}

const IDGeneratorPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [gasUrl, setGasUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Selected ID type
  const [selectedType, setSelectedType] = useState<IDType>('DID');
  
  // Generated ID state
  const [generatedId, setGeneratedId] = useState('');
  
  // Existing IDs sets for each type (from VerificationLog)
  const [existingIds, setExistingIds] = useState<Record<IDType, Set<string>>>({
    DID: new Set(),
    CID: new Set(),
    UID: new Set()
  });
  
  // History of generated IDs (last 5)
  const [generatedHistory, setGeneratedHistory] = useState<GeneratedId[]>([]);

  // ID Configuration
  const idConfigs: Record<IDType, IDConfig> = {
    DID: {
      name: 'Document ID',
      description: 'For documents, certificates, licenses',
      sheetColumn: 'Document ID',
      format: 'OPS-YYYY-######',
      example: 'OPS-2024-483729'
    },
    CID: {
      name: 'Client ID',
      description: 'For companies, organizations, clients (numeric only)',
      sheetColumn: 'Client ID',
      format: '######## (8 digits)',
      example: '12345678'
    },
    UID: {
      name: 'User ID',
      description: 'For individual users, employees',
      sheetColumn: 'User ID',
      format: 'U######## (U + 8 digits)',
      example: 'U12345678'
    }
  };

  const currentYear = new Date().getFullYear().toString();

  // Get GAS URL from environment
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_GAS_URL;
    if (url) {
      setGasUrl(url);
      fetchAllExistingIds(url);
    } else {
      setError('NEXT_PUBLIC_GAS_URL is not configured in .env.local');
    }
  }, []);

  // Fetch all existing IDs from VerificationLog sheet
  const fetchAllExistingIds = async (url: string) => {
    setLoading(true);
    try {
      // We need to get all unique IDs from VerificationLog
      // Since the Apps Script doesn't have a getAll endpoint, we'll need to fetch recent and then more
      // For demo, we'll simulate with a larger request
      
      // In production, you might want to modify your Apps Script to add a getAllIds endpoint
      // For now, we'll fetch multiple pages or use a different approach
      
      // This is a workaround - you may need to modify your Apps Script to add this functionality
      const response = await fetch(`${url}?action=getAllIds`);
      const data = await response.json();
      
      if (data.success) {
        const newExistingIds = {
          DID: new Set<string>(),
          CID: new Set<string>(),
          UID: new Set<string>()
        };
        
        // Assuming data returns array of objects with documentId, clientId, userId
        data.data.forEach((item: any) => {
          if (item.documentId) newExistingIds.DID.add(item.documentId);
          if (item.clientId) newExistingIds.CID.add(item.clientId);
          if (item.userId) newExistingIds.UID.add(item.userId);
        });
        
        setExistingIds(newExistingIds);
      }
    } catch (err) {
      console.error('Failed to fetch IDs:', err);
      // Fallback to empty sets
    } finally {
      setLoading(false);
    }
  };

  // Generate random digits
  const generateRandomDigits = (length: number): string => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  // Check if ID exists using your Apps Script
  const checkIdExists = async (type: IDType, id: string): Promise<boolean> => {
    // First check local cache
    if (existingIds[type].has(id)) return true;
    
    if (!gasUrl) return false;
    
    try {
      // Use your existing verify endpoint
      // We'll pass the ID and it will check in Documents sheet
      // For CID and UID, we need to check in VerificationLog or add new sheets
      
      // For now, we'll use a modified approach - you may need to update your Apps Script
      const response = await fetch(`${gasUrl}?action=verify&id=${encodeURIComponent(id)}`);
      const data = await response.json();
      
      // If found in Documents sheet, it exists
      if (data.success) return true;
      
      // For CID and UID, we need additional checks
      // This is a placeholder - you'll need to implement proper checking
      return false;
    } catch (err) {
      console.error('Error checking ID:', err);
      return false;
    }
  };

  // Generate DID with adaptive length (4 or 6 digits)
  const generateDID = async (): Promise<string> => {
    // First try with 4 digits
    for (let attempt = 0; attempt < 20; attempt++) {
      const random4 = generateRandomDigits(4);
      const candidate = `OPS-${currentYear}-${random4}`;
      
      const exists = await checkIdExists('DID', candidate);
      if (!exists) {
        return candidate;
      }
    }
    
    // If 4 digits all taken, try with 6 digits
    for (let attempt = 0; attempt < 30; attempt++) {
      const random6 = generateRandomDigits(6);
      const candidate = `OPS-${currentYear}-${random6}`;
      
      const exists = await checkIdExists('DID', candidate);
      if (!exists) {
        return candidate;
      }
    }
    
    return '';
  };

  // Generate CID (8 digits numeric only)
  const generateCID = async (): Promise<string> => {
    for (let attempt = 0; attempt < 50; attempt++) {
      const random8 = generateRandomDigits(8);
      
      const exists = await checkIdExists('CID', random8);
      if (!exists) {
        return random8;
      }
    }
    return '';
  };

  // Generate UID (U + 8 digits)
  const generateUID = async (): Promise<string> => {
    for (let attempt = 0; attempt < 50; attempt++) {
      const random8 = generateRandomDigits(8);
      const candidate = `U${random8}`;
      
      const exists = await checkIdExists('UID', candidate);
      if (!exists) {
        return candidate;
      }
    }
    return '';
  };

  // Generate unique ID based on selected type
  const generateUniqueId = async () => {
    setChecking(true);
    setError('');
    setSuccess('');
    
    let newId = '';

    switch (selectedType) {
      case 'DID':
        newId = await generateDID();
        break;
      case 'CID':
        newId = await generateCID();
        break;
      case 'UID':
        newId = await generateUID();
        break;
    }

    if (newId) {
      setGeneratedId(newId);
      
      // Update local cache
      setExistingIds(prev => ({
        ...prev,
        [selectedType]: new Set(prev[selectedType]).add(newId)
      }));
      
      const newGeneratedId: GeneratedId = {
        id: Date.now().toString(),
        type: selectedType,
        value: newId,
        timestamp: new Date().toISOString()
      };
      
      setGeneratedHistory(prev => [newGeneratedId, ...prev.slice(0, 4)]);
      setSuccess(`✅ Unique ${idConfigs[selectedType].name} generated successfully!`);
    } else {
      setError(`Failed to generate unique ${idConfigs[selectedType].name} after multiple attempts. Please try again.`);
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
        <div className="mx-auto max-w-6xl">
          {/* Header */}
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
                ID Generator
              </h1>
              <p className="text-body-color">Generate unique Document, Client, and User IDs</p>
            </div>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            
            {/* Left Sidebar - ID Type Selection */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold text-black dark:text-white mb-4">Select ID Type</h2>
              
              {(Object.keys(idConfigs) as IDType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setGeneratedId('');
                  }}
                  className={`w-full rounded-xl border p-5 text-left transition-all ${
                    selectedType === type
                      ? 'border-primary bg-primary/5 shadow-lg dark:bg-primary/10 ring-2 ring-primary/20'
                      : 'border-gray-200 bg-white hover:border-primary/50 dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold text-primary">{type}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-body-color">
                      {existingIds[type].size}
                    </span>
                  </div>
                  <p className="text-sm text-body-color mb-2">{idConfigs[type].name}</p>
                  <div className="font-mono text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    {idConfigs[type].format}
                  </div>
                  <p className="text-xs text-primary mt-2">ex: {idConfigs[type].example}</p>
                </button>
              ))}

              {/* Database Info */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-sm font-medium text-black dark:text-white mb-3">Verification Log</h3>
                <p className="text-xs text-body-color mb-2">
                  Using sheet: <span className="font-mono text-primary">VerificationLog</span>
                </p>
                <div className="space-y-1 text-xs text-body-color">
                  <p>• Document IDs (Column B)</p>
                  <p>• Client IDs (Column E)</p>
                  <p>• User IDs (Column F)</p>
                </div>
              </div>
            </div>

            {/* Right Side - Generator Panel */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Generator Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                
                {/* Selected Type Header */}
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-primary">{selectedType}</span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      {idConfigs[selectedType].name}
                    </span>
                  </div>
                  <p className="text-body-color">{idConfigs[selectedType].description}</p>
                </div>
                
                {/* Format Display */}
                <div className="mb-8 text-center">
                  <div className="inline-block rounded-lg bg-gray-100 px-8 py-4 dark:bg-gray-700">
                    <span className="font-mono text-2xl font-bold text-primary">
                      {selectedType === 'DID' && `OPS-${currentYear}-######`}
                      {selectedType === 'CID' && `########`}
                      {selectedType === 'UID' && `U########`}
                    </span>
                  </div>
                  <p className="text-sm text-body-color mt-2">
                    Format: {idConfigs[selectedType].format}
                  </p>
                </div>

                {/* Generate Button */}
                <div className="flex justify-center mb-6">
                  <button
                    onClick={generateUniqueId}
                    disabled={checking || loading || !gasUrl}
                    className="min-w-[300px] rounded-lg bg-primary px-8 py-4 text-white hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg font-medium"
                  >
                    {checking ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Checking uniqueness...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate {idConfigs[selectedType].name}
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
                    <p className="text-sm text-body-color mb-2 text-center">Generated {idConfigs[selectedType].name}</p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <span className="font-mono text-3xl font-bold text-primary break-all text-center">
                        {generatedId}
                      </span>
                      <button
                        onClick={() => copyToClipboard(generatedId)}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
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

              {/* Recent History */}
              {generatedHistory.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                    Recently Generated
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {generatedHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {item.type}
                          </span>
                          <p className="font-mono text-sm text-black dark:text-white">
                            {item.value}
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.value)}
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

              {/* Info Card */}
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">How it works</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      IDs are checked against the <span className="font-mono">VerificationLog</span> sheet to ensure uniqueness.
                      Document IDs use OPS-YYYY-###### format (4 digits first, then 6 if needed).
                      Client IDs are 8-digit numbers. User IDs are U + 8 digits.
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

export default IDGeneratorPage;

{/*
  
  
  

// Configuration - Replace with your spreadsheet ID
const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('V_SHEET');

function doGet(e) {
  const action = e.parameter.action;
  const id = e.parameter.id;
  
  // Set CORS headers
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    // Open spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    if (action === 'verify' && id) {
      return handleVerification(ss, id);
    } else if (action === 'getRecent') {
      return handleGetRecent(ss);
    } else {
      return output.setContent(JSON.stringify({
        success: false,
        error: 'Invalid action'
      }));
    }
  } catch (error) {
    return output.setContent(JSON.stringify({
      success: false,
      error: error.toString()
    }));
  }
}

function handleVerification(ss, documentId) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Get Documents sheet
  const sheet = ss.getSheetByName('Documents');
  if (!sheet) {
    return output.setContent(JSON.stringify({
      success: false,
      error: 'Documents sheet not found'
    }));
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Find column indices (adjust if your sheet structure is different)
  const columnMap = {
    id: 0,
    documentId: 1,
    documentType: 2,
    issueDate: 3,
    expiryDate: 4,
    status: 5,
    holderName: 6,
    organization: 7,
    email: 8,
    phone: 9,
    description: 10,
    issuedBy: 11,
    verifiedOn: 12,
    certificateUrl: 13
  };
  
  // Find document by ID
  for (let i = 1; i < data.length; i++) {
    if (data[i][columnMap.documentId] === documentId) {
      const document = {
        id: data[i][columnMap.id],
        documentId: data[i][columnMap.documentId],
        documentType: data[i][columnMap.documentType],
        issueDate: data[i][columnMap.issueDate],
        expiryDate: data[i][columnMap.expiryDate],
        status: data[i][columnMap.status],
        holderName: data[i][columnMap.holderName],
        organization: data[i][columnMap.organization],
        email: data[i][columnMap.email],
        phone: data[i][columnMap.phone],
        description: data[i][columnMap.description],
        issuedBy: data[i][columnMap.issuedBy],
        verifiedOn: data[i][columnMap.verifiedOn],
        certificateUrl: data[i][columnMap.certificateUrl]
      };
      
      // Log verification
      logVerification(ss, documentId);
      
      return output.setContent(JSON.stringify({
        success: true,
        data: document
      }));
    }
  }
  
  return output.setContent(JSON.stringify({
    success: false,
    error: 'Document not found'
  }));
}

function handleGetRecent(ss) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Get Documents sheet
  const sheet = ss.getSheetByName('Documents');
  if (!sheet) {
    return output.setContent(JSON.stringify({
      success: false,
      error: 'Documents sheet not found'
    }));
  }
  
  const data = sheet.getDataRange().getValues();
  
  // Get recent documents (last 5 entries)
  const recent = [];
  for (let i = Math.max(1, data.length - 5); i < data.length; i++) {
    recent.push({
      id: data[i][0],
      documentId: data[i][1],
      documentType: data[i][2],
      status: data[i][5],
      holderName: data[i][6],
      verifiedOn: data[i][12]
    });
  }
  
  return output.setContent(JSON.stringify({
    success: true,
    data: recent.reverse()
  }));
}

function logVerification(ss, documentId) {
  try {
    const logSheet = ss.getSheetByName('VerificationLog');
    if (!logSheet) {
      // Create log sheet if it doesn't exist
      ss.insertSheet('VerificationLog');
      const newSheet = ss.getSheetByName('VerificationLog');
      newSheet.appendRow(['Timestamp', 'Document ID', 'Verifier', 'Method']);
    }
    
    const sheet = ss.getSheetByName('VerificationLog');
    sheet.appendRow([
      new Date(),
      documentId,
      'Web User',
      'Web Verification'
    ]);
  } catch (error) {
    console.error('Failed to log verification:', error);
  }
}

function doPost(e) {
  return doGet(e);
}
  
  
  */}
