import { useEffect, useRef, useState } from 'react';
import type { FlyerData } from '../../types/FlyerData';
import { FlyerTemplate } from '../FlyerTemplate/FlyerTemplate';

interface Props {
  data: Partial<FlyerData>;
  isExpanded: boolean;
  onToggle: () => void;
}

export function Preview({ data, isExpanded, onToggle }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current || !isExpanded) return;
    
    // Auto-scale based on the container width
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // We know the template is exactly 1080px wide
        setScale(entry.contentRect.width / 1080);
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isExpanded]);

  return (
    <aside className="preview-panel">
      <button
        type="button"
        className="preview-panel__toggle btn btn--ghost"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        {isExpanded ? '▼ Hide Preview' : '▶ Show Preview'}
      </button>

      {isExpanded && (
        <div 
          className="preview-panel__frame" 
          ref={containerRef}
          style={{ width: '100%', height: 'auto', aspectRatio: '4/5', position: 'relative' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
            <div
              style={{
                width: '1080px',
                height: '1350px',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <FlyerTemplate data={data} />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
