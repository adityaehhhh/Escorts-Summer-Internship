import React from 'react';
export default function TemplateCard({t, selected, onToggle}) {
  return (
    <div className="card">
      <h4>{t.name} <small>({t.type})</small></h4>
      <pre className="tpl-pre">{t.content}</pre>
      <button onClick={() => onToggle(t.id)}>{selected ? 'Deselect' : 'Select'}</button>
    </div>
  );
}
