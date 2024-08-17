import { Prisma } from '@prisma/client';
import React from 'react';
import { formatDate } from '../helpers/global';
import DOMPurify from 'isomorphic-dompurify';
import ProfileImage from './UI/ProfileImage';

interface IFeaturedPost {
  post: Prisma.postsGetPayload<{
    include: {
      author: true;
      post_categories: { include: { categories: true } };
    };
  }>;
}

const FeaturedPost = (props: IFeaturedPost) => {
  const sanitizedTitle = DOMPurify.sanitize(props.post.title || '');
  const sanitizedSummary = DOMPurify.sanitize(props.post.summary || '');

  return (
    <article className="grid grid-cols-2 gap-x-8 w-5/6 mx-auto mt-10">
      <img
        alt="Blog image"
        src={props.post.cover_image || ''}
        height={400}
        width={650}
        className="border-2 border-blog-blue rounded-md h-[400px] w-[650px] object-cover"
      />
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {props.post.post_categories.map((category) => (
              <span
                key={category.categories_id}
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
              className="font-light text-xl text-justify"
              dangerouslySetInnerHTML={{ __html: sanitizedSummary }}
            ></div>
          </div>
        </div>
        <div className="flex font-extralight text-lg justify-between items-center">
          <div className="flex items-center justify-between gap-2">
            <div className="h-[40px] w-[40px]">
              <ProfileImage imagePath={props.post.author.profile_image} />
            </div>

            <p>
              by {props.post.author.first_name} {props.post.author.last_name}
            </p>
          </div>
          <p> {formatDate(props.post.created_at)}</p>
        </div>
      </div>
    </article>
  );
};

export default FeaturedPost;
