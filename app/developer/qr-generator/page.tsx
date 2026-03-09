'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import Barcode from 'react-barcode';

// Types
type TabType = 'qr' | 'barcode';
type BarcodeFormat = 'CODE128' | 'EAN13' | 'EAN8' | 'UPC' | 'CODE39' | 'ITF14' | 'MSI' | 'pharmacode';

const QRBarCodeGenerator = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('qr');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // QR Code settings
  const [qrSettings, setQrSettings] = useState({
    size: 250,
    margin: 2,
    color: '#000000',
    bgColor: '#ffffff',
    errorCorrection: 'M' as 'L' | 'M' | 'Q' | 'H'
  });

  // Barcode settings
  const [barcodeSettings, setBarcodeSettings] = useState({
    format: 'CODE128' as BarcodeFormat,
    width: 2,
    height: 80,
    fontSize: 16,
    color: '#000000',
    bgColor: '#ffffff',
    displayValue: true,
    textMargin: 5,
    margin: 10
  });

  // Generated outputs
  const [qrCode, setQrCode] = useState('');
  const [barcodeValue, setBarcodeValue] = useState('');
  const [recentHistory, setRecentHistory] = useState<Array<{
    type: string;
    input: string;
    output: string;
    timestamp: string;
  }>>([]);

  /*// Preset examples
  const examples = {
    url: 'https://opsoraagency.com',
    text: 'Hello World',
    number: '1234567890',
    product: '978020137962',
    wifi: 'WIFI:S:MyNetwork;T:WPA;P:password123;;',
    email: 'mailto:info@opsora.com',
    phone: 'tel:+1234567890',
    sms: 'smsto:12345:Hello'
  };*/

  const validateInput = () => {
    if (!input.trim()) {
      setError('Please enter text, URL, or number');
      return false;
    }
    setError('');
    return true;
  };

  // Generate QR Code
  const generateQR = async () => {
    if (!validateInput()) return;

    setLoading(true);
    try {
      const qr = await QRCode.toDataURL(input, {
        width: qrSettings.size,
        margin: qrSettings.margin,
        color: {
          dark: qrSettings.color,
          light: qrSettings.bgColor
        },
        errorCorrectionLevel: qrSettings.errorCorrection
      });
      setQrCode(qr);
      
      // Add to history
      setRecentHistory(prev => [{
        type: 'QR Code',
        input: input,
        output: qr,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 4)]);
      
    } catch (err) {
      setError('Failed to generate QR code. Check your input.');
    } finally {
      setLoading(false);
    }
  };

  // Generate Barcode
  const generateBarcode = () => {
    if (!validateInput()) return;

    // Validate for specific formats
    if (barcodeSettings.format === 'EAN13' && !/^\d{12}$/.test(input)) {
      setError('EAN-13 requires exactly 12 digits');
      return;
    }
    if (barcodeSettings.format === 'EAN8' && !/^\d{7}$/.test(input)) {
      setError('EAN-8 requires exactly 7 digits');
      return;
    }
    if (barcodeSettings.format === 'UPC' && !/^\d{11}$/.test(input)) {
      setError('UPC requires exactly 11 digits');
      return;
    }

    setBarcodeValue(input);
    
    // Add to history
    setRecentHistory(prev => [{
      type: 'Barcode',
      input: input,
      output: input,
      timestamp: new Date().toISOString()
    }, ...prev.slice(0, 4)]);
  };

  // Download QR Code
  const downloadQR = () => {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qrcode-${Date.now()}.png`;
    link.click();
  };

  // Download Barcode as SVG
  const downloadBarcodeSVG = () => {
    const barcodeElement = document.getElementById('generated-barcode');
    if (!barcodeElement) return;
    
    const svgData = new XMLSerializer().serializeToString(barcodeElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const link = document.createElement('a');
    link.href = svgUrl;
    link.download = `barcode-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(svgUrl);
  };

  // Download Barcode as PNG
  const downloadBarcodePNG = () => {
    const barcodeElement = document.getElementById('generated-barcode');
    if (!barcodeElement) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(barcodeElement);
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      // Fill background
      if (ctx && barcodeSettings.bgColor !== '#ffffff') {
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = barcodeSettings.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `barcode-${Date.now()}.png`;
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const resetSettings = () => {
    if (activeTab === 'qr') {
      setQrSettings({
        size: 250,
        margin: 2,
        color: '#000000',
        bgColor: '#ffffff',
        errorCorrection: 'M'
      });
    } else {
      setBarcodeSettings({
        format: 'CODE128',
        width: 2,
        height: 80,
        fontSize: 16,
        color: '#000000',
        bgColor: '#ffffff',
        displayValue: true,
        textMargin: 5,
        margin: 10
      });
    }
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
                QR & Barcode Generator
              </h1>
              <p className="text-body-color">Create QR codes and barcodes from any text, URL, or number</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Input & Settings */}
            <div className="lg:col-span-1 space-y-6">
              {/* Tab Switcher */}
              <div className="flex rounded-lg border border-gray-200 p-1 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('qr')}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'qr'
                      ? 'bg-primary text-white'
                      : 'text-body-color hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  QR Code
                </button>
                <button
                  onClick={() => setActiveTab('barcode')}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'barcode'
                      ? 'bg-primary text-white'
                      : 'text-body-color hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Barcode
                </button>
              </div>

              {/* Input Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">Input</h2>
                
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={activeTab === 'qr' 
                    ? "Enter URL, text, or any data..." 
                    : "Enter numbers or text for barcode..."}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-700 dark:text-white"
                />

                {error && (
                  <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}

               {/* {/* Example Buttons
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
                </div>*/}

                <button
                  onClick={activeTab === 'qr' ? generateQR : generateBarcode}
                  disabled={loading || !input}
                  className="mt-4 w-full rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Generating...' : `Generate ${activeTab === 'qr' ? 'QR Code' : 'Barcode'}`}
                </button>
              </div>

              {/* Settings Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-black dark:text-white">Settings</h2>
                  <button
                    onClick={resetSettings}
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    Reset
                  </button>
                </div>

                {activeTab === 'qr' ? (
                  // QR Code Settings
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                        Size: {qrSettings.size}px
                      </label>
                      <input
                        type="range"
                        min="150"
                        max="500"
                        step="10"
                        value={qrSettings.size}
                        onChange={(e) => setQrSettings({ ...qrSettings, size: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                        Margin: {qrSettings.margin}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="4"
                        step="1"
                        value={qrSettings.margin}
                        onChange={(e) => setQrSettings({ ...qrSettings, margin: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Color</label>
                        <input
                          type="color"
                          value={qrSettings.color}
                          onChange={(e) => setQrSettings({ ...qrSettings, color: e.target.value })}
                          className="h-10 w-full rounded border"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Background</label>
                        <input
                          type="color"
                          value={qrSettings.bgColor}
                          onChange={(e) => setQrSettings({ ...qrSettings, bgColor: e.target.value })}
                          className="h-10 w-full rounded border"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-black dark:text-white">Error Correction</label>
                      <select
                        value={qrSettings.errorCorrection}
                        onChange={(e) => setQrSettings({ ...qrSettings, errorCorrection: e.target.value as any })}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-black outline-none focus:border-primary dark:border-gray-700 dark:text-white"
                      >
                        <option value="L">Low (7%)</option>
                        <option value="M">Medium (15%)</option>
                        <option value="Q">Quartile (25%)</option>
                        <option value="H">High (30%)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  // Barcode Settings
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-black dark:text-white">Format</label>
                      <select
                        value={barcodeSettings.format}
                        onChange={(e) => setBarcodeSettings({ ...barcodeSettings, format: e.target.value as BarcodeFormat })}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-black outline-none focus:border-primary dark:border-gray-700 dark:text-white"
                      >
                        <option value="CODE128">CODE128 (Alphanumeric)</option>
                        <option value="EAN13">EAN-13 (12 digits)</option>
                        <option value="EAN8">EAN-8 (7 digits)</option>
                        <option value="UPC">UPC (11 digits)</option>
                        <option value="CODE39">CODE39</option>
                        <option value="ITF14">ITF-14</option>
                        <option value="MSI">MSI</option>
                        <option value="pharmacode">Pharmacode</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Width</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          step="0.5"
                          value={barcodeSettings.width}
                          onChange={(e) => setBarcodeSettings({ ...barcodeSettings, width: parseFloat(e.target.value) })}
                          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-black outline-none focus:border-primary dark:border-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Height</label>
                        <input
                          type="number"
                          min="30"
                          max="200"
                          value={barcodeSettings.height}
                          onChange={(e) => setBarcodeSettings({ ...barcodeSettings, height: parseInt(e.target.value) })}
                          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-black outline-none focus:border-primary dark:border-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Color</label>
                        <input
                          type="color"
                          value={barcodeSettings.color}
                          onChange={(e) => setBarcodeSettings({ ...barcodeSettings, color: e.target.value })}
                          className="h-10 w-full rounded border"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Background</label>
                        <input
                          type="color"
                          value={barcodeSettings.bgColor}
                          onChange={(e) => setBarcodeSettings({ ...barcodeSettings, bgColor: e.target.value })}
                          className="h-10 w-full rounded border"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="displayValue"
                        checked={barcodeSettings.displayValue}
                        onChange={(e) => setBarcodeSettings({ ...barcodeSettings, displayValue: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="displayValue" className="text-sm text-black dark:text-white">
                        Display text below barcode
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Preview & Output */}
            <div className="lg:col-span-2 space-y-6">
              {/* Preview Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">Preview</h2>
                
                <div className="flex min-h-[300px] items-center justify-center">
                  {activeTab === 'qr' ? (
                    qrCode ? (
                      <div className="text-center">
                        <div 
                          className="inline-block p-4 rounded-xl shadow-inner"
                          style={{ backgroundColor: qrSettings.bgColor }}
                        >
                          <img 
                            src={qrCode} 
                            alt="QR Code" 
                            style={{ width: qrSettings.size, height: qrSettings.size }}
                            className="max-w-full h-auto"
                          />
                        </div>
                        
                        {/* QR Download Options */}
                        <div className="mt-6 flex justify-center gap-3">
                          <button
                            onClick={downloadQR}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download PNG
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-body-color">
                        <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        <p>Your QR code will appear here</p>
                      </div>
                    )
                  ) : (
                    barcodeValue ? (
                      <div className="text-center">
                        <div 
                          className="inline-block p-4 rounded-xl shadow-inner"
                          style={{ backgroundColor: barcodeSettings.bgColor }}
                        >
                          <Barcode
                            id="generated-barcode"
                            value={barcodeValue}
                            format={barcodeSettings.format}
                            width={barcodeSettings.width}
                            height={barcodeSettings.height}
                            fontSize={barcodeSettings.fontSize}
                            lineColor={barcodeSettings.color}
                            background={barcodeSettings.bgColor}
                            displayValue={barcodeSettings.displayValue}
                            textMargin={barcodeSettings.textMargin}
                            margin={barcodeSettings.margin}
                          />
                        </div>
                        
                        {/* Barcode Download Options */}
                        <div className="mt-6 flex justify-center gap-3">
                          <button
                            onClick={downloadBarcodePNG}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            PNG
                          </button>
                          <button
                            onClick={downloadBarcodeSVG}
                            className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-2 text-primary hover:bg-primary/10"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            SVG
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-body-color">
                        <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10M8 7v10M12 7v10M16 7v10M20 7v10" />
                        </svg>
                        <p>Your barcode will appear here</p>
                      </div>
                    )
                  )}
                </div>

                {/* Input Summary */}
                {input && (qrCode || barcodeValue) && (
                  <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                    <p className="text-sm text-body-color break-all">
                      <span className="font-medium">Input:</span> {input}
                    </p>
                  </div>
                )}
              </div>

              {/* Recent History */}
              {recentHistory.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">Recent</h2>
                  <div className="grid grid-cols-5 gap-3">
                    {recentHistory.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInput(item.input);
                          if (item.type === 'QR Code') {
                            setActiveTab('qr');
                            setQrCode(item.output);
                          } else {
                            setActiveTab('barcode');
                            setBarcodeValue(item.input);
                          }
                        }}
                        className="group relative rounded-lg border border-gray-200 p-2 hover:border-primary dark:border-gray-700"
                      >
                        {item.type === 'QR Code' ? (
                          <img src={item.output} alt="Recent QR" className="w-full h-auto" />
                        ) : (
                          <div className="h-12 flex items-center justify-center">
                            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10M8 7v10M12 7v10M16 7v10M20 7v10" />
                            </svg>
                          </div>
                        )}
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

          {/* Info Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h3 className="mb-2 font-medium text-blue-800 dark:text-blue-300">QR Code Info</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                QR codes can store URLs, text, contact info, WiFi credentials, and more. 
                Higher error correction means more damage resistance but larger QR codes.
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <h3 className="mb-2 font-medium text-green-800 dark:text-green-300">Barcode Info</h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                Different formats for different uses: CODE128 (alphanumeric), EAN/UPC (retail products), 
                ITF-14 (shipping), Pharmacode (pharmaceuticals).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QRBarCodeGenerator;
