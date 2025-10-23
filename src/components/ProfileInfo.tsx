// src/components/ProfileInfo.tsx
import React, { useState, useEffect } from 'react';

// Define a type for our profile data for better code quality
interface InstagramProfile {
  username: string;
  profile_picture_url: string;
  biography: string;
  website?: string;
  name?: string;
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
        const instaApiUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}?fields=username,profile_picture_url,biography,website,name&access_token=${accessToken}`;
        const instaResponse = await fetch(instaApiUrl);
        const instaData = await instaResponse.json();
        if (instaData.error) throw new Error(instaData.error.message);

        setProfile(instaData);

      } catch (err: unknown) {
        console.error("Failed to fetch profile info:", err);
        if (err instanceof Error) {
          setError(err.message || "Failed to load profile info.");
        } else {
          setError("Failed to load profile info.");
        }
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
    <div className="flex flex-col items-center text-center mb-6">
      <div className="relative">
        <img
          src={profile.profile_picture_url}
          alt={`${profile.username} profile picture`}
          className="w-40 h-40 rounded-full border-4 border-[#64FFDA] shadow-lg shadow-[#64FFDA]/30"
        />
        <div className="absolute -bottom-2 -right-2 bg-[#64FFDA] text-gray-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
          ✓
        </div>
      </div>
      {profile.name && (
        <h2 className="mt-6 text-4xl font-bold">{profile.name}</h2>
      )}
      <p className="mt-2 text-xl text-[#64FFDA]">@{profile.username}</p>
      <p className="mt-3 max-w-2xl text-gray-300 text-lg">{profile.biography}</p>
      {profile.website && (
        <a 
          href={profile.website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-3 text-[#64FFDA] hover:underline flex items-center gap-2"
        >
          🔗 {profile.website}
        </a>
      )}
      <div className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold">
        Public Figure
      </div>
    </div>
  );
};

export default ProfileInfo;