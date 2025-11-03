'use client';

import { useEffect } from 'react';

/**
 * ClientBootstrap - Sets up client-side infrastructure
 * Creates persistent portal roots for PDF generation
 */
export default function ClientBootstrap() {
  useEffect(() => {
    // Create PDF portal root if it doesn't exist
    if (!document.getElementById('pdf-root')) {
      const node = document.createElement('div');
      node.id = 'pdf-root';
      document.body.appendChild(node);
    }
  }, []);

  return null;
}
