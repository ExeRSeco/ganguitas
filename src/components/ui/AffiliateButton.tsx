"use client";

import Link from 'next/link';
import { AnchorHTMLAttributes, useState } from 'react';

interface AffiliateButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  productId?: string;
  className?: string;
  variant?: 'blue' | 'yellow' | 'orange';
  children: React.ReactNode;
}

export default function AffiliateButton({ href, productId, className = '', variant = 'blue', children, ...props }: AffiliateButtonProps) {
  const [isTracking, setIsTracking] = useState(false);
  const baseClasses = "block w-full text-center font-semibold py-3 px-4 rounded-md transition-colors relative overflow-hidden";
  
  const variants = {
    blue: "bg-ml-blue text-white hover:bg-blue-600",
    yellow: "bg-ml-yellow text-foreground hover:bg-ml-yellow-dark",
    orange: "bg-orange-500 text-white hover:bg-orange-600"
  };

  const isInternal = href.startsWith('#');

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If it's an internal link, let Next.js handle it normally
    if (isInternal) return;
    
    // If it's an external link, we intercept to track
    e.preventDefault();
    
    if (productId && !isTracking) {
      setIsTracking(true);
      try {
        await fetch('/api/track-click', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        });
      } catch (error) {
        console.error("Failed to track click", error);
      } finally {
        setIsTracking(false);
      }
    }
    
    // Open the affiliate link
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <Link 
      href={href} 
      onClick={handleClick}
      target={isInternal ? undefined : "_blank"} 
      rel={isInternal ? undefined : "noopener noreferrer"}
      className={`${baseClasses} ${variants[variant] || variants.blue} ${className}`}
      {...props}
    >
      <span className={isTracking ? "opacity-0" : "opacity-100"}>{children}</span>
      {isTracking && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
    </Link>
  );
}
