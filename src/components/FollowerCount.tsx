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
    <div>
      <h2 className="text-lg text-gray-300">Current Followers</h2>
      <p className="text-7xl font-bold text-[#64FFDA]">
        {followers ? followers.toLocaleString() : 'N/A'}
      </p>
    </div>
  );
};

export default FollowerCount;