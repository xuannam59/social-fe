import React, { useEffect, useRef, useState } from 'react';

interface IProps {
  duration: number;
  paused?: boolean;
  onComplete: () => void;
  status: 'completed' | 'current' | 'upcoming';
  className?: string;
}

const ProgressBar: React.FC<IProps> = ({ 
  duration, 
  paused = false, 
  onComplete, 
  status,
  className = '' 
}) => {
  const [percent, setPercent] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  // Reset progress khi status thay đổi
  useEffect(() => {
    if (status === 'completed') {
      setPercent(100);
    } else if (status === 'upcoming') {
      setPercent(0);
    } else if (status === 'current') {
      setPercent(0);
    }
  }, [status]);

  // Chỉ chạy animation khi status là 'current'
  useEffect(() => {
    if (status !== 'current' || paused || percent >= 100) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        lastTsRef.current = null;
      }
      return;
    }

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const delta = ts - lastTsRef.current;
      lastTsRef.current = ts;

      setPercent(p => {
        const next = Math.min(100, p + (delta / duration) * 100);
        if (next >= 100) {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
          lastTsRef.current = null;
          onComplete();
        }
        return next;
      });

      if (!paused && status === 'current') {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        lastTsRef.current = null;
      }
    };
  }, [paused, duration, percent, onComplete, status]);

  // Xác định width dựa trên status
  const getProgressWidth = () => {
    switch (status) {
      case 'completed':
        return '100%';
      case 'upcoming':
        return '0%';
      case 'current':
        return `${percent}%`;
      default:
        return '0%';
    }
  };

  return (
    <div className={`flex-1 h-full bg-black/30 rounded-full overflow-hidden relative ${className} shadow-md`}>
      <div 
        className="absolute inset-0 bg-white transition-all duration-100 ease-linear rounded-full"
        style={{ 
          width: getProgressWidth(),
          transformOrigin: 'left'
        }}
      />
    </div>
  );
};

export default ProgressBar;
