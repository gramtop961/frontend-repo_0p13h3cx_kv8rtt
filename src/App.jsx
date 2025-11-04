import React, { useCallback, useState } from 'react'
import { Bot, Home, List, Newspaper } from 'lucide-react'
import SearchBar from './components/SearchBar'
import AIToolsManager from './components/AIToolsManager'
import TodoAndNews from './components/TodoAndNews'
import Tabs from './components/Tabs'

function App() {
  const [aiTools, setAiTools] = useState([])
  const [active, setActive] = useState('dashboard')

  const handleAIToolsChange = useCallback((list) => setAiTools(list), [])

  const tabs = [
    { value: 'dashboard', label: 'Dashboard', icon: Home },
    { value: 'ai', label: 'AI Tools', icon: Bot },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Your Home</h1>
          <p className="text-slate-400 mt-1">A minimal, fast homepage with search, AI tools, tasks, and news.</p>
        </div>

        <div className="mb-8">
          <SearchBar userAITools={aiTools} />
        </div>

        <div className="mb-6">
          <Tabs tabs={tabs} active={active} onChange={setActive} />
        </div>

        {active === 'dashboard' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <h3 className="text-slate-200 font-semibold mb-3 flex items-center gap-2"><List size={18} className="text-blue-400"/> To‑Do & Discover</h3>
                <TodoAndNews />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <h3 className="text-slate-200 font-semibold mb-3 flex items-center gap-2"><Newspaper size={18} className="text-blue-400"/> Quick News</h3>
                {/* Lightweight duplicate of News for sidebar */}
                <TodoAndNews />
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <AIToolsManager onChange={handleAIToolsChange} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
