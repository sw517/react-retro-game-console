import { Ubuntu } from 'next/font/google';
const ubuntu = Ubuntu({ subsets: ['latin'], weight: '700' });

export default function Trademark() {
  return (
    <div
      className={`inline-block text-black text-center px-2 border-2 border-black rounded-full opacity-25 bold text-xs ${ubuntu.className}`}
    >
      Made with React.js
    </div>
  );
}
