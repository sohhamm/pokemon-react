"use client";

import { useEffect, useState } from "react";

export function APIMonitor() {
  const [apiCalls, setApiCalls] = useState<string[]>([]);
  
  useEffect(() => {
    // Monitor fetch calls
    const originalFetch = window.fetch;
    const calls: string[] = [];
    
    window.fetch = function(...args) {
      const url = args[0]?.toString() || '';
      if (url.includes('pokeapi.co')) {
        calls.push(url);
        setApiCalls([...calls]);
        console.log(`API Call ${calls.length}: ${url}`);
      }
      return originalFetch.apply(this, args);
    };
    
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 bg-white/90 p-4 rounded-lg shadow-lg max-w-sm">
      <h3 className="font-bold text-sm mb-2">API Calls Monitor</h3>
      <p className="text-xs text-gray-600 mb-2">
        Total PokeAPI calls: {apiCalls.length}
      </p>
      {apiCalls.length > 0 && (
        <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
          {apiCalls.slice(-5).map((call, i) => (
            <div key={i} className="text-gray-500 truncate">
              {call.replace('https://pokeapi.co/api/v2/', '')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}