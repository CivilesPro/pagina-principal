import { useState } from 'react';

export default function ImageCarousel({ images = [], className = '' }) {
  const [i, setI] = useState(0);
  const go = (dir) => setI((prev) => (prev + dir + images.length) % images.length);
  if (!images.length) return <div className={`aspect-video rounded-xl bg-slate-100 ${className}`} />;
  return (
    <div className={`relative aspect-video rounded-xl overflow-hidden bg-slate-100 ${className}`}>
      <img src={images[i]} alt="" className="w-full h-full object-cover" />
      <button onClick={() => go(-1)} className="absolute inset-y-0 left-0 px-2 opacity-70 hover:opacity-100">
        ‹
      </button>
      <button onClick={() => go(1)} className="absolute inset-y-0 right-0 px-2 opacity-70 hover:opacity-100">
        ›
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((_, idx) => (
          <span key={idx} className={`h-1.5 w-1.5 rounded-full ${idx === i ? 'bg-white' : 'bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
}
