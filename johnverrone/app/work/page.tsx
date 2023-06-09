import { Metadata } from 'next';
import WorkPage from './work-page';

export const metadata: Metadata = {
  title: 'work',
};

export default function Page() {
  return <WorkPage />;
}
