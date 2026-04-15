import { useState } from 'react'

export default function ImageCarousel({ images = [], heightClass = 'h-48' }) {
  const [idx, setIdx] = useState(0)

  if (!images || images.length === 0) return null

  const prev = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIdx(i => (i - 1 + images.length) % images.length)
  }

  const next = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIdx(i => (i + 1) % images.length)
  }

  const goTo = (e, i) => {
    e.preventDefault()
    e.stopPropagation()
    setIdx(i)
  }

  return (
    <div className="relative overflow-hidden select-none bg-black">
      <img
        src={images[idx]}
        alt=""
        className={`w-full ${heightClass} object-cover transition-opacity duration-200`}
      />

      {images.length > 1 && (
        <>
          {/* Prev */}
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white text-xl flex items-center justify-center transition-colors"
            style={{ borderRadius: 0 }}
            aria-label="Previous image"
          >
            ‹
          </button>

          {/* Next */}
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white text-xl flex items-center justify-center transition-colors"
            style={{ borderRadius: 0 }}
            aria-label="Next image"
          >
            ›
          </button>

          {/* Counter */}
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 font-spartan" style={{ fontFamily: "'League Spartan', sans-serif" }}>
            {idx + 1} / {images.length}
          </div>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => goTo(e, i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-white scale-125' : 'bg-white/40'}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
