import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { StrategyFile } from '../types';

interface PNGGalleryProps {
  files: StrategyFile[];
}

export default function PNGGallery({ files }: PNGGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<StrategyFile | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
  };

  const pngs = files.filter(f => f.file_type === 'png').sort((a, b) => a.display_order - b.display_order);

  return (
    <>
      <div className="relative group">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full
            bg-charcoal-800/90 border border-charcoal-600 flex items-center justify-center
            text-charcoal-200 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-3
            hover:bg-charcoal-700 interactive shadow-lg"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full
            bg-charcoal-800/90 border border-charcoal-600 flex items-center justify-center
            text-charcoal-200 opacity-0 group-hover:opacity-100 transition-opacity translate-x-3
            hover:bg-charcoal-700 interactive shadow-lg"
        >
          <ChevronRight size={16} />
        </button>

        {/* Scrollable gallery */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        >
          {pngs.map((file, i) => (
            <div
              key={file.id}
              onClick={() => { setLightbox(file); setActiveIdx(i); }}
              className={`flex-none w-64 md:w-72 cursor-pointer group/card rounded-xl overflow-hidden
                border border-charcoal-700 hover:border-forest-600/60 transition-all duration-200
                bg-charcoal-850 hover:shadow-lg hover:shadow-forest-900/30`}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={file.file_url}
                  alt={file.display_label}
                  className="w-full h-full object-cover transition-transform duration-300
                    group-hover/card:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 to-transparent
                  opacity-0 group-hover/card:opacity-100 transition-opacity flex items-end justify-between p-3">
                  <span className="text-xs text-charcoal-100 font-medium">{file.display_label}</span>
                  <Maximize2 size={14} className="text-charcoal-200" />
                </div>
              </div>
              <div className="px-3 py-2">
                <p className="text-xs text-charcoal-300 font-medium truncate">{file.display_label}</p>
                <p className="text-xs text-charcoal-500 mt-0.5">Chart {i + 1} of {pngs.length}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Count indicator */}
        <div className="flex gap-1 mt-3 justify-center">
          {pngs.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-200
                ${i === activeIdx ? 'w-6 bg-forest-400' : 'w-1.5 bg-charcoal-600'}`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/95
            backdrop-blur-sm animate-fade-in p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="max-w-4xl w-full bg-charcoal-850 rounded-2xl overflow-hidden border
              border-charcoal-700 shadow-2xl animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-charcoal-700">
              <span className="text-sm font-semibold text-charcoal-100">{lightbox.display_label}</span>
              <button
                onClick={() => setLightbox(null)}
                className="text-charcoal-400 hover:text-charcoal-100 transition-colors text-lg leading-none"
              >×</button>
            </div>
            <img
              src={lightbox.file_url}
              alt={lightbox.display_label}
              className="w-full object-contain max-h-[70vh]"
            />
            {/* Nav arrows in lightbox */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-charcoal-700">
              <button
                disabled={activeIdx === 0}
                onClick={() => { const prev = pngs[activeIdx - 1]; if (prev) { setLightbox(prev); setActiveIdx(i => i - 1); } }}
                className="text-xs text-charcoal-300 hover:text-charcoal-100 disabled:opacity-30 transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <span className="text-xs text-charcoal-500">{activeIdx + 1} / {pngs.length}</span>
              <button
                disabled={activeIdx === pngs.length - 1}
                onClick={() => { const next = pngs[activeIdx + 1]; if (next) { setLightbox(next); setActiveIdx(i => i + 1); } }}
                className="text-xs text-charcoal-300 hover:text-charcoal-100 disabled:opacity-30 transition-colors flex items-center gap-1"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
