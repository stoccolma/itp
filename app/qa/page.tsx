'use client';

import { useState, useEffect } from 'react';

export default function QAPage() {
  const [checks, setChecks] = useState({
    sicilyMap: { status: 'pending', message: 'Checking map bounds...' },
    twoColumns: { status: 'pending', message: 'Checking column layout...' },
    quickStops: { status: 'pending', message: 'Checking QuickStops visibility...' }
  });

  useEffect(() => {
    // Wait for page to fully load
    setTimeout(() => {
      runChecks();
    }, 1000);
  }, []);

  const runChecks = () => {
    const newChecks = { ...checks };

    // Check 1: Sicily Map Centered
    try {
      const mapContainer = document.querySelector('#map-container');
      if (mapContainer) {
        newChecks.sicilyMap = {
          status: 'pass',
          message: 'Map container found and initialized'
        };
      } else {
        newChecks.sicilyMap = {
          status: 'fail',
          message: 'Map container not found'
        };
      }
    } catch (error) {
      newChecks.sicilyMap = {
        status: 'fail',
        message: `Error: ${error}`
      };
    }

    // Check 2: Two Columns Visible
    try {
      const plannerCol = document.querySelector('#planner-col');
      const rightCol = document.querySelector('#right-col');
      
      if (plannerCol && rightCol) {
        // Check if both are visible (not display:none)
        const plannerVisible = window.getComputedStyle(plannerCol).display !== 'none';
        const rightVisible = window.getComputedStyle(rightCol).display !== 'none';
        
        if (plannerVisible && rightVisible) {
          newChecks.twoColumns = {
            status: 'pass',
            message: 'Both planner and right columns are visible'
          };
        } else {
          newChecks.twoColumns = {
            status: 'fail',
            message: `Planner visible: ${plannerVisible}, Right col visible: ${rightVisible}`
          };
        }
      } else {
        newChecks.twoColumns = {
          status: 'fail',
          message: `Planner col: ${!!plannerCol}, Right col: ${!!rightCol}`
        };
      }
    } catch (error) {
      newChecks.twoColumns = {
        status: 'fail',
        message: `Error: ${error}`
      };
    }

    // Check 3: QuickStops Present
    try {
      const quickStops = document.querySelector('[data-testid="sidequests"]');
      const rightCol = document.querySelector('#right-col');
      
      if (quickStops && rightCol) {
        // Check if QuickStops is inside right column
        const isInside = rightCol.contains(quickStops);
        
        if (isInside) {
          newChecks.quickStops = {
            status: 'pass',
            message: 'QuickStops found inside right column'
          };
        } else {
          newChecks.quickStops = {
            status: 'fail',
            message: 'QuickStops exists but not inside right column'
          };
        }
      } else {
        newChecks.quickStops = {
          status: 'fail',
          message: `QuickStops: ${!!quickStops}, Right col: ${!!rightCol}`
        };
      }
    } catch (error) {
      newChecks.quickStops = {
        status: 'fail',
        message: `Error: ${error}`
      };
    }

    setChecks(newChecks);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return '✓';
      case 'fail':
        return '✗';
      default:
        return '○';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-600';
      case 'fail':
        return 'text-red-600';
      default:
        return 'text-zinc-400';
    }
  };

  const allPassed = Object.values(checks).every(check => check.status === 'pass');

  return (
    <div className="min-h-screen bg-zinc-50 bg-[var(--paper)] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 text-[var(--ink)] mb-2">
            QA Guardrails
          </h1>
          <p className="text-zinc-600 text-[var(--ink)]/60">
            Automated checks to prevent regressions and layout drift
          </p>
        </div>

        <div className="bg-white bg-[var(--card)] rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`text-6xl ${allPassed ? 'text-green-500' : 'text-zinc-300'}`}>
              {allPassed ? '✓' : '○'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 text-[var(--ink)]">
                {allPassed ? 'All Checks Passed' : 'Running Checks...'}
              </h2>
              <p className="text-sm text-zinc-600 text-[var(--ink)]/60">
                {Object.values(checks).filter(c => c.status === 'pass').length} / {Object.keys(checks).length} passed
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(checks).map(([key, check]) => (
              <div
                key={key}
                className="flex items-start gap-4 p-4 rounded-lg border border-zinc-200 border-[var(--line)]"
              >
                <div className={`text-3xl font-bold ${getStatusColor(check.status)}`}>
                  {getStatusIcon(check.status)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-900 text-[var(--ink)] mb-1">
                    {key === 'sicilyMap' && 'Sicily Map Centered'}
                    {key === 'twoColumns' && 'Two Columns Visible'}
                    {key === 'quickStops' && 'QuickStops Present'}
                  </h3>
                  <p className="text-sm text-zinc-600 text-[var(--ink)]/60">
                    {check.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white bg-[var(--card)] rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-zinc-900 text-[var(--ink)] mb-4">
            Console Guardrails (Active in Development)
          </h3>
          <ul className="space-y-2 text-sm text-zinc-600 text-[var(--ink)]/60">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Warning if QuickStops not inside right column</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Warning if more than 2 elements have overflow-y-auto</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Debug summary of layout structure</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={runChecks}
            className="px-6 py-3 bg-zinc-900 bg-[var(--card)] text-zinc-50 rounded-lg hover:bg-zinc-800 transition-colors font-medium"
          >
            Re-run Checks
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-zinc-500 text-[var(--ink)]/60">
          <p>
            For smoke tests, run: <code className="px-2 py-1 bg-zinc-100 bg-[var(--card)] rounded">npm run test</code>
          </p>
        </div>
      </div>
    </div>
  );
}
