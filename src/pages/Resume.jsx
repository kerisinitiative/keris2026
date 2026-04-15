// TODO: Replace with the actual resume tool link
const RESUME_LINK = ''

export default function Resume() {
  return (
    <div className="page-enter pt-24 pb-20 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <p className="text-gold/60 text-xs font-700 tracking-[0.3em] uppercase mb-3"
          style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
          Career Tools
        </p>
        <h1 className="text-4xl font-900 text-cream mb-4"
          style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}>
          Resume <span className="text-gold">Builder</span>
        </h1>
        <p className="text-cream/50 font-times mb-8">
          Use our resume builder to craft a professional resume tailored for scholarship applications.
        </p>
        <a
          href={RESUME_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Open Resume Builder →
        </a>
      </div>
    </div>
  )
}