import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, useFieldArray } from 'react-hook-form';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Card from '../../../components/Card';

export default function ProjectFlags() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const { register, control, handleSubmit } = useForm({ defaultValues: { rules: [] }});
  const { fields, append, remove } = useFieldArray({ control, name: 'rules' });

  useEffect(()=>{ if(id) fetch(); }, [id]);
  async function fetch() {
    const res = await axios.get(`/api/projects/${id}/flags`);
    setProject({ id, flags: res.data });
  }

  async function onSubmit(data) {
    await axios.post(`/api/projects/${id}/flags`, data);
    fetch();
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl'>Flags for Project</h2>
        <Button onClick={()=>append({ attribute: '', op: 'equals', value: '' })}>Add Rule</Button>
      </div>
      <div className='grid gap-4'>
        <div>
          <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input label='Flag key' id='key' register={{...register('key')}} />
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Rules</label>
                {fields.map((f,i)=>(
                  <div key={f.id} className='flex gap-2 mb-2'>
                    <input placeholder='attribute' {...register(`rules.${i}.attribute`)} className='px-2 py-1 border rounded'/>
                    <select {...register(`rules.${i}.op`)} className='px-2 py-1 border rounded'>
                      <option value='equals'>equals</option>
                      <option value='not_equals'>not_equals</option>
                      <option value='contains'>contains</option>
                      <option value='gt'>gt</option>
                      <option value='gte'>gte</option>
                      <option value='lt'>lt</option>
                      <option value='lte'>lte</option>
                    </select>
                    <input placeholder='value' {...register(`rules.${i}.value`)} className='px-2 py-1 border rounded'/>
                    <Button type='button' onClick={()=>remove(i)}>Remove</Button>
                  </div>
                ))}
              </div>
              <Button type='submit'>Create Flag</Button>
            </form>
          </Card>
        </div>

        <div>
          <h3 className='text-lg mb-2'>Existing Flags</h3>
          {project?.flags?.map(f => (
            <Card key={f.id} className='mb-2'>
              <div className='flex justify-between items-center'>
                <div>
                  <div className='font-semibold'>{f.key}</div>
                  <div className='text-sm text-gray-500'>{f.description}</div>
                </div>
                <div>
                  <Button onClick={()=>{}}>Edit</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
