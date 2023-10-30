'use client';

import * as FS from '@fullstory/browser';
import { useEffect } from 'react';

export const FullStory = () => {
    useEffect(() => {
        FS.init({ orgId: 'Q23YS' });
      }, []);

      return null;
}