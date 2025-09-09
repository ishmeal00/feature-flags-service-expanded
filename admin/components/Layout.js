import Link from 'next/link';
import '../styles/output.css';
export default function Layout({ children }) {
  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-white shadow'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex justify-between items-center'>
          <h1 className='text-xl font-semibold'>Feature Flags Admin</h1>
          <nav className='space-x-4'>
            <Link href='/projects'>Projects</Link>
            <Link href='/flags'>Flags</Link>
            <Link href='/users'>Users</Link>
            <Link href='/subscriptions'>Subscriptions</Link>
            <Link href='/analytics'>Analytics</Link>
          </nav>
        </div>
      </header>
      <main className='max-w-6xl mx-auto p-4'>{children}</main>
    </div>
  );
}
