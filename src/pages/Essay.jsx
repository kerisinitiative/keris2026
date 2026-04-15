// TODO: Replace with the actual essay helper link
const ESSAY_LINK = ''

export default function Essay() {
  return (
    <div className="page-enter pt-24 pb-20 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <p className="text-gold/60 text-xs font-700 tracking-[0.3em] uppercase mb-3"
          style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
          Career Tools
        </p>
        <h1 className="text-4xl font-900 text-cream mb-4"
          style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}>
          Essay <span className="text-gold">Helper</span>
        </h1>
        <p className="text-cream/50 font-times mb-8">
          Use our essay helper to write a compelling scholarship application essay.
        </p>
        <a
          href={ESSAY_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Open Essay Helper →
        </a>
      </div>
    </div>
  )
}