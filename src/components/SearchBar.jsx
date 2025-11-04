import React, { useMemo, useState } from 'react'
import { Search, Globe, Bot, ChevronDown } from 'lucide-react'

const DEFAULT_ENGINES = [
  { key: 'google', label: 'Google', url: 'https://www.google.com/search?q=' },
  { key: 'duckduckgo', label: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { key: 'bing', label: 'Bing', url: 'https://www.bing.com/search?q=' },
  { key: 'brave', label: 'Brave', url: 'https://search.brave.com/search?q=' },
  { key: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/results?search_query=' },
]

const DEFAULT_AI = [
  { key: 'perplexity', label: 'Perplexity', url: 'https://www.perplexity.ai/search?q=' },
  { key: 'chatgpt', label: 'ChatGPT', url: 'https://chat.openai.com/?q=' },
  { key: 'claude', label: 'Claude', url: 'https://claude.ai/new?q=' },
  { key: 'gemini', label: 'Gemini', url: 'https://gemini.google.com/app?query=' },
]

function Dropdown({ options, selected, onSelect, prefixIcon: Prefix }) {
  const [open, setOpen] = useState(false)

  const selectedOption = useMemo(() => options.find((o) => o.key === selected) || options[0], [options, selected])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-slate-800/70 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-700"
      >
        {Prefix ? <Prefix size={16} /> : null}
        <span className="hidden sm:inline">{selectedOption?.label}</span>
        <ChevronDown size={14} className="opacity-70" />
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-44 rounded-lg border border-slate-700 bg-slate-800 shadow-xl overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                onSelect(opt.key)
                setOpen(false)
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-700 ${
                selected === opt.key ? 'text-white' : 'text-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchBar({ userAITools }) {
  const [mode, setMode] = useState('web') // 'web' or 'ai'
  const [engine, setEngine] = useState(DEFAULT_ENGINES[0].key)
  const [aiTool, setAiTool] = useState(DEFAULT_AI[0].key)
  const [query, setQuery] = useState('')

  const combinedAIOptions = useMemo(() => {
    const user = (userAITools || []).map((t, idx) => ({ key: `user-${idx}`, label: t.name, url: t.url }))
    return [...DEFAULT_AI, ...user]
  }, [userAITools])

  const engines = useMemo(() => DEFAULT_ENGINES, [])

  const onSubmit = (e) => {
    e.preventDefault()
    const q = encodeURIComponent(query.trim())
    if (!q) return

    if (mode === 'web') {
      const sel = engines.find((e) => e.key === engine) || engines[0]
      window.open(sel.url + q, '_blank', 'noopener,noreferrer')
    } else {
      const sel = combinedAIOptions.find((e) => e.key === aiTool) || combinedAIOptions[0]
      // If the AI tool url already includes query param marker, just append
      window.open(sel.url + q, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex bg-slate-800/60 rounded-xl p-1">
          <button
            onClick={() => setMode('web')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              mode === 'web' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Globe size={16} /> Web
          </button>
          <button
            onClick={() => setMode('ai')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              mode === 'ai' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Bot size={16} /> AI
          </button>
        </div>
        {mode === 'web' ? (
          <Dropdown
            options={engines}
            selected={engine}
            onSelect={setEngine}
            prefixIcon={Globe}
          />
        ) : (
          <Dropdown
            options={combinedAIOptions}
            selected={aiTool}
            onSelect={setAiTool}
            prefixIcon={Bot}
          />
        )}
      </div>

      <form onSubmit={onSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mode === 'web' ? 'Search the web...' : 'Ask an AI...'}
          className="w-full pl-10 pr-28 py-3 rounded-xl bg-slate-900/70 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          className="absolute right-1 top-1 bottom-1 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium"
        >
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchBar
