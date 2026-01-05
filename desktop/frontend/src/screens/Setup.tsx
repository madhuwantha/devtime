import React, { useEffect, useState } from 'react';
import { IsDBInitialized, InitializeDB } from '../../wailsjs/go/main/App';

export default function Setup() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Checking database...');
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    checkDBStatus();
  }, []);

  const checkDBStatus = async () => {
    try {
      setIsChecking(true);
      const initialized = await IsDBInitialized();
      setIsInitialized(initialized);
      if (initialized) {
        setStatus('Database already initialized');
        setProgress(100);
      } else {
        setStatus('Database not found. Ready to initialize.');
        setProgress(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check database status');
    } finally {
      setIsChecking(false);
    }
  };

  const handleInitialize = async () => {
    try {
      setIsInitializing(true);
      setError(null);
      setProgress(0);
      setStatus('Preparing database location...');

      // Simulate progress updates
      const updateProgress = (msg: string, percent: number) => {
        setStatus(msg);
        setProgress(percent);
      };

      updateProgress('Creating database file...', 30);
      await new Promise(resolve => setTimeout(resolve, 300));

      updateProgress('Setting up database schema...', 60);
      await InitializeDB();
      
      updateProgress('Database initialized successfully!', 100);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reload to show main app
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize database');
      setIsInitializing(false);
      setProgress(0);
    }
  };

  if (isChecking) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Checking database status...</p>
        </div>
      </div>
    );
  }

  if (isInitialized && !isInitializing) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-semibold text-slate-200 mb-2">Database Ready</h2>
          <p className="text-slate-400">Redirecting to application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-slate-800/90 rounded-xl p-8 border border-slate-700/50 shadow-xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🚀</div>
            <h1 className="text-3xl font-bold text-slate-200 mb-2">Welcome to DevTime</h1>
            <p className="text-slate-400">Let's set up your database</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">{status}</span>
              <span className="text-sm text-slate-400">{progress}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleInitialize}
            disabled={isInitializing}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isInitializing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Initializing...</span>
              </>
            ) : (
              <span>Initialize Database</span>
            )}
          </button>

          <p className="text-xs text-slate-500 mt-4 text-center">
            Database will be created in your home directory
          </p>
        </div>
      </div>
    </div>
  );
}

