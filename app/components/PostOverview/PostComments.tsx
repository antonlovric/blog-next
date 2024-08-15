'use client';

import { addComment } from '@/app/actions/posts';
import { comments } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import LoadingWrapper from '../UI/LoadingWrapper';

interface ICommentsList extends comments {
  users: {
    first_name: string | null;
    last_name: string | null;
    profile_image: string | null;
  } | null;
}

interface IPostComments {
  post_id: number;
  comments: ICommentsList[];
}

const PostComments = (props: IPostComments) => {
  const [isPending, setTransition] = useTransition();
  const { refresh } = useRouter();
  async function handleAddComment(data: FormData) {
    try {
      const comment = data.get('comment')?.toString();
      if (comment) {
        await addComment({ comment, post_id: props.post_id });
        setTransition(refresh);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <p className="underline font-semibold text-2xl">Comments</p>
      <form
        action={handleAddComment}
        className="flex items-center gap-2 bg-dark-gray p-2 rounded-md border-2 border-transparent focus-within:border-light-gray my-2"
      >
        <LoadingWrapper isLoading={isPending}>
          <textarea
            name="comment"
            placeholder="Add a comment!"
            className="bg-transparent focus:outline-none px-2 w-full"
          />
        </LoadingWrapper>
        <button type="submit">
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
      {props?.comments.length === 0 ? (
        <p>No comments yet!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {props?.comments.map((comment) => (
            <div key={comment.id} className="mb-2 flex gap-2">
              <img
                className="w-[20px] h-[20px] rounded-full"
                src={comment.users?.profile_image || ''}
                alt=""
              />
              <div>
                <p>
                  {comment.users?.first_name} {comment.users?.last_name}
                </p>
                <p className="mt-1">{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostComments;
