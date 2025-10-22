// src/components/ProfileInfo.tsx
import React, { useState, useEffect } from 'react';

// Define a type for our profile data for better code quality
interface InstagramProfile {
  username: string;
  profile_picture_url: string;
  biography: string;
}

const ProfileInfo: React.FC = () => {
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      const pageId = import.meta.env.VITE_FB_PAGE_ID;
      const accessToken = import.meta.env.VITE_FB_PAGE_ACCESS_TOKEN;

      try {
        // Step 1: Same as before, get the Instagram Business Account ID
        const pageApiUrl = `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;
        const pageResponse = await fetch(pageApiUrl);
        const pageData = await pageResponse.json();
        if (pageData.error) throw new Error(pageData.error.message);
        
        const instagramAccountId = pageData.instagram_business_account?.id;
        if (!instagramAccountId) throw new Error("Instagram Business Account not found.");

        // Step 2: Now, ask for the profile fields we want using that ID
        const instaApiUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}?fields=username,profile_picture_url,biography&access_token=${accessToken}`;
        const instaResponse = await fetch(instaApiUrl);
        const instaData = await instaResponse.json();
        if (instaData.error) throw new Error(instaData.error.message);

        setProfile(instaData);

      } catch (err: any) {
        console.error("Failed to fetch profile info:", err);
        setError("Failed to load profile info.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileInfo();
  }, []);

  if (isLoading) {
    return <div className="animate-pulse h-24 bg-gray-700 rounded-lg"></div>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!profile) {
    return null; // Don't render anything if there's no profile
  }

  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={profile.profile_picture_url}
        alt={`${profile.username} profile picture`}
        className="w-32 h-32 rounded-full border-4 border-gray-600"
      />
      <h2 className="mt-4 text-3xl font-bold">@{profile.username}</h2>
      <p className="mt-2 max-w-md text-gray-300">{profile.biography}</p>
    </div>
  );
};

export default ProfileInfo;