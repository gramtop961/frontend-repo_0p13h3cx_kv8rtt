import React from 'react'

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="w-full">
      <div className="flex gap-2 bg-slate-800/60 rounded-xl p-1">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={
              'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ' +
              (active === t.value
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-700')
            }
          >
            <div className="flex items-center justify-center gap-2">
              {t.icon ? <t.icon size={16} /> : null}
              <span>{t.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Tabs
