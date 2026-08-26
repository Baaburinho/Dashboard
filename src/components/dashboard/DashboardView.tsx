import React from 'react';
import { DashboardHero } from './DashboardHero';
import { AcademicMetrics } from './AcademicMetrics';
import { ScheduleAndDeadlines } from './ScheduleAndDeadlines';
import { AcademicMemoryCard } from './AcademicMemoryCard';

export const DashboardView: React.FC = () => {
  return (
    <div className="dashboard-enter dashboard-stagger space-y-7 max-w-[1440px] mx-auto pb-8">
      {/* 1. Identity & Signature Narrative (Past → Today → Ahead) */}
      <DashboardHero />

      {/* 2. Key Academic Pulse Metrics Strip */}
      <AcademicMetrics />

      {/* 3. Upcoming Deliverables & Memory Archive Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScheduleAndDeadlines />
        </div>
        <div className="lg:col-span-1">
          <AcademicMemoryCard />
        </div>
      </div>
    </div>
  );
};
