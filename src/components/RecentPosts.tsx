// src/components/RecentPosts.tsx
import React, { useState, useEffect } from 'react';

// Define the type for a single post, making media_url and thumbnail_url optional
interface InstagramPost {
  id: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

const RecentPosts: React.FC = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      const pageId = import.meta.env.VITE_FB_PAGE_ID;
      const accessToken = import.meta.env.VITE_FB_PAGE_ACCESS_TOKEN;

      try {
        const pageApiUrl = `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;
        const pageResponse = await fetch(pageApiUrl);
        const pageData = await pageResponse.json();
        if (pageData.error) throw new Error(pageData.error.message);
        
        const instagramAccountId = pageData.instagram_business_account?.id;
        if (!instagramAccountId) throw new Error("Instagram Business Account not found.");

        // 1. ADDED `thumbnail_url` TO THE FIELDS WE ARE REQUESTING
        const mediaApiUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media?fields=id,media_url,thumbnail_url,permalink,media_type&limit=6&access_token=${accessToken}`;
        const mediaResponse = await fetch(mediaApiUrl);
        const mediaData = await mediaResponse.json();
        if (mediaData.error) throw new Error(mediaData.error.message);

        // We no longer need to filter. We will handle both media types in the JSX.
        setPosts(mediaData.data);

      } catch (err: any) {
        console.error("Failed to fetch recent posts:", err);
        setError("Failed to load recent posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  if (isLoading) { /* ... loading skeleton remains the same ... */ }
  if (error) { /* ... error display remains the same ... */ }

  return (
    // 2. ADDED `mt-16` TO CREATE SPACE FROM THE CONTENT ABOVE
    <div className="w-full max-w-4xl mx-auto px-4 mt-16">
      <h3 className="text-2xl font-bold text-center mb-6">Latest Posts</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative aspect-square overflow-hidden rounded-lg group"
          >
            <img
              // 3. USE `media_url` FOR IMAGES, OR FALL BACK TO `thumbnail_url` FOR VIDEOS/REELS
              src={post.media_url || post.thumbnail_url}
              alt="Instagram post"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"></div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RecentPosts;