import Link from 'next/link';
export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Feature Flags Admin</h1>
      <ul>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/projects">Projects</Link></li>
      </ul>
    </div>
  )
}
