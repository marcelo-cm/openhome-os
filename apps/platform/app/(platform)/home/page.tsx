'use client';

import HomeClosetTableCard from './_components/home-closet-table-card';
import HomeHeader from './_components/home-header';
import HomeLocationsCard from './_components/home-locations-card';
import HomeRecentlyViewedCard from './_components/home-recently-viewed-card';
import HomeSummaryCard from './_components/home-summary-card';

const HomePage = () => {
  return (
    <section className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <HomeHeader />
        <HomeRecentlyViewedCard />
        <HomeClosetTableCard />
        <HomeLocationsCard />
        <HomeSummaryCard />
      </div>
    </section>
  );
};

export default HomePage;
