import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
export default function Flags() {
  const [flags, setFlags] = useState([]);
  useEffect(()=>{ fetchFlags(); }, []);
  async function fetchFlags() {
    const res = await axios.get('/api/projects'); // placeholder: ideally list flags per project
    setFlags(res.data || []);
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>Flags (Projects shown - drilldown)</h2>
      <ul>
        {flags.map(p => <li key={p.id}><Link href={`/projects/${p.id}/flags`}>{p.name} ({p.key})</Link></li>)}
      </ul>
    </div>
  )
}
