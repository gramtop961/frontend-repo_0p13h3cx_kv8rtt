import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Circle, Trash2, Plus, Newspaper } from 'lucide-react'

const TODO_KEY = 'homepage_todos_v1'

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

function TodoList() {
  const [items, setItems] = useLocalStorage(TODO_KEY, [])
  const [text, setText] = useState('')

  const addItem = () => {
    const t = text.trim()
    if (!t) return
    setItems([{ id: Date.now(), text: t, done: false }, ...items])
    setText('')
  }

  const toggle = (id) => {
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))
  }

  const remove = (id) => setItems(items.filter((i) => i.id !== id))

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task..."
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          className="flex-1 px-3 py-2 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button onClick={addItem} className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500">
          <Plus size={16} />
        </button>
      </div>
      <div className="space-y-2 max-h-80 overflow-auto pr-1">
        {items.length === 0 && (
          <p className="text-sm text-slate-400">No tasks yet. Add your first one!</p>
        )}
        {items.map((i) => (
          <div key={i.id} className="flex items-center gap-3 bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2">
            <button
              onClick={() => toggle(i.id)}
              className="text-blue-400 hover:text-blue-300"
              aria-label={i.done ? 'Mark as undone' : 'Mark as done'}
            >
              {i.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>
            <p className={`flex-1 text-sm ${i.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>{i.text}</p>
            <button onClick={() => remove(i.id)} className="text-red-400 hover:text-red-300" aria-label="Delete">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function NewsFeed() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const res = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page')
        const data = await res.json()
        setItems(data.hits || [])
      } catch (e) {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  return (
    <div className="space-y-3">
      {loading ? (
        <p className="text-sm text-slate-400">Loading top stories...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-400">No stories available right now.</p>
      ) : (
        <ul className="space-y-2 max-h-80 overflow-auto pr-1">
          {items.map((i) => (
            <li key={i.objectID} className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2">
              <a
                href={i.url || `https://news.ycombinator.com/item?id=${i.objectID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-200 hover:text-white"
              >
                {i.title}
              </a>
              <div className="text-xs text-slate-500 mt-1">
                {i.points} points • {i.author}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function TodoAndNews() {
  const [tab, setTab] = useState('todo')

  return (
    <div className="space-y-3">
      <div className="flex bg-slate-800/60 rounded-xl p-1 w-full">
        <button
          onClick={() => setTab('todo')}
          className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
            tab === 'todo' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          <CheckCircle2 size={16} /> To‑Do
        </button>
        <button
          onClick={() => setTab('news')}
          className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
            tab === 'news' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Newspaper size={16} /> Discover
        </button>
      </div>

      {tab === 'todo' ? <TodoList /> : <NewsFeed />}
    </div>
  )
}

export default TodoAndNews
