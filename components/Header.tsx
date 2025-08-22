import React from 'react';
import type { View } from '../types';

interface HeaderProps {
  currentView: View;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const title = currentView.charAt(0).toUpperCase() + currentView.slice(1);

  return (
    <header className="flex-shrink-0 bg-surface border-b border-border px-8 py-4 flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-border transition-colors">
          <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </button>
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full"
            src="https://picsum.photos/100"
            alt="User Avatar"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-text-primary">Aditi Sharma</p>
            <p className="text-xs text-text-secondary">UI/UX Designer</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;