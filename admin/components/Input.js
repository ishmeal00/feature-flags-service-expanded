export default function Input({ label, id, register, required = false, ...props }) {
  return (
    <div className='mb-4'>
      {label && <label htmlFor={id} className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>}
      <input id={id} {...register} {...props} className='mt-1 block w-full rounded border px-3 py-2' />
    </div>
  );
}
