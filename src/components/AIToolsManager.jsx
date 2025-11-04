import React, { useEffect, useMemo, useState } from 'react'
import { Plus, Edit2, Trash2, ExternalLink, Bot } from 'lucide-react'

const STORAGE_KEY = 'homepage_ai_tools_v1'

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value])

  return [value, setValue]
}

function ToolForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [url, setUrl] = useState(initial?.url || '')
  const [desc, setDesc] = useState(initial?.description || '')

  const valid = name.trim() && url.trim()

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tool name (e.g., ChatGPT)"
          className="w-full px-3 py-2 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Search URL (must accept query)"
          className="w-full px-3 py-2 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <input
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Short description"
        className="w-full px-3 py-2 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600">Cancel</button>
        <button
          onClick={() => valid && onSave({ name: name.trim(), url: url.trim(), description: desc.trim() })}
          disabled={!valid}
          className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
        >
          Save
        </button>
      </div>
      <p className="text-xs text-slate-400">Tip: Include the query parameter in the URL. Example: https://example.ai/search?q=</p>
    </div>
  )
}

function AIToolsManager({ onChange }) {
  const [tools, setTools] = useLocalStorage(STORAGE_KEY, [
    { name: 'Perplexity', url: 'https://www.perplexity.ai/search?q=', description: 'Answer engine' },
    { name: 'ChatGPT', url: 'https://chat.openai.com/?q=', description: 'OpenAI assistant' },
    { name: 'Claude', url: 'https://claude.ai/new?q=', description: 'Anthropic assistant' },
    { name: 'Gemini', url: 'https://gemini.google.com/app?query=', description: 'Google AI' },
  ])

  const [editing, setEditing] = useState(null) // index or 'new'

  useEffect(() => {
    onChange?.(tools)
  }, [tools, onChange])

  const startNew = () => setEditing('new')

  const saveTool = (data) => {
    if (editing === 'new') {
      setTools([...tools, data])
    } else if (typeof editing === 'number') {
      const next = [...tools]
      next[editing] = data
      setTools(next)
    }
    setEditing(null)
  }

  const removeTool = (idx) => {
    const next = tools.filter((_, i) => i !== idx)
    setTools(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200">
          <Bot size={18} className="text-blue-400" />
          <h3 className="font-semibold">My AI Tools</h3>
        </div>
        <button onClick={startNew} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500">
          <Plus size={16} /> Add tool
        </button>
      </div>

      {editing !== null && (
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <ToolForm
            initial={typeof editing === 'number' ? tools[editing] : null}
            onSave={saveTool}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t, idx) => (
          <div key={idx} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-slate-100 font-medium">{t.name}</h4>
                {t.description ? (
                  <p className="text-sm text-slate-400 mt-1">{t.description}</p>
                ) : null}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(idx)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  aria-label="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => removeTool(idx)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-red-600/20 text-red-400"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <a
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mt-3"
            >
              Open tool <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AIToolsManager
