'use client';

import { categories, posts, users } from '@prisma/client';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useTransition } from 'react';
import { formatDate } from '../helpers/global';
import Tooltip from './UI/Tooltip';
import { deletePost } from '../actions/posts';
import { useRouter } from 'next/navigation';
import LoadingWrapper from './UI/LoadingWrapper';

interface IPostCategories {
  categories: categories;
}

interface IExtendedPost extends posts {
  author?: users;
  post_categories: IPostCategories[];
}

interface IPostCard {
  post: IExtendedPost;
  isEditable?: boolean;
}

const PostCard = ({ post, isEditable }: IPostCard) => {
  const [isDeletePending, setDeleteTransition] = useTransition();
  const { refresh, push } = useRouter();
  const titleEditor = useEditor({
    editable: false,
    content: post.title,
    extensions: [StarterKit],
  });

  const summaryEditor = useEditor({
    editable: false,
    content: post.summary,
    extensions: [StarterKit],
  });

  async function handleDeletePost(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTransition(async () => {
      try {
        await deletePost(post.id);
        refresh();
      } catch (error) {
        console.error(error);
      }
    });
  }

  function editPost(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    push(`/edit-post/${post.id}`);
  }

  return (
    <div className="bg-dark-gray  rounded-md p-2 cursor-pointer h-full flex flex-col justify-between relative">
      {isEditable ? (
        <div className="flex items-center absolute top-4 right-4 gap-2 z-10">
          <Tooltip tooltipText="Edit">
            <button
              onClick={editPost}
              className="bg-dark-gray border-light-gray border rounded-full flex items-center justify-center text-sm p-1"
            >
              <span className="material-symbols-outlined !text-xs !leading-[1] w-3 h-3">
                edit
              </span>
            </button>
          </Tooltip>
          <Tooltip tooltipText="Delete">
            <LoadingWrapper isLoading={isDeletePending}>
              <button
                onClick={handleDeletePost}
                className="bg-dark-gray border-light-gray border rounded-full flex items-center justify-center text-sm p-1"
              >
                <span className="material-symbols-outlined !text-xs !leading-[1] w-3 h-3">
                  close
                </span>
              </button>
            </LoadingWrapper>
          </Tooltip>
        </div>
      ) : (
        <></>
      )}
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
        <EditorContent editor={summaryEditor} />
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
