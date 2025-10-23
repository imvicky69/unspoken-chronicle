// src/components/InstagramStats.tsx
import React, { useState, useEffect } from 'react';

interface Stats {
  followers_count: number;
  follows_count: number;
  media_count: number;
}

const InstagramStats: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const pageId = import.meta.env.VITE_FB_PAGE_ID;
      const accessToken = import.meta.env.VITE_FB_PAGE_ACCESS_TOKEN;

      if (!pageId || !accessToken) {
        setError("API credentials are not configured.");
        setIsLoading(false);
        return;
      }

      try {
        // Step 1: Get the Instagram Business Account ID
        const pageApiUrl = `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;
        const pageResponse = await fetch(pageApiUrl);
        const pageData = await pageResponse.json();

        if (pageData.error) throw new Error(pageData.error.message);
        
        const instagramAccountId = pageData.instagram_business_account?.id;

        if (!instagramAccountId) {
          throw new Error("Instagram Business Account not found on this Page.");
        }

        // Step 2: Get comprehensive stats
        const instaApiUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}?fields=followers_count,follows_count,media_count&access_token=${accessToken}`;
        const instaResponse = await fetch(instaApiUrl);
        const instaData = await instaResponse.json();

        if (instaData.error) throw new Error(instaData.error.message);

        setStats(instaData);

      } catch (err: unknown) {
        console.error("Failed to fetch stats:", err);
        if (err instanceof Error) {
          setError(err.message || "Failed to load stats.");
        } else {
          setError("Failed to load stats.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-800 rounded-lg p-6 h-32"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-xl font-bold text-red-500 mt-8">{error}</p>;
  }

  if (!stats) return null;

  const statCards = [
    { label: 'Followers', value: stats.followers_count, icon: '👥' },
    { label: 'Following', value: stats.follows_count, icon: '➕' },
    { label: 'Posts', value: stats.media_count, icon: '📸' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-4xl">
      {statCards.map((stat, index) => (
        <div 
          key={index}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700 hover:border-[#64FFDA] transition-all duration-300 hover:shadow-lg hover:shadow-[#64FFDA]/20"
        >
          <div className="text-4xl mb-2">{stat.icon}</div>
          <p className="text-sm text-gray-400 uppercase tracking-wide">{stat.label}</p>
          <p className="text-3xl font-bold text-[#64FFDA] mt-2">
            {stat.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InstagramStats;
