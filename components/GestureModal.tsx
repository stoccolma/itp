'use client';

import { Gesture } from '@/db/schema';
import { parseDoDont } from '@/lib/gestures';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface GestureModalProps {
  gesture: Gesture;
  onClose: () => void;
}

export function GestureModal({ gesture, onClose }: GestureModalProps) {
  const { do: doList, dont: dontList } = parseDoDont(gesture.doDont);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-[var(--editorial-bg)] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[color-mix(in_oklab,var(--ink)_10%,transparent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-[var(--editorial-text)]" />
        </button>

        <div className="p-8">
          {/* Title */}
          <h2 className="font-heading text-3xl md:text-4xl mb-3 text-[var(--editorial-text)] pr-12">
            {gesture.title}
          </h2>

          {/* Meaning */}
          <p className="font-heading italic text-xl text-[var(--editorial-text)]/70 mb-6">
            {gesture.meaningShort}
          </p>

          {/* Description */}
          <div className="prose max-w-none mb-8 font-body text-lg text-[var(--editorial-text)]">
            <ReactMarkdown>{gesture.descriptionMd}</ReactMarkdown>
          </div>

          {/* Do's and Don'ts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Do */}
            <div>
              <h3 className="flex items-center gap-2 font-heading text-lg mb-3 text-green-700 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                Do
              </h3>
              <ul className="space-y-2">
                {doList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 font-body text-sm text-[var(--editorial-text)]">
                    <span className="text-green-600 text-green-600 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don't */}
            <div>
              <h3 className="flex items-center gap-2 font-heading text-lg mb-3 text-red-700 text-red-600">
                <XCircle className="w-5 h-5" />
                Don't
              </h3>
              <ul className="space-y-2">
                {dontList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 font-body text-sm text-[var(--editorial-text)]">
                    <span className="text-red-600 text-red-600 mt-0.5">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
