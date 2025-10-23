// src/pages/HomePage.tsx
import React from 'react';
import FollowerCount from '../components/FollowerCount';
import ProfileInfo from '../components/ProfileInfo';
import InstagramStats from '../components/InstagramStats';
import TopComments from '../components/TopComments';
import ReelsStats from '../components/ReelsStats';

const HomePage: React.FC = () => {
  return (
    // A container to center our content and add some padding
    <section className="container mx-auto flex flex-col items-center justify-center text-center px-6 py-12 md:py-24">
      <div className="w-full max-w-6xl">
        <ProfileInfo />
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mt-8">
          Unspoken <span className="text-[#64FFDA]">Chronicles</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          The stories behind the posts. The data behind the narrative.
        </p>
        
        <FollowerCount />
        
        <InstagramStats />
        
        <ReelsStats />
        
        <TopComments />
      </div>
    </section>
  );
};

export default HomePage;