import PostActions, { TVote } from '@/app/components/PostOverview/PostActions';
import PostComments from '@/app/components/PostOverview/PostComments';
import ProfileImage from '@/app/components/UI/ProfileImage';
import {
  incrementPostLikeCount,
  incrementPostVisitCount,
} from '@/app/helpers/analytics';
import { prisma } from '@/app/helpers/api';
import { getActiveUser } from '@/app/helpers/auth';
import { formatDate } from '@/app/helpers/global';
import DOMPurify from 'isomorphic-dompurify';
import Link from 'next/link';
import React from 'react';

interface IPostPage {
  params: { postId: string; commentPage: string };
}

const Post = async ({ params }: IPostPage) => {
  const COMMENT_PAGE_SIZE = 10;

  const post = await prisma.posts.findFirst({
    where: { id: { equals: parseInt(params.postId) } },
    include: {
      author: true,
      post_categories: { include: { categories: true } },
      post_votes: true,
      comments: {
        skip: parseInt(params.commentPage || '0'),
        take: COMMENT_PAGE_SIZE,
        orderBy: { created_at: 'asc' },
        include: {
          users: {
            select: { first_name: true, last_name: true, profile_image: true },
          },
        },
      },
    },
  });

  if (post?.id) {
    incrementPostVisitCount(post.id);
  }

  const commentCount = await prisma.comments.count({
    where: { posts_id: post?.id },
  });

  const activeUser = getActiveUser();

  function getIsLiked() {
    if (!activeUser) return false;
    return !!post?.post_votes.find(
      (vote) => vote.user_id === activeUser?.id && vote.type === 'up'
    );
  }

  function getIsDisliked() {
    if (!activeUser) return false;
    return !!post?.post_votes.find(
      (vote) => vote.user_id === activeUser?.id && vote.type === 'down'
    );
  }

  const isLiked = getIsLiked();

  const isDisliked = getIsDisliked();

  async function handleVote(vote: TVote) {
    'use server';

    try {
      if (activeUser && post) {
        if (vote === null) {
          const removedVote = await prisma.post_votes.delete({
            where: {
              user_id_post_id: { post_id: post.id, user_id: activeUser?.id },
            },
          });
          return removedVote;
        }
        if (vote === 'up') {
          incrementPostLikeCount(post.id);
        }
        const updatedVote = await prisma.post_votes.upsert({
          where: {
            user_id_post_id: { post_id: post.id, user_id: activeUser?.id },
          },
          create: { type: vote, post_id: post.id, user_id: activeUser?.id },
          update: { type: vote, post_id: post.id, user_id: activeUser?.id },
        });
        return updatedVote;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const sanitizedTitle = DOMPurify.sanitize(post?.title || '');
  const sanitizedSummary = DOMPurify.sanitize(post?.summary || '');
  const sanitizedBody = DOMPurify.sanitize(post?.html_content || '');

  return (
    <main className="max-w-[400px] md:max-w-[1000px] mx-auto">
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
        className="text-4xl font-semibold text-center mb-5"
      ></div>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedSummary }}
        className="text-xl mb-5"
      ></div>
      <section className="flex flex-col mb-5 w-3/4 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${post?.author.id}`}>
              <div className="w-[60px] h-[60px]">
                <ProfileImage imagePath={post?.author.profile_image} />
              </div>
            </Link>
            <div className="flex flex-col justify-between h-full">
              <Link href={`/profile/${post?.author.id}`}>
                <p>
                  Author: {post?.author.first_name} {post?.author.last_name}
                </p>
              </Link>
              <p>{formatDate(post?.created_at)}</p>
            </div>
          </div>
          {post ? (
            <PostActions
              post={{
                ...post,
                isPostLiked: isLiked,
                isPostDisliked: isDisliked,
                commentCount,
              }}
              updateVote={handleVote}
            />
          ) : (
            <></>
          )}
        </div>
        <img
          src={post?.cover_image || ''}
          alt="Post cover image"
          className="my-2"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined"></span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post?.post_categories.map((category) => (
            <button
              key={category.categories_id}
              className="px-3 py-2 text-sm cursor-pointer bg-blog-blue rounded-md whitespace-nowrap"
            >
              {category.categories.name}
            </button>
          ))}
        </div>
      </section>
      <div dangerouslySetInnerHTML={{ __html: sanitizedBody }}></div>
      <div className="mt-4">
        {post ? (
          <PostComments comments={post.comments} post_id={post.id} />
        ) : (
          <></>
        )}
      </div>
    </main>
  );
};

export default Post;
