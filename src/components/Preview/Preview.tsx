import { useEffect, useRef, useState } from 'react';
import { generateSvg } from '../../lib/generateFlyer';
import type { FlyerData } from '../../types/FlyerData';

interface Props {
  data: Partial<FlyerData>;
  isExpanded: boolean;
  onToggle: () => void;
}

export function Preview({ data, isExpanded, onToggle }: Props) {
  const [svgUrl, setSvgUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const prevUrlRef = useRef('');

  useEffect(() => {
    let cancelled = false;
    setIsGenerating(true);

    generateSvg(data)
      .then((svg) => {
        if (cancelled) return;
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = url;
        setSvgUrl(url);
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setIsGenerating(false); });

    return () => { cancelled = true; };
  }, [data]);

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
        <div className="preview-panel__frame">
          {isGenerating && <div className="preview-panel__spinner" aria-label="Rendering preview…" />}
          {svgUrl && (
            <img
              src={svgUrl}
              alt="Flyer preview"
              className="preview-panel__img"
              style={{ opacity: isGenerating ? 0.4 : 1 }}
            />
          )}
        </div>
      )}
    </aside>
  );
}
