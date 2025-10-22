// src/pages/HomePage.tsx
import React from 'react';
import FollowerCount from '../components/FollowerCount';
import ProfileInfo from '../components/ProfileInfo';
// import RecentPosts from '../components/RecentPosts';
const HomePage: React.FC = () => {
  return (
    // A container to center our content and add some padding
    <section className="container mx-auto flex h-full items-center justify-center text-center px-6 py-24">
      <div>
         <ProfileInfo />
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Unspoken <span className="text-[#64FFDA]">Chronicles</span>
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          The stories behind the posts. The data behind the narrative.
        </p>
        <FollowerCount />
        {/* <RecentPosts />        */}
      
      </div>
    </section>
  );
};

export default HomePage;