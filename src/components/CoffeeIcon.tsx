import React from 'react';

interface CoffeeIconProps {
  type: string;
  className?: string;
}

export default function CoffeeIcon({ type, className = "w-16 h-16" }: CoffeeIconProps) {
  const getIconForType = (coffeeType: string) => {
    switch (coffeeType.toLowerCase()) {
      case 'cappuccino':
        return (
          <svg viewBox="0 0 100 100" className={className}>
            <circle cx="50" cy="70" r="25" fill="#8B4513" />
            <path d="M25 70 Q25 50 50 50 Q75 50 75 70" fill="#D2B48C" />
            <circle cx="35" cy="45" r="3" fill="#FFF" />
            <circle cx="50" cy="42" r="3" fill="#FFF" />
            <circle cx="65" cy="45" r="3" fill="#FFF" />
            <rect x="40" y="20" width="20" height="30" rx="10" fill="#8B4513" />
          </svg>
        );
      case 'espresso':
        return (
          <svg viewBox="0 0 100 100" className={className}>
            <rect x="35" y="30" width="30" height="50" rx="5" fill="#2F1B14" />
            <rect x="40" y="25" width="20" height="10" rx="3" fill="#8B4513" />
            <circle cx="50" cy="75" r="8" fill="#8B4513" />
            <path d="M45 75 L55 75 L52 85 L48 85 Z" fill="#654321" />
          </svg>
        );
      case 'latte':
        return (
          <svg viewBox="0 0 100 100" className={className}>
            <rect x="35" y="40" width="30" height="40" rx="5" fill="#FFF" stroke="#8B4513" strokeWidth="2" />
            <rect x="35" y="20" width="30" height="25" rx="5" fill="#8B4513" />
            <path d="M35 45 Q35 35 50 35 Q65 35 65 45" fill="#FFF" />
            <circle cx="45" cy="50" r="2" fill="#8B4513" />
            <circle cx="55" cy="55" r="2" fill="#8B4513" />
          </svg>
        );
      case 'americano':
        return (
          <svg viewBox="0 0 100 100" className={className}>
            <rect x="35" y="30" width="30" height="50" rx="5" fill="#FFF" stroke="#8B4513" strokeWidth="2" />
            <rect x="35" y="20" width="30" height="15" rx="5" fill="#8B4513" />
            <path d="M30 50 L70 50" stroke="#4169E1" strokeWidth="3" />
            <path d="M30 55 L70 55" stroke="#4169E1" strokeWidth="3" />
            <circle cx="50" cy="75" r="8" fill="#8B4513" />
          </svg>
        );
      case 'mocha':
        return (
          <svg viewBox="0 0 100 100" className={className}>
            <rect x="35" y="40" width="30" height="40" rx="5" fill="#8B4513" />
            <rect x="35" y="20" width="30" height="25" rx="5" fill="#654321" />
            <path d="M35 45 Q35 35 50 35 Q65 35 65 45" fill="#8B4513" />
            <rect x="40" y="50" width="4" height="15" fill="#654321" />
            <rect x="48" y="50" width="4" height="15" fill="#654321" />
            <rect x="56" y="50" width="4" height="15" fill="#654321" />
          </svg>
        );
      case 'caramel-macchiato':
        return (
          <svg viewBox="0 0 100 100" className={className}>
            <rect x="35" y="40" width="30" height="40" rx="5" fill="#FFF" stroke="#8B4513" strokeWidth="2" />
            <rect x="35" y="20" width="30" height="25" rx="5" fill="#8B4513" />
            <path d="M35 45 Q35 35 50 35 Q65 35 65 45" fill="#FFF" />
            <path d="M40 50 Q45 48 50 50 Q55 48 60 50" stroke="#D2691E" strokeWidth="3" fill="none" />
            <circle cx="45" cy="55" r="2" fill="#D2691E" />
            <circle cx="55" cy="58" r="2" fill="#D2691E" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 100 100" className={className}>
            <circle cx="50" cy="70" r="25" fill="#8B4513" />
            <path d="M25 70 Q25 50 50 50 Q75 50 75 70" fill="#D2B48C" />
            <rect x="40" y="20" width="20" height="30" rx="10" fill="#8B4513" />
          </svg>
        );
    }
  };

  return getIconForType(type);
}