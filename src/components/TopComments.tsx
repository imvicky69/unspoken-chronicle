// src/components/TopComments.tsx
import React, { useState, useEffect } from 'react';

interface Comment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  like_count: number;
}

const TopComments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopComments = async () => {
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

        // Step 2: Get recent media
        const mediaApiUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media?fields=id,comments_count&limit=5&access_token=${accessToken}`;
        const mediaResponse = await fetch(mediaApiUrl);
        const mediaData = await mediaResponse.json();

        if (mediaData.error) throw new Error(mediaData.error.message);

        // Step 3: Get comments from the first media item with comments
        const mediaWithComments = mediaData.data?.find((media: { id: string; comments_count: number }) => media.comments_count > 0);
        
        if (mediaWithComments) {
          const commentsApiUrl = `https://graph.facebook.com/v18.0/${mediaWithComments.id}/comments?fields=id,text,username,timestamp,like_count&limit=5&access_token=${accessToken}`;
          const commentsResponse = await fetch(commentsApiUrl);
          const commentsData = await commentsResponse.json();

          if (commentsData.error) throw new Error(commentsData.error.message);

          // Sort by like_count and get top 3
          const topComments = (commentsData.data || [])
            .sort((a: Comment, b: Comment) => b.like_count - a.like_count)
            .slice(0, 3);

          setComments(topComments);
        }

      } catch (err: unknown) {
        console.error("Failed to fetch comments:", err);
        if (err instanceof Error) {
          setError(err.message || "Failed to load comments.");
        } else {
          setError("Failed to load comments.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopComments();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-8 w-full max-w-4xl">
        <h3 className="text-2xl font-bold mb-4 text-left">💬 Top Comments</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-lg p-4 h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || comments.length === 0) {
    return null; // Don't show section if there's an error or no comments
  }

  return (
    <div className="mt-8 w-full max-w-4xl">
      <h3 className="text-2xl font-bold mb-4 text-left">💬 Top Comments</h3>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div 
            key={comment.id}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700 hover:border-[#64FFDA] transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-[#64FFDA]">@{comment.username}</p>
                <p className="text-gray-300 mt-2">{comment.text}</p>
              </div>
              <div className="ml-4 flex items-center gap-1 text-gray-400">
                <span>❤️</span>
                <span className="text-sm">{comment.like_count}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(comment.timestamp).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopComments;
