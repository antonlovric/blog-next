import TextEditor from '@/app/components/TextEditor';
import { prisma } from '@/app/helpers/api';
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

  return (
    <div>
      <TextEditor categories={categories} />
    </div>
  );
};

export default CreatePost;
