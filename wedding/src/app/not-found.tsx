import Link from 'next/link';
import { Text } from '@/components/Text';
import css from './not-found.module.scss';

export default function Custom404() {
  return (
    <div className={css.container}>
      <Text variant="heading3">Uh oh! You look lost.</Text>
      <Link className="buttonLink" href="/">
        return home
      </Link>
    </div>
  );
}
