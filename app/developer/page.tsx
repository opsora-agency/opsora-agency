'use client';

import Link from 'next/link';

interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  color: string;
  icon: React.ReactNode;
}

const HiddenToolsPage = () => {
  // Hidden tools list with SVG icons only
  const tools: Tool[] = [
    {
      id: 'qr-generator',
      name: 'QR Code Generator',
      description: 'Generate QR codes from any URL or text with custom colors and sizes',
      path: '/developer/qr-generator',
      color: 'bg-blue-500',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    },
    {
      id: 'barcode-generator',
      name: 'Barcode Generator',
      description: 'Create Code128, EAN, UPC barcodes for products and documents',
      path: '/developer/qr-generator',
      color: 'bg-green-500',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10M8 7v10M12 7v10M16 7v10M20 7v10" />
        </svg>
      )
    },
    {
      id: 'uuid-generator',
      name: 'Document ID Generator',
      description: 'Generate random Document ID with one click',
      path: '/developer/id-generator',
      color: 'bg-indigo-500',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      )
    },
    {
      id: 'uuid-generator',
      name: 'Client ID Generator',
      description: 'Generate random Client ID with one click',
      path: '/developer/id-generator',
      color: 'bg-indigo-500',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      )
    },
    {
      id: 'uuid-generator',
      name: 'User ID Generator',
      description: 'Generate random User ID with one click',
      path: '/developer/id-generator',
      color: 'bg-indigo-500',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      )
    },
    {
      id: 'json-formatter',
      name: 'JSON Formatter',
      description: 'Format, validate, and prettify JSON data',
      path: '/developer/json-formatter',
      color: 'bg-cyan-500',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10M8 7v10M12 7v10M16 7v10M20 7v10" />
        </svg>
      )
    },
  ];

  return (
    <section className="pb-[120px] pt-[150px]">
      <div className="container">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="text-sm font-medium">Developer Utilities</span>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
              Hidden Tools
            </h1>
            <p className="text-body-color mx-auto max-w-2xl text-base">
              A collection of useful tools for developers and power users. 
              Bookmark this page for quick access.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Tool Icon */}
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${tool.color} bg-opacity-10 text-${tool.color.split('-')[1]}-600 dark:text-${tool.color.split('-')[1]}-400`}>
                  {tool.icon}
                </div>

                {/* Tool Info */}
                <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
                  {tool.name}
                </h3>
                <p className="mb-4 text-sm text-body-color">
                  {tool.description}
                </p>

                {/* Tool Link */}
                <div className="inline-flex items-center gap-1 text-sm text-primary group-hover:text-primary/80">
                  Open Tool
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Hidden Badge */}
                <div className="absolute right-4 top-4">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Secret Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-body-color">
              <span className="opacity-50"></span> These tools are intentionally hidden. Only those who know about them can access them. Use them wisely!
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs text-body-color dark:bg-gray-800">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>Bookmark this page: Press Ctrl+D</span>
            </div>
          </div>

          {/* Quick Access Paths
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {tools.slice(0, 8).map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="rounded-lg border border-gray-200 bg-white/50 p-3 text-center transition-colors hover:border-primary hover:bg-primary/5 dark:border-gray-700 dark:bg-gray-800/50"
              >
                <p className="font-mono text-xs text-body-color truncate">{tool.path}</p>
                <p className="text-xs text-primary mt-1">{tool.name}</p>
              </Link>
            ))}
          </div>*/}

          {/* Stats */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-body-color">
           {/* <span>{tools.length} tools available</span>
            <span>•</span>*/}
            <span>Updated on March 2026</span>
            <span>•</span>
            <span>Opsora Agency</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HiddenToolsPage;
