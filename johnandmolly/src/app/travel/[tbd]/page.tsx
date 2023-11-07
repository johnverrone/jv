import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h2 className="text-xl font-bold my-2">🚧 Coming Soon 🚧</h2>
      <p>
        This page has not been published yet or doesn&apos;t exist. Please check
        back soon.
      </p>
      <Link href="/travel" className="block my-2 text-gray-500">
        ← back
      </Link>
    </div>
  );
}
