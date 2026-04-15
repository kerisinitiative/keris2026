import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'

export default function ImageUpload({ value, onChange, bucket, label, aspect = 'square' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const inputRef                  = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return }

    setUploading(true)
    setError('')

    const ext  = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true })

    if (uploadError) { setError(uploadError.message); setUploading(false); return }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
    // reset so same file can be re-selected if needed
    e.target.value = ''
  }

  const previewClass = aspect === 'portrait'
    ? 'w-16 h-20 object-cover'
    : 'w-16 h-16 object-cover'

  return (
    <div>
      <label
        className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5"
        style={{ fontFamily: "'League Spartan', sans-serif" }}
      >
        {label}
      </label>

      <div className="flex items-center gap-3">
        {/* Preview */}
        {value ? (
          <div className="relative shrink-0">
            <img src={value} alt="" className={previewClass} />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-crimson text-white text-xs flex items-center justify-center leading-none hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        ) : (
          <div
            className={`${previewClass} bg-wine/30 flex items-center justify-center shrink-0`}
          >
            <span className="text-gold/30 text-xl">+</span>
          </div>
        )}

        {/* Button */}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="keris-input text-left text-sm w-full disabled:opacity-50 cursor-pointer hover:border-gold/40 transition-colors"
          >
            {uploading ? 'Uploading…' : value ? 'Change image' : 'Choose image…'}
          </button>
          {error && (
            <p className="text-red-400 text-xs mt-1 font-times">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
