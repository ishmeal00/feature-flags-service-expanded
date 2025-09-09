import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Users() {
  const [users, setUsers] = useState([]);
  useEffect(()=>{ fetch(); }, []);
  async function fetch() {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } });
    setUsers(res.data || []);
  }
  async function changeRole(id, role) {
    const token = localStorage.getItem('token');
    await axios.put(`/api/users/${id}/role`, { role }, { headers: { Authorization: `Bearer ${token}` } });
    fetch();
  }
  return (
    <div>
      <h2 className='text-2xl mb-4'>Users</h2>
      <div className='grid gap-3'>
        {users.map(u => (
          <Card key={u.id} className='flex justify-between items-center'>
            <div>
              <div className='font-semibold'>{u.email}</div>
              <div className='text-sm text-gray-500'>{u.role}</div>
            </div>
            <div className='space-x-2'>
              <Button onClick={()=>changeRole(u.id, 'manager')}>Manager</Button>
              <Button onClick={()=>changeRole(u.id, 'viewer')}>Viewer</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
