import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function FlagsIndex() {
  const [projects, setProjects] = useState([]);
  useEffect(()=>{ fetch(); }, []);
  async function fetch() {
    const res = await axios.get('/api/projects');
    setProjects(res.data || []);
  }
  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl'>Projects & Flags</h2>
        <Link href='/projects/new'><Button>New Project</Button></Link>
      </div>
      <div className='grid gap-4'>
        {projects.map(p => (
          <Card key={p.id}>
            <div className='flex justify-between items-center'>
              <div>
                <div className='font-semibold'>{p.name}</div>
                <div className='text-sm text-gray-500'>{p.key}</div>
              </div>
              <div>
                <Link href={`/projects/${p.id}/flags`} className='mr-2'><Button>View Flags</Button></Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
