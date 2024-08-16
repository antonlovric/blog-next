import TextEditor from '@/app/components/TextEditor';
import { prisma } from '@/app/helpers/api';
import { getActiveUser } from '@/app/helpers/auth';
import React from 'react';

interface IEditPostPage {
  params: { postId: string };
}

const EditPost = async ({ params }: IEditPostPage) => {
  const categories = await prisma.categories.findMany();

  const post = await prisma.posts.findFirst({
    where: {
      id: {
        equals: parseInt(params.postId),
      },
    },
    include: {
      post_categories: true,
    },
  });
  const user = getActiveUser();

  return (
    <div>
      {post ? (
        <TextEditor categories={categories} post={post} userId={user.id} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default EditPost;
