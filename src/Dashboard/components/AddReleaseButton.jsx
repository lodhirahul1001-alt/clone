import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export function AddReleaseButton({ onClick }) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    if (onClick) onClick();
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group
        relative
        inline-flex
        items-center
        gap-2
        bg-gradient-to-r
        from-red-500
        to-pink-500
        px-4
        py-2
        rounded-lg
        text-[color:var(--text)]
        font-medium
        transition-all
        duration-200
        hover:scale-105
        hover:shadow-lg
        hover:from-red-600
        hover:to-pink-600
        active:scale-95
        dark:from-red-600
        dark:to-pink-600
        dark:hover:from-red-700
        dark:hover:to-pink-700
        ${isPressed ? 'scale-95' : ''}
      `}
      aria-label="Add new release"
    >
      <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
      <span>Add New</span>
      <div className="absolute inset-0 rounded-lg bg-transparent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
