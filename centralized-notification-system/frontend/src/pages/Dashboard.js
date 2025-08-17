import React, { useEffect, useState } from 'react';
import { get, post } from '../api';
import TemplateCard from '../components/TemplateCard';

export default function Dashboard() {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState([]);
  const [priority, setPriority] = useState(0);
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || null);
  const [projectId, setProjectId] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTemplates();
  }, [apiKey]);

  async function fetchTemplates() {
    try {
      const headers = apiKey ? { 'x-api-key': apiKey } : {};
      const r = await get('/templates', {}, headers);
      setTemplates(r.templates || []);
    } catch (err) {
      console.error('Failed to fetch templates', err);
      setTemplates([]);
    }
  }

  function toggle(id) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  async function createProject() {
    if (!token) return alert('Login first');

    const payload = {
      project_no: 'proj-' + Date.now(),
      name: 'Demo Project',
      status: 'active',
      created_by: JSON.parse(localStorage.getItem('user')).id,
      server_id: 'server-1',
      selected_templates: selected
    };

    const res = await post('/projects', payload, token);

    if (res.project && res.project.id) {
      setProjectId(res.project.id);
      alert('Project created with ID: ' + res.project.id);
      return res.project.id;
    } else if (res.id) {
      setProjectId(res.id);
      alert('Project created with ID: ' + res.id);
      return res.id;
    } else {
      alert('Failed to create project');
      return null;
    }
  }

  async function createApiKey() {
    if (!token) return alert('Login first');

    const res = await post('/auth/apikey', {}, token);

    if (res.apiKey) {
      setApiKey(res.apiKey);
      localStorage.setItem('apiKey', res.apiKey);
      alert('Your API Key: ' + res.apiKey + '\nSave this securely.');
      fetchTemplates();
    } else {
      alert(res.error || 'Failed to generate API key');
    }
  }

  async function handleCreateProject() {
    const id = await createProject();
  }

  return (
    <div>
      <h3>Select template</h3>
      <div>
        {templates.map(t => (
          <TemplateCard
            key={t.id}
            t={t}
            selected={selected.includes(t.id)}
            onToggle={toggle}
          />
        ))}
      </div>

      <div className="controls">
        <label>
          Priority:
          <input
            type="number"
            value={priority}
            onChange={e => setPriority(Number(e.target.value))}
          />
        </label>
        <button onClick={handleCreateProject}>Create Project</button>
      </div>
      <br/>
      {projectId && (
        <div className="projectBox">
          <strong>Project ID (API Key):</strong> {projectId}
        </div>
      )}

    </div>
  );
}
