// src/components/FollowerCount.tsx
import React, { useState, useEffect } from 'react';

const FollowerCount: React.FC = () => {
  const [followers, setFollowers] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      const pageId = import.meta.env.VITE_FB_PAGE_ID;
      const accessToken = import.meta.env.VITE_FB_PAGE_ACCESS_TOKEN;

      if (!pageId || !accessToken) {
        setError("API credentials are not configured.");
        setIsLoading(false);
        return;
      }

      try {
        // Step 1: Get the Instagram Business Account ID from the Facebook Page
        const pageApiUrl = `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;
        const pageResponse = await fetch(pageApiUrl);
        const pageData = await pageResponse.json();

        if (pageData.error) throw new Error(pageData.error.message);
        
        const instagramAccountId = pageData.instagram_business_account?.id;

        if (!instagramAccountId) {
          throw new Error("Instagram Business Account not found on this Page.");
        }

        // Step 2: Use the Instagram Business Account ID to get the follower count
        const instaApiUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}?fields=followers_count&access_token=${accessToken}`;
        const instaResponse = await fetch(instaApiUrl);
        const instaData = await instaResponse.json();

        if (instaData.error) throw new Error(instaData.error.message);

        setFollowers(instaData.followers_count);

      } catch (err: unknown) {
        console.error("Failed to fetch followers:", err);
        if (err instanceof Error) {
          setError(err.message || "Failed to load follower count.");
        } else {
          setError("Failed to load follower count.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowers();
  }, []);

  if (isLoading) {
    return <p className="text-5xl font-bold text-[#64FFDA]">Loading...</p>;
  }

  if (error) {
    return <p className="text-xl font-bold text-red-500">{error}</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg text-gray-400 uppercase tracking-wider">Followers</h2>
      <p className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#64FFDA] to-blue-400 mt-2">
        {followers ? followers.toLocaleString() : 'N/A'}
      </p>
      <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
        <span className="text-2xl">📈</span>
        <span className="text-sm">Growing Daily</span>
      </div>
    </div>
  );
};

export default FollowerCount;