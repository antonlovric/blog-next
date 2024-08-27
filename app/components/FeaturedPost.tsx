import React from 'react';
import { formatDate } from '../helpers/global';
import DOMPurify from 'isomorphic-dompurify';
import ProfileImage from './UI/ProfileImage';
import Image from 'next/image';
import { getRelevantPostId } from '../helpers/analytics';
import { prisma } from '../helpers/api';
import Link from 'next/link';

const FeaturedPost = async () => {
  const relevantPostId = await getRelevantPostId();

  const post = relevantPostId
    ? await prisma.posts.findFirst({
        where: {
          id: relevantPostId,
        },
        select: {
          id: true,
          cover_image: true,
          title: true,
          summary: true,
          created_at: true,
          author: {
            select: {
              first_name: true,
              last_name: true,
              id: true,
              profile_image: true,
            },
          },
          post_categories: {
            select: {
              categories: true,
              posts: {
                select: {
                  cover_image: true,
                  created_at: true,
                  id: true,
                  summary: true,
                  title: true,
                },
              },
            },
          },
        },
      })
    : null;
  if (!post) return <></>;
  const sanitizedTitle = DOMPurify.sanitize(post.title || '');
  const sanitizedSummary = DOMPurify.sanitize(post.summary || '');

  return (
    <Link
      className="grid grid-cols-2 gap-x-8 w-5/6 mx-auto mt-10"
      href={`/post/${post.id}`}
    >
      <Image
        alt="Blog image"
        src={post.cover_image || ''}
        height={500}
        width={750}
        className="border-2 border-blog-blue rounded-md h-[400px] w-[650px] object-cover"
      />
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {post.post_categories.map((category) => (
              <span
                key={category.categories.id}
                className="bg-blog-blue px-2 py-1 rounded-md"
              >
                {category.categories.name}
              </span>
            ))}
          </div>
          <div>
            <div
              className="text-subheading font-semibold"
              dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
            ></div>
            <div
              className="font-light text-xl text-justify mt-4"
              dangerouslySetInnerHTML={{ __html: sanitizedSummary }}
            ></div>
          </div>
        </div>
        <div className="flex font-extralight text-lg justify-between items-center">
          <div className="flex items-center justify-between gap-2">
            <div className="h-[40px] w-[40px]">
              <ProfileImage imagePath={post.author.profile_image} />
            </div>

            <p>
              by {post.author.first_name} {post.author.last_name}
            </p>
          </div>
          <p> {formatDate(post.created_at)}</p>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedPost;
