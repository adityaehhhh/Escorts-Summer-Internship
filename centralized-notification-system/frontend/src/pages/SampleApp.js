import React, { useState, useEffect } from 'react';
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
import './SampleApp.css';

export default function SampleApp() {
  const [apiKey, setApiKey] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [to, setTo] = useState('');
  const [placeholders, setPlaceholders] = useState({});
  const [messageType, setMessageType] = useState('sms');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
  }, []);

  async function fetchTemplatesWithKey(key) {
    try {
      setLoading(true);
      const headers = key ? { 'x-api-key': key } : {};
      const r = await fetch(`${API_BASE}/templates`, { headers });
      const parsed = await r.json();
      if (!r.ok) {
        throw new Error(parsed.error || 'Failed to load templates');
      }
      setTemplates(parsed.templates || []);
    } catch (err) {
      console.error('Fetch templates error:', err);
      setTemplates([]);
      alert(err.message || 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  }

  function handleCheckKey() {
    if (!apiKey.trim()) return alert('Enter API key (project id)');
    fetchTemplatesWithKey(apiKey.trim());
  }

  function chooseTemplate(id) {
    const tpl = templates.find(t => t.id === Number(id));
    setSelectedTemplate(tpl || null);
    if (!tpl) return;
    const matches = tpl.content.match(/\{(\w+)\}/g) || [];
    const ph = {};
    matches.forEach(m => (ph[m.replace(/[{}]/g, '')] = ''));
    setPlaceholders(ph);
    setMessageType(tpl.type || 'sms');
  }

  async function sendMessage() {
    if (!apiKey.trim()) return alert('API key required');
    if (!selectedTemplate) return alert('Select template');

    const data = { ...placeholders };
    if (messageType === 'sms') data.to = to;
    if (messageType === 'email') {
      data.to = to;
      data.subject = 'Sample App Message';
    }

    try {
      const res = await fetch(`${API_BASE}/api/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.trim()
        },
        body: JSON.stringify({
          template_id: selectedTemplate.id,
          project_id: /^\d+$/.test(apiKey.trim()) ? Number(apiKey.trim()) : null,
          data,
          priority: 1,
          dedup: JSON.stringify({ to, template: selectedTemplate.id })
        })
      });

      const json = await res.json();
      if (res.ok && json.notification) {
        alert('Message queued');
      } else {
        alert('Failed: ' + (json.error || 'unknown'));
      }
    } catch (err) {
      console.error('sendMessage error:', err);
      alert('Server error while sending');
    }
  }

  return (
    <div className='sample-app'>
      <h3>Sample App</h3>

      <div className="form" style={{ marginBottom: 12 }}>
        <label>
          API Key (project id):
          <input
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            style={{ width: 420, marginLeft: 8 }}
            placeholder="Enter project id (numeric)"
          />
        </label>
        <button onClick={handleCheckKey} disabled={loading} style={{ marginLeft: 8 }}>
          {loading ? 'Loading...' : 'Load templates'}
        </button>
      </div>

      <div>
        <p>Choose Template</p>
        <select onChange={e => chooseTemplate(e.target.value)}>
          <option value="">-- select --</option>
          {templates.map(t => (
            <option value={t.id} key={t.id}>
              {t.name} ({t.type})
            </option>
          ))}
        </select>
      </div>

      {selectedTemplate && (
        <div className="sampleBox" style={{ marginTop: 12 }}>
          <p>Preview:</p>
          <pre>{selectedTemplate.content}</pre>

          <div>
            <label>
              To:
              <input value={to} onChange={e => setTo(e.target.value)} />
            </label>
          </div>

          {Object.keys(placeholders).map(k => (
            <div key={k}>
              <label>
                {k}:
                <input
                  value={placeholders[k] || ''}
                  onChange={e => setPlaceholders(prev => ({ ...prev, [k]: e.target.value }))}
                />
              </label>
            </div>
          ))}

          <button onClick={sendMessage}>Send message</button>
        </div>
      )}
    </div>
  );
}
