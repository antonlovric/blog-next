'use client';

import { categories, posts, users } from '@prisma/client';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import { formatDate } from '../helpers/global';

interface IPostCategories {
  categories: categories;
}

interface IExtendedPost extends posts {
  author?: users;
  post_categories: IPostCategories[];
}

interface IPostCard {
  post: IExtendedPost;
}

const PostCard = ({ post }: IPostCard) => {
  const titleEditor = useEditor({
    editable: false,
    content: post.title,
    extensions: [StarterKit],
  });

  return (
    <div className="border border-white rounded-md p-2 w-[350px] cursor-pointer h-full flex flex-col justify-between">
      <div>
        <div className="w-full relative">
          <img
            src={post.cover_image || ''}
            alt={post.title + ' cover image'}
            className="block rounded-md h-[250px] w-full object-cover"
          />
          <div className="absolute flex items-center gap-2 bottom-2 right-2">
            {post.post_categories.map((postCategory) => (
              <div
                className="text-xs bg-blog-blue px-1 rounded-sm"
                key={postCategory.categories.id}
              >
                {postCategory.categories.name}
              </div>
            ))}
          </div>
        </div>
        <EditorContent className="font-semibold" editor={titleEditor} />
        <p className="">{post.summary}</p>
      </div>
      <div className="flex items-center justify-between">
        <p>
          {post.author?.first_name} {post.author?.last_name}
        </p>
        <p>{formatDate(post?.created_at)}</p>
      </div>
    </div>
  );
};

export default PostCard;
