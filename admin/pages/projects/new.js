import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useRouter } from 'next/router';

const schema = z.object({
  name: z.string().min(1),
  key: z.string().min(1)
});

export default function NewProject() {
  const router = useRouter();
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
  async function onSubmit(data) {
    await axios.post('/api/projects', data);
    router.push('/flags');
  }
  return (
    <div>
      <h2 className='text-xl mb-4'>New Project</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label='Name' id='name' register={{...register('name')}} />
        <Input label='Key' id='key' register={{...register('key')}} />
        <Button type='submit'>Create</Button>
      </form>
    </div>
  )
}
