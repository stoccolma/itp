import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { PlanSlot, Sidequest } from './plan';

interface GeneratePDFOptions {
  slots: PlanSlot[];
  sidequests: Sidequest[];
  dateISO: string;
  areaName: string;
}

export async function generateItineraryPDF(options: GeneratePDFOptions): Promise<void> {
  const { slots, sidequests, dateISO, areaName } = options;

  // Get or create the portal root
  let portalRoot = document.getElementById('pdf-root');
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.id = 'pdf-root';
    document.body.appendChild(portalRoot);
  }

  // Create a container for the print view
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: -9999px;
    width: 794px;
    background: #fff;
    color: #000;
    padding: 16px;
  `;
  portalRoot.appendChild(container);

  try {
    // Dynamically import ItineraryPrintView and html2pdf
    const [{ default: ItineraryPrintView }, { default: html2pdf }] = await Promise.all([
      import('@/components/ItineraryPrintView'),
      import('html2pdf.js')
    ]);

    // Render the component
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(
        createElement(ItineraryPrintView, {
          slots,
          sidequests,
          dateISO,
          areaName,
        })
      );
      // Give React time to render
      setTimeout(resolve, 100);
    });

    // Wait for fonts to be ready
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    // Wait for all images to load
    const images = Array.from(container.querySelectorAll('img')) as HTMLImageElement[];
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Resolve even on error to prevent hanging
        });
      })
    );

    // Additional frame wait to ensure layout is complete
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

    // Log dimensions for debugging
    console.warn('PRINT WIDTH', container.offsetWidth, container.offsetHeight);

    // Generate PDF
    const opt = {
      filename: 'ItaloPlanner-Itinerary.pdf',
      margin: 10,
      image: { type: 'jpeg' as const, quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        compressPDF: true,
      },
    };

    await html2pdf().set(opt).from(container).save();

    // Cleanup
    root.unmount();
  } finally {
    // Always cleanup the container
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}
