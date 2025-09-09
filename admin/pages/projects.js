import axios from 'axios';
import { useEffect, useState } from 'react';
export default function Projects() {
  const [projects, setProjects] = useState([]);
  useEffect(()=>{ fetch(); }, []);
  async function fetch() {
    const res = await axios.get('/api/projects');
    setProjects(res.data);
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>Projects</h2>
      <ul>
        {projects.map(p => <li key={p.id}>{p.name} — {p.key}</li>)}
      </ul>
    </div>
  )
}
