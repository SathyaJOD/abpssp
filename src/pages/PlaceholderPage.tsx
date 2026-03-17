import React from 'react';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white px-4">
      <h1 className="text-3xl font-bold text-[#1e3a8a] mb-4">{title}</h1>
      <p className="text-slate-600 text-lg text-center max-w-2xl">
        This page is currently under construction. Please check back later for updates.
      </p>
    </div>
  );
}
