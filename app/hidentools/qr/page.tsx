'use client';

import { useState } from 'react';
import QRCode from 'qrcode';

const QRGeneratorPage = () => {
  const [url, setUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<Array<{ url: string; qr: string; timestamp: string }>>([]);
  const [settings, setSettings] = useState({
    width: 250,
    margin: 2,
    color: '#000000',
    bgColor: '#ffffff',
    errorCorrection: 'M' as 'L' | 'M' | 'Q' | 'H'
  });

  const generateQR = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: settings.width,
        margin: settings.margin,
        color: {
          dark: settings.color,
          light: settings.bgColor
        },
        errorCorrectionLevel: settings.errorCorrection
      });

      setQrCode(qrDataUrl);
      
      // Add to history
      setHistory(prev => [
        {
          url,
          qr: qrDataUrl,
          timestamp: new Date().toISOString()
        },
        ...prev.slice(0, 9) // Keep last 10
      ]);

    } catch (err) {
      setError('Failed to generate QR code');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = (format: 'png' | 'svg' = 'png') => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = qrCode;
    
    // Create filename from URL
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace(/\./g, '-');
    const timestamp = new Date().getTime();
    
    link.download = `qrcode-${domain}-${timestamp}.png`;
    link.click();
  };

  const copyToClipboard = async () => {
    if (!qrCode) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(qrCode);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      alert('QR code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  const presetUrls = [
    { label: 'Website', url: 'https://opsoraagency.com' },
    { label: 'Services', url: 'https://opsoraagency.com/services' },
    { label: 'Contact', url: 'https://opsoraagency.com/contact' },
    { label: 'Verification', url: 'https://opsoraagency.com/verify' },
    { label: 'Client Portal', url: 'https://opsoraagency.com/client-portal' }
  ];

  return (
    <section className="pb-[120px] pt-[150px]">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
              QR Code Generator
            </h1>
            <p className="text-body-color mx-auto max-w-2xl text-base">
              Generate QR codes from any URL. Customize colors, size, and download in PNG format.
            </p>
          </div>

          {/* Preset URLs */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {presetUrls.map((preset, index) => (
              <button
                key={index}
                onClick={() => setUrl(preset.url)}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm text-body-color hover:bg-primary/10 hover:text-primary dark:bg-gray-800 dark:text-gray-300"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Input & Settings */}
            <div className="lg:col-span-1 space-y-6">
              {/* URL Input */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">Enter URL</h2>
                <div className="space-y-4">
                  <div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-700 dark:text-white"
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={generateQR}
                    disabled={loading}
                    className="w-full rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        Generate QR Code
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Settings */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">Settings</h2>
                <div className="space-y-4">
                  {/* Size */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Size: {settings.width}px
                    </label>
                    <input
                      type="range"
                      min="150"
                      max="500"
                      step="10"
                      value={settings.width}
                      onChange={(e) => setSettings({ ...settings, width: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Margin */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Margin: {settings.margin}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="1"
                      value={settings.margin}
                      onChange={(e) => setSettings({ ...settings, margin: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-black dark:text-white">QR Color</label>
                      <input
                        type="color"
                        value={settings.color}
                        onChange={(e) => setSettings({ ...settings, color: e.target.value })}
                        className="h-10 w-full rounded border border-gray-300 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-black dark:text-white">Background</label>
                      <input
                        type="color"
                        value={settings.bgColor}
                        onChange={(e) => setSettings({ ...settings, bgColor: e.target.value })}
                        className="h-10 w-full rounded border border-gray-300 dark:border-gray-700"
                      />
                    </div>
                  </div>

                  {/* Error Correction */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">Error Correction</label>
                    <select
                      value={settings.errorCorrection}
                      onChange={(e) => setSettings({ ...settings, errorCorrection: e.target.value as any })}
                      className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-black outline-none focus:border-primary dark:border-gray-700 dark:text-white"
                    >
                      <option value="L">Low (7%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">Quartile (25%)</option>
                      <option value="H">High (30%)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - QR Preview & Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* QR Code Display */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">Generated QR Code</h2>
                
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                  {qrCode ? (
                    <>
                      <div className="mb-6 p-4 bg-white rounded-xl shadow-inner">
                        <img 
                          src={qrCode} 
                          alt="Generated QR Code" 
                          className="max-w-full h-auto"
                          style={{ width: settings.width, height: settings.width }}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap justify-center gap-3">
                        <button
                          onClick={downloadQR}
                          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download PNG
                        </button>
                        
                        <button
                          onClick={copyToClipboard}
                          className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-3 text-primary hover:bg-primary/10"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          Copy Image
                        </button>
                      </div>

                      {/* URL Info */}
                      <div className="mt-6 w-full rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                        <p className="text-sm text-body-color break-all">
                          <span className="font-medium">URL:</span> {url}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-body-color">
                      <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                      <p>Enter a URL and click Generate to create your QR code</p>
                    </div>
                  )}
                </div>
              </div>

              {/* History */}
              {history.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">Recent QR Codes</h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {history.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setUrl(item.url);
                          setQrCode(item.qr);
                        }}
                        className="group relative rounded-lg border border-gray-200 p-2 hover:border-primary dark:border-gray-700"
                      >
                        <img 
                          src={item.qr} 
                          alt="Recent QR" 
                          className="w-full h-auto"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <span className="text-xs text-white">Use</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
            <h3 className="mb-2 text-lg font-semibold text-blue-800 dark:text-blue-300">About QR Codes</h3>
            <div className="grid grid-cols-1 gap-4 text-sm text-blue-700 dark:text-blue-400 md:grid-cols-2">
              <div>
                <p className="font-medium">✨ Features:</p>
                <ul className="mt-1 list-inside list-disc">
                  <li>Customizable size and colors</li>
                  <li>High error correction available</li>
                  <li>Download as PNG</li>
                  <li>Copy to clipboard</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">📱 Usage Tips:</p>
                <ul className="mt-1 list-inside list-disc">
                  <li>Test with your phone camera</li>
                  <li>Higher margin = better scanning</li>
                  <li>Dark colors on light background work best</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QRGeneratorPage;
