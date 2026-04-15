import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ImageCarousel from '../components/ui/ImageCarousel'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function NewsDetail() {
  const { id } = useParams()
  const [entry,   setEntry]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('news_entries')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setEntry(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!entry) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-cream/40 font-times text-lg">Entry not found.</p>
      <Link
        to="/news"
        className="text-gold/60 hover:text-gold font-spartan uppercase text-xs tracking-widest transition-colors"
        style={{ fontFamily: "'League Spartan', sans-serif" }}
      >
        ← Back to News
      </Link>
    </div>
  )

  const images = Array.isArray(entry.image_urls) ? entry.image_urls : []

  return (
    <div className="page-enter min-h-screen pb-20 pt-24">
      <div className="max-w-2xl mx-auto px-4 md:px-6">

        {/* Post card — Facebook-style */}
        <div className="glass-card overflow-hidden" style={{ borderRadius: 0 }}>

          {/* Post header */}
          <div className="px-5 pt-5 pb-4 border-b border-gold/10">
            <Link
              to="/news"
              className="text-gold/40 hover:text-gold font-spartan uppercase text-xs tracking-widest transition-colors block mb-4"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              ← News &amp; Events
            </Link>

            <div className="flex items-center gap-3 mb-3">
              {/* KERIS avatar */}
              <div className="w-10 h-10 flex items-center justify-center bg-gold/10 border border-gold/30 shrink-0">
                <img src="/logo.PNG" alt="KERIS" className="w-7 h-7 object-contain" />
              </div>
              <div>
                <p className="text-cream/90 text-sm font-700" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
                  KERIS
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {entry.date && (
                    <span className="text-cream/35 font-times text-xs">{formatDate(entry.date)}</span>
                  )}
                  {entry.category && (
                    <>
                      <span className="text-cream/20 text-xs">·</span>
                      <span
                        className="text-xs font-700 uppercase tracking-wider text-gold/70"
                        style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
                      >
                        {entry.category}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <h1
              className="text-2xl md:text-3xl font-900 text-cream leading-snug"
              style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}
            >
              {entry.title}
            </h1>
          </div>

          {/* Body text */}
          <div className="px-5 py-4">
            <p className="text-cream/75 font-times text-base leading-relaxed whitespace-pre-line">
              {entry.body}
            </p>
          </div>

          {/* Image carousel */}
          {images.length > 0 && (
            <ImageCarousel images={images} heightClass="h-64 md:h-96" />
          )}

          {/* Footer */}
          {images.length > 1 && (
            <div className="px-5 py-3 border-t border-gold/10">
              <p className="text-cream/25 text-xs font-times">{images.length} photos</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
