import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

const CATEGORIES = ['Event', 'Update', 'Announcement']

const EMPTY = {
  title: '', body: '', date: '', category: 'Event', image_urls: [],
}

export default function EditNews() {
  const [entries,    setEntries]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [form,       setForm]       = useState(EMPTY)
  const [editing,    setEditing]    = useState(null)
  const [saving,     setSaving]     = useState(false)
  const [uploading,  setUploading]  = useState(false)
  const [uploadErr,  setUploadErr]  = useState('')
  const [error,      setError]      = useState('')
  const [filter,     setFilter]     = useState('all')
  const fileRef = useRef(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('news_entries')
      .select('*')
      .order('date', { ascending: false })
    setEntries(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew  = ()  => { setForm(EMPTY); setEditing('new'); setError(''); setUploadErr('') }
  const openEdit = (e) => {
    setForm({ ...EMPTY, ...e, image_urls: Array.isArray(e.image_urls) ? e.image_urls : [] })
    setEditing(e.id)
    setError('')
    setUploadErr('')
  }
  const cancel = () => { setEditing(null); setError('') }
  const set    = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleAddImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setUploadErr('Please select an image file.'); return }

    setUploading(true)
    setUploadErr('')

    const ext  = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(path, file, { upsert: true })

    if (uploadError) { setUploadErr(uploadError.message); setUploading(false); return }

    const { data } = supabase.storage.from('news-images').getPublicUrl(path)
    set('image_urls', [...form.image_urls, data.publicUrl])
    setUploading(false)
    e.target.value = ''
  }

  const removeImage = (idx) => {
    set('image_urls', form.image_urls.filter((_, i) => i !== idx))
  }

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return }
    if (!form.body.trim())  { setError('Body text is required.'); return }
    setSaving(true)
    setError('')

    const payload = {
      title:      form.title.trim(),
      body:       form.body.trim(),
      date:       form.date || null,
      category:   form.category || null,
      image_urls: form.image_urls,
    }

    const { error: e } = editing === 'new'
      ? await supabase.from('news_entries').insert(payload)
      : await supabase.from('news_entries').update(payload).eq('id', editing)

    if (e) { setError(e.message); setSaving(false); return }
    setSaving(false)
    setEditing(null)
    load()
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    await supabase.from('news_entries').delete().eq('id', id)
    load()
  }

  const displayed = filter === 'all'
    ? entries
    : entries.filter(e => e.category === filter)

  return (
    <div className="page-enter pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-gold/60 text-xs font-700 tracking-[0.3em] uppercase mb-2" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
              Admin
            </p>
            <h1 className="text-4xl font-900 text-cream" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}>
              Edit <span className="text-gold">News &amp; Events</span>
            </h1>
          </div>
          <button onClick={openNew} className="btn-primary">+ Add Entry</button>
        </div>

        {/* Inline form */}
        {editing && (
          <div className="glass-card p-6 mb-8" style={{ borderRadius: 0, borderLeft: '3px solid #E6A122' }}>
            <h2 className="text-lg font-700 text-gold mb-5" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
              {editing === 'new' ? 'Add New Entry' : 'Edit Entry'}
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-crimson/20 border border-crimson/30 text-sm text-red-300 font-times">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Field label="Title *" value={form.title} onChange={v => set('title', v)} placeholder="Event or update title" />

              {/* Category */}
              <div>
                <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                  className="keris-input"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Date */}
              <Field label="Date" value={form.date} onChange={v => set('date', v)} type="date" />

              {/* Multi-image upload */}
              <div className="md:col-span-2">
                <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-2" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  Images
                </label>

                {/* Thumbnails */}
                {form.image_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.image_urls.map((url, i) => (
                      <div key={i} className="relative">
                        <img src={url} alt="" className="w-20 h-14 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-crimson text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors leading-none"
                        >
                          ×
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 text-center text-white text-[9px] bg-black/60 py-0.5 font-spartan" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                            COVER
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add image button */}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAddImage} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="keris-input text-left text-sm disabled:opacity-50 cursor-pointer hover:border-gold/40 transition-colors px-3 py-2"
                >
                  {uploading ? 'Uploading…' : '+ Add image'}
                </button>
                {uploadErr && <p className="text-red-400 text-xs mt-1 font-times">{uploadErr}</p>}
                {form.image_urls.length > 0 && (
                  <p className="text-cream/25 text-xs mt-1 font-times">{form.image_urls.length} image{form.image_urls.length !== 1 ? 's' : ''} — first is used as cover</p>
                )}
              </div>

              {/* Body */}
              <div className="md:col-span-2">
                <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  Body Text *
                </label>
                <textarea
                  value={form.body}
                  onChange={e => set('body', e.target.value)}
                  placeholder="Describe the event or update…"
                  rows={5}
                  className="keris-input resize-y"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Saving…' : editing === 'new' ? 'Add Entry' : 'Save Changes'}
              </button>
              <button onClick={cancel} className="btn-outline">Cancel</button>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs font-700 uppercase tracking-wider border transition-colors ${filter === cat ? 'bg-gold text-maroon border-gold' : 'text-cream/50 border-gold/20 hover:border-gold/40'}`}
              style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700, borderRadius: 0 }}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : displayed.length === 0 ? (
          <p className="text-center text-cream/30 font-times py-16">No entries found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="keris-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Images</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(entry => (
                  <tr key={entry.id}>
                    <td>
                      <span className="font-times text-cream/80">{entry.title}</span>
                    </td>
                    <td className="text-cream/50 font-times text-sm">{entry.category || '—'}</td>
                    <td className="text-cream/50 font-times text-sm">
                      {entry.date ? new Date(entry.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td>
                      {Array.isArray(entry.image_urls) && entry.image_urls.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <img src={entry.image_urls[0]} alt="" className="w-12 h-8 object-cover" />
                          {entry.image_urls.length > 1 && (
                            <span className="text-cream/30 text-xs font-times">+{entry.image_urls.length - 1}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-cream/20 text-xs font-times">None</span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(entry)} className="text-xs text-gold/60 hover:text-gold transition-colors font-spartan uppercase" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(entry.id, entry.title)} className="text-xs text-crimson/60 hover:text-crimson transition-colors font-spartan uppercase" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
        {label}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="keris-input" />
    </div>
  )
}
