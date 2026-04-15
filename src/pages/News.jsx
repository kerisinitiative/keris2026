import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ImageCarousel from '../components/ui/ImageCarousel'

const CATEGORIES = ['All', 'Event', 'Update', 'Announcement']


function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function News() {
  const [entries, setEntries]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('All')

  useEffect(() => {
    supabase
      .from('news_entries')
      .select('*')
      .order('date', { ascending: false })
      .then(({ data }) => {
        setEntries(data || [])
        setLoading(false)
      })
  }, [])

  const filtered = filter === 'All'
    ? entries
    : entries.filter(e => e.category === filter)

  return (
    <div className="page-enter pt-24 pb-20 bg-gradient-to-b from-wine/30 via-wine/20 to-wine/30">

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 mb-16 text-center">
        <p
          className="text-gold/60 text-xs font-700 tracking-[0.3em] uppercase mb-4"
          style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
        >
          Latest from KERIS
        </p>
        <h1
          className="text-5xl md:text-7xl font-900 text-cream leading-none mb-6"
          style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}
        >
          News &amp;
          <br />
          <span className="text-gold">Events</span>
        </h1>
        <p className="text-cream/55 font-times text-lg max-w-xl mx-auto leading-relaxed">
          Stay up to date with the latest events, announcements, and updates from the KERIS community.
        </p>
      </div>

      {/* Category filter */}
      <div className="max-w-5xl mx-auto px-6 mb-10 flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 text-xs font-700 uppercase tracking-wider border transition-colors ${
              filter === cat
                ? 'bg-gold text-maroon border-gold'
                : 'text-cream/50 border-gold/20 hover:border-gold/40'
            }`}
            style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700, borderRadius: 0 }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="max-w-5xl mx-auto px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-cream/30 font-times py-20">No entries found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((entry, i) => (
              <Link
                key={entry.id}
                to={`/news/${entry.id}`}
                className="glass-card card-glow flex flex-col animate-fade-up group cursor-pointer"
                style={{ borderRadius: 0, animationDelay: `${i * 0.07}s` }}
              >
                {/* Image carousel */}
                {Array.isArray(entry.image_urls) && entry.image_urls.length > 0 ? (
                  <ImageCarousel images={entry.image_urls} heightClass="h-48" />
                ) : (
                  <div className="w-full h-32 bg-wine/20 flex items-center justify-center">
                    <span className="text-gold/20 text-4xl font-spartan font-900" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                      KERIS
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Category + Date */}
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    {entry.category && (
                      <span
                        className="text-xs font-700 uppercase tracking-wider text-gold border border-gold/30 px-2 py-0.5"
                        style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700, borderRadius: 0 }}
                      >
                        {entry.category}
                      </span>
                    )}
                    {entry.date && (
                      <span className="text-xs text-cream/35 font-times">
                        {formatDate(entry.date)}
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-lg font-700 text-cream mb-3 leading-snug group-hover:text-gold transition-colors"
                    style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
                  >
                    {entry.title}
                  </h3>
                  <p className="text-cream/55 font-times text-sm leading-relaxed flex-1 line-clamp-4">
                    {entry.body}
                  </p>
                  <p className="mt-4 text-xs text-gold/50 group-hover:text-gold transition-colors font-spartan uppercase tracking-wider" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                    Read more →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
