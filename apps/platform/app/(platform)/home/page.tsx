'use client';

import { ItemCategory } from '@openhome-os/core/models/item/item-enums';

import HomeCategoryCard from './_components/home-category-card';
import { HOME_CATEGORY_CONFIG } from './_components/home-constants';
import HomeHeader from './_components/home-header';

const HomePage = () => {
  return (
    <section className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <HomeHeader />
        {Object.values(ItemCategory).map((category) => (
          <HomeCategoryCard
            key={category}
            {...HOME_CATEGORY_CONFIG[category]}
          />
        ))}
      </div>
    </section>
  );
};

export default HomePage;
