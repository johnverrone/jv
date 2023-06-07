import { Metadata } from 'next';
import PhotoPage from './photo-page';

export const metadata: Metadata = {
  title: 'photo',
};

export default function Page() {
  return <PhotoPage />;
}
