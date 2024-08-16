'use server';

import { revalidatePath } from 'next/cache';
import { incrementPostCommentCount } from '../helpers/analytics';
import { prisma } from '../helpers/api';
import { getActiveUser } from '../helpers/auth';
import { IAddComment, ICreatePostRequest, IEditPostRequest } from './types';

export async function addComment(args: IAddComment) {
  'use server';
  const activeUser = getActiveUser();
  if (!activeUser) throw new Error('User not logged in');
  incrementPostCommentCount(args.post_id);
  await prisma.comments.create({
    data: {
      comment: args.comment,
      posts_id: args.post_id,
      users_id: activeUser.id,
    },
  });
}

export async function createPost(props: ICreatePostRequest) {
  'use server';

  try {
    const activeUser = getActiveUser();
    if (activeUser?.id) {
      await prisma.posts.create({
        data: {
          html_content: props.html_content,
          summary: props.summary,
          title: props.title,
          post_categories: {
            create: props.categoryIds.map((categoryId) => ({
              categories: {
                connect: {
                  id: categoryId,
                },
              },
            })),
          },
          users_id: activeUser.id,
          cover_image: props.coverImagePath,
        },
      });
      revalidatePath('/');
      revalidatePath('/posts');
    }
  } catch (error) {
    console.error('ERROR CREATING POST');
    console.error(error);
  }
}

export async function editPost(props: IEditPostRequest) {
  'use server';

  try {
    const activeUser = getActiveUser();
    if (activeUser?.id) {
      await prisma.$transaction([
        prisma.post_categories.deleteMany({
          where: {
            posts_id: props.id,
          },
        }),
        prisma.posts.update({
          where: {
            id: props.id,
          },
          data: {
            id: props.id,
            html_content: props.html_content,
            summary: props.summary,
            title: props.title,
            post_categories: {
              create: props.categoryIds.map((categoryId: number) => ({
                categories: {
                  connect: {
                    id: categoryId,
                  },
                },
              })),
            },
            users_id: activeUser.id,
            cover_image: props.coverImagePath,
          },
        }),
      ]);

      revalidatePath('/');
      revalidatePath('/posts');
    }
  } catch (error) {
    console.error('ERROR CREATING POST');
    console.error(error);
  }
}

export async function deletePost(postId: number) {
  'use server';
  const activeUser = getActiveUser();
  if (!activeUser) throw new Error('User not logged in');
  await prisma.posts.delete({
    where: {
      id: postId,
    },
  });
}
