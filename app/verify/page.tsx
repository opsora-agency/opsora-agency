'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import Barcode from 'react-barcode';

interface DocumentData {
  id: string;
  documentId: string;
  documentType: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending' | 'revoked';
  holderName: string;
  organization: string;
  email: string;
  phone?: string;
  description?: string;
  issuedBy: string;
  verifiedOn: string;
  certificateUrl?: string;
}

interface SimpleVerification {
  success: boolean;
  exists: boolean;
  type: string;
  id: string;
}

interface RecentVerification {
  id: string;
  documentId: string;
  documentType: string;
  status: string;
  holderName: string;
  verifiedOn: string;
}

const VerificationPage = () => {
  const [inputId, setInputId] = useState('');
  const [idType, setIdType] = useState<'DID' | 'CID' | 'UID'>('DID');
  const [verificationResult, setVerificationResult] = useState<DocumentData | SimpleVerification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentVerifications, setRecentVerifications] = useState<RecentVerification[]>([]);
  const [gasUrl, setGasUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Detect theme
  useEffect(() => {
    const detectTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                    document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(isDark ? 'dark' : 'light');
    };

    detectTheme();
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme'] 
    });
    return () => observer.disconnect();
  }, []);

  // Get GAS URL from environment variable
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_GAS_URL;
    if (url) {
      setGasUrl(url);
      fetchRecentVerifications(url);
    } else {
      console.error('NEXT_PUBLIC_GAS_URL is not defined in .env.local');
    }
  }, []);

  // Generate QR Code for ID
  const generateQRCode = async (id: string) => {
    try {
      const verificationUrl = `${window.location.origin}/verify?id=${encodeURIComponent(id)}`;
      const qr = await QRCode.toDataURL(verificationUrl, {
        width: 120,
        margin: 0,
        color: {
          dark: theme === 'dark' ? '#FFFFFF' : '#000000',
          light: '#00000000' // Transparent background
        }
      });
      setQrCode(qr);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const fetchRecentVerifications = async (url: string) => {
    try {
      const response = await fetch(`${url}?action=getRecent`);
      const data = await response.json();
      if (data.success) {
        setRecentVerifications(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch recent verifications:', error);
    }
  };

  const detectIdType = (id: string): 'DID' | 'CID' | 'UID' => {
    if (id.startsWith('OPS-')) return 'DID';
    if (id.startsWith('C')) return 'UID';
    if (/^\d+$/.test(id)) return 'CID';
    return 'DID'; // default
  };

  const verifyDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputId.trim()) {
      setError('Please enter an ID');
      return;
    }

    if (!gasUrl) {
      setError('Verification service is not configured');
      return;
    }

    const detectedType = detectIdType(inputId);
    setIdType(detectedType);

    setLoading(true);
    setError('');
    setVerificationResult(null);
    setQrCode('');

    try {
      // Generate QR code for the ID (for CID/UID)
      if (detectedType !== 'DID') {
        await generateQRCode(inputId);
      }

      // For Document IDs (DID) - get full details
      if (detectedType === 'DID') {
        const response = await fetch(`${gasUrl}?action=verify&id=${encodeURIComponent(inputId)}`);
        const data = await response.json();

        if (data.success) {
          setVerificationResult(data.data);
          // Refresh recent verifications
          fetchRecentVerifications(gasUrl);
        } else {
          setError('Document not found or invalid');
        }
      } 
      // For Client IDs (CID) and User IDs (UID) - simple verification
      else {
        // Use the type parameter as expected by your Apps Script
        const response = await fetch(`${gasUrl}?action=verify&type=${detectedType}&id=${encodeURIComponent(inputId)}`);
        const data = await response.json();

        if (data.success && data.exists) {
          setVerificationResult({
            success: true,
            exists: true,
            type: detectedType,
            id: inputId
          });
        } else {
          setError(`${detectedType} not found in our records`);
        }
      }
    } catch (error) {
      setError('Failed to verify. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', label: 'Active' },
      expired: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', label: 'Expired' },
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', label: 'Pending' },
      revoked: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-600 dark:text-gray-400', label: 'Revoked' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.text}`}>
        <span className={`mr-1.5 h-2 w-2 rounded-full ${config.text.replace('text-', 'bg-')}`}></span>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Barcode color based on theme (no background)
  const barcodeColor = theme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <>
      <section className="pb-[120px] pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div>
                {/* Header */}
                <div className="text-center mb-12">
                  <h1 className="mb-4 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                    ID Verification
                  </h1>
                  <p className="text-body-color text-base leading-relaxed max-w-2xl mx-auto">
                    Authenticate any registered 
  identifier including documents, clients, users, certificates, and licenses.
  Enter your ID below to proceed.
                  </p>
                </div>

                {/* ID Type Indicators
                <div className="mb-6 flex flex-wrap justify-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-primary font-bold">DID:</span>
                    <span className="text-body-color">OPS-2024-483729</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-primary font-bold">CID:</span>
                    <span className="text-body-color">12345678</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-primary font-bold">UID:</span>
                    <span className="text-body-color">U12345678</span>
                  </div>
                </div>*/}

                {/* Verification Form */}
                <div className="mb-12 max-w-2xl mx-auto">
                  <form onSubmit={verifyDocument} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={inputId}
                          onChange={(e) => setInputId(e.target.value)}
                          placeholder="Enter your ID to begin verification."
                          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-700 dark:text-white"
                          disabled={loading}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading || !gasUrl}
                        className="rounded-lg bg-primary px-8 py-3 font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Verifying...</span>
                          </>
                        ) : (
                          'Verify'
                        )}
                      </button>
                    </div>
                    
                    {error && (
                      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-600 dark:text-red-400 text-sm">
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{error}</span>
                        </div>
                      </div>
                    )}
                  </form>

                  <p className="text-xs text-body-color mt-3 text-center">
                    All identifiers in our system are original, unique, and officially registered. 
  Each verification is backed by our secure database with real-time authentication.
                  </p>
                </div>

                {/* Verification Result */}
                {verificationResult && (
                  <div className="mb-12 max-w-4xl mx-auto">
                    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800 animate-fadeIn">
                      
                      {/* Document ID (DID) - Show Barcode only */}
                      {'documentType' in verificationResult && (
                        <>
                          {/* Header with Barcode */}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <h2 className="text-2xl font-bold text-black dark:text-white">
                                  Document Verified
                                </h2>
                              </div>
                              <p className="text-body-color">
                                This document has been verified and is authentic.
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              {getStatusBadge(verificationResult.status)}
                              {/* Barcode for DID */}
                              <div className="ml-4">
                                <Barcode
                                  value={verificationResult.documentId}
                                  format="CODE128"
                                  width={1.5}
                                  height={40}
                                  fontSize={0}
                                  displayValue={false}
                                  lineColor={barcodeColor}
                                  background="transparent"
                                  margin={0}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Document Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                              <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                                Document Information
                              </h3>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-xs text-body-color uppercase tracking-wider">Document ID</p>
                                  <p className="font-mono text-sm font-medium text-black dark:text-white bg-gray-50 dark:bg-gray-900 p-2 rounded mt-1">
                                    {verificationResult.documentId}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-body-color uppercase tracking-wider">Document Type</p>
                                  <p className="font-medium text-black dark:text-white mt-1">
                                    {verificationResult.documentType}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-body-color uppercase tracking-wider">Issue Date</p>
                                    <p className="font-medium text-black dark:text-white mt-1">
                                      {formatDate(verificationResult.issueDate)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-body-color uppercase tracking-wider">Expiry Date</p>
                                    <p className="font-medium text-black dark:text-white mt-1">
                                      {formatDate(verificationResult.expiryDate)}
                                    </p>
                                  </div>
                                </div>
                                {verificationResult.description && (
                                  <div>
                                    <p className="text-xs text-body-color uppercase tracking-wider">Description</p>
                                    <p className="text-sm text-black dark:text-white mt-1 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                                      {verificationResult.description}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                                Recipient Information
                              </h3>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-xs text-body-color uppercase tracking-wider">Full Name</p>
                                  <p className="font-medium text-black dark:text-white mt-1 text-lg">
                                    {verificationResult.holderName}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-body-color uppercase tracking-wider">Organization</p>
                                  <p className="text-black dark:text-white mt-1">
                                    {verificationResult.organization}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-body-color uppercase tracking-wider">Email</p>
                                  <p className="text-black dark:text-white mt-1">
                                    {verificationResult.email}
                                  </p>
                                </div>
                                {verificationResult.phone && (
                                  <div>
                                    <p className="text-xs text-body-color uppercase tracking-wider">Phone</p>
                                    <p className="text-black dark:text-white mt-1">
                                      {verificationResult.phone}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="md:col-span-2">
                              <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                                Verification Details
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                  <p className="text-xs text-body-color uppercase tracking-wider">Issued By</p>
                                  <p className="font-medium text-black dark:text-white mt-1">
                                    {verificationResult.issuedBy}
                                  </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                  <p className="text-xs text-body-color uppercase tracking-wider">Verified On</p>
                                  <p className="font-medium text-black dark:text-white mt-1">
                                    {formatDate(verificationResult.verifiedOn)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {verificationResult.certificateUrl && (
                              <div className="md:col-span-2">
                                <a
                                  href={verificationResult.certificateUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90 transition-colors"
                                >
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Download
                                </a>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* Client ID (CID) or User ID (UID) - Show QR only */}
                      {'exists' in verificationResult && verificationResult.exists && (
                        <div>
                          {/* Header with QR Code */}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                            <div className="flex items-center gap-3">
                              <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <h2 className="text-2xl font-bold text-black dark:text-white">
                                {idType === 'CID' ? 'Client ID Verified' : 'User ID Verified'}
                              </h2>
                            </div>
                            {qrCode && (
                              <div className="flex-shrink-0">
                                <img 
                                  src={qrCode} 
                                  alt="QR Code" 
                                  className="w-16 h-16"
                                />
                              </div>
                            )}
                          </div>

                          {/* Success Message */}
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
                            <svg className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-green-700 dark:text-green-400 text-lg">
                              The {/*{idType === 'CID' ? 'Client' : 'User'}*/} ID <span className="font-mono font-bold">{inputId}</span> verified successfully in our records and is authentic.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Verification Seal */}
                      <div className="mt-8 flex items-center justify-center gap-2 border-t border-gray-200 pt-6 dark:border-gray-700">
                        <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-body-color">
                          Verified by Opsora Agency · {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Configuration Notice */}
                {!gasUrl && (
                  <div className="max-w-4xl mx-auto mt-8">
                    <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-6 text-center">
                      <svg className="h-12 w-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                        Verification Service Not Configured
                      </h3>
                      <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                        Please set NEXT_PUBLIC_GAS_URL in your .env.local file to enable verification.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </>
  );
};

export default VerificationPage;
