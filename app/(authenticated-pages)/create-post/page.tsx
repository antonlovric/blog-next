import TextEditor from '@/app/components/TextEditor';
import { prisma } from '@/app/helpers/api';
import { getActiveUser } from '@/app/helpers/auth';
import { revalidatePath } from 'next/cache';
import React from 'react';
export interface ICreatePostRequest {
  html_content: string;
  categoryIds: number[];
  title: string;
  summary: string;
  coverImagePath?: string;
}

export interface IImageUploadResponse {
  imagePath: string;
}

const CreatePost = async () => {
  const categories = await prisma.categories.findMany();

  async function handleCreate(props: ICreatePostRequest) {
    'use server';

    try {
      const activeUser = getActiveUser();
      if (activeUser?.id) {
        const res = await prisma.posts.create({
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
      }
      revalidatePath('/');
      revalidatePath('/posts');
    } catch (error) {
      console.error('ERROR CREATING POST');
      console.error(error);
      throw error;
    }
  }

  return (
    <div>
      <TextEditor categories={categories} />
    </div>
  );
};

export default CreatePost;
