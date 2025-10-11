import React from 'react';

export const FloatingElements: React.FC = () => {
  return (
    <>
      <div className="fixed top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
    </>
  );
};
