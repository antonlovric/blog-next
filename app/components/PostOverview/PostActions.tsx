'use client';

import React, { useTransition } from 'react';
import Tooltip from '../UI/Tooltip';
import {
  categories,
  post_categories,
  post_votes,
  posts,
  users,
} from '@prisma/client';
import { useRouter } from 'next/navigation';

interface IPostCategory extends post_categories {
  categories: categories;
}

interface IPost extends posts {
  author: users | null;
  post_categories: IPostCategory[] | null;
  post_votes: post_votes[] | null;
  isPostLiked?: boolean;
  isPostDisliked?: boolean;
  commentCount?: number;
}

export type TVote = 'up' | 'down' | null;

interface IPostActions {
  post: IPost | null;
  updateVote: (vote: TVote) => Promise<post_votes | null>;
}

const PostActions = (props: IPostActions) => {
  const likeCount = props.post?.post_votes?.reduce((sum, vote) => {
    if (vote.type === 'up') {
      return sum + 1;
    }
    return sum - 1;
  }, 0);

  const { refresh } = useRouter();

  const [isPending, setTransition] = useTransition();

  async function handleLike() {
    const voteType = props.post?.isPostLiked ? null : 'up';
    const updatedVote = await props.updateVote(voteType);
    setTransition(refresh);
  }

  async function handleDislike() {
    const voteType = props.post?.isPostDisliked ? null : 'down';
    const updatedVote = await props.updateVote(voteType);
    setTransition(refresh);
  }

  async function copyShareLink() {
    return await navigator.clipboard.writeText(window.location.href);
  }

  return (
    <div className="flex items-center gap-2 ">
      <div className="rounded-full flex items-center gap-2 border border-light-gray">
        <Tooltip tooltipText="Like">
          <button
            onClick={handleLike}
            className="flex items-center justify-center p-2 cursor-pointer gap-2"
          >
            <span
              className={`material-symbols-outlined ${
                props.post?.isPostLiked && 'text-green'
              }`}
            >
              thumb_up
            </span>
          </button>
        </Tooltip>
        <span>{likeCount}</span>
        <Tooltip tooltipText="Dislike">
          <button
            onClick={handleDislike}
            className="flex items-center justify-center p-2 cursor-pointer gap-2"
          >
            <span
              className={`material-symbols-outlined ${
                props.post?.isPostDisliked && 'text-green'
              }`}
            >
              thumb_down
            </span>
          </button>
        </Tooltip>
      </div>
      <Tooltip tooltipText="Comment">
        <button className="rounded-full flex items-center gap-2 p-2 border border-light-gray">
          <span className="material-symbols-outlined">forum</span>
          <span>{props.post?.commentCount || 0}</span>
        </button>
      </Tooltip>
      <Tooltip tooltipText="Copy share link">
        <button onClick={copyShareLink}>
          <span className="material-symbols-outlined">share</span>
        </button>
      </Tooltip>
    </div>
  );
};

export default PostActions;
