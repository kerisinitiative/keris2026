import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <div
          className="text-gold-shimmer text-8xl font-900 leading-none mb-4"
          style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}
        >
          404
        </div>
        <h2 className="text-2xl font-700 text-cream mb-4" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
          Page Not Found
        </h2>
        <p className="text-cream/40 font-times mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">← Back to Home</Link>
      </div>
    </div>
  )
}
