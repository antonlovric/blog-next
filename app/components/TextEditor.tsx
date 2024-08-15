'use client';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useRef, useState } from 'react';
import type { categories } from '@prisma/client';
import { ICreatePostRequest } from '../(authenticated-pages)/create-post/page';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CharacterCount from '@tiptap/extension-character-count';
import BodyEditor from './CreatePost/BodyEditor';
import { Image as CustomTiptapImage } from '@/app/helpers/tiptap';
import { uploadImage } from '../helpers/s3';

interface ITextEditor {
  categories?: categories[];
  createPost: (args: ICreatePostRequest) => Promise<void>;
}

const TextEditor = ({ categories, createPost }: ITextEditor) => {
  const [coverImage, setCoverImage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const titleEditor = useEditor({
    extensions: [StarterKit, CharacterCount.configure({ limit: 100 })],
    content: '<h1>This is the title of your article!</h1>',
    injectCSS: false,
  });

  const summaryEditor = useEditor({
    extensions: [StarterKit, CharacterCount.configure({ limit: 300 })],
    content: '<h2>Write a quick summary!</h2>',
    injectCSS: false,
  });

  const bodyEditor = useEditor({
    extensions: [StarterKit, CustomTiptapImage],
    content: '<p>Hello World! 🌎️</p>',
  });

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const uploadedImageKeys = useRef<string[]>([]);
  const shouldDeleteImages = useRef(true);

  useEffect(() => {
    return () => {
      if (shouldDeleteImages.current) {
        deleteImages(uploadedImageKeys.current);
      }
    };
  }, []);

  const handleSubmit = async () => {
    try {
      setIsCreating(true);
      const imagePath = file ? await uploadImage(file) : '';
      shouldDeleteImages.current = false;

      await createPost({
        categoryIds: selectedCategories,
        html_content: bodyEditor?.getHTML() || '',
        summary: summaryEditor?.getHTML() || '',
        title: titleEditor?.getHTML() || '',
        coverImagePath: imagePath,
      });
      router.replace('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  function selectCategory(id: number) {
    const updatedCategories = selectedCategories.concat([id]);
    setSelectedCategories(updatedCategories);
  }

  function removeCategory(targetId: number) {
    setSelectedCategories(selectedCategories.filter((id) => id !== targetId));
  }

  function toggleCategory(id: number) {
    if (getIsCategorySelected(id)) {
      removeCategory(id);
    } else selectCategory(id);
  }

  function getIsCategorySelected(targetIid: number) {
    return !!selectedCategories.find((id) => id === targetIid);
  }

  async function deleteImages(imageIds: string[]) {
    try {
      await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageIds }),
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const image = e.target.files?.[0];
    if (image) {
      setFile(image);
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (reader.result && typeof reader.result === 'string') {
          setCoverImage(reader.result);
        }
      };
      reader.readAsDataURL(image);
    }
  }

  function removeCoverImage() {
    setCoverImage('');
  }

  return (
    <main>
      <EditorContent editor={titleEditor} className="text-4xl" />
      <hr className="mt-2 mb-6" />
      <div className="flex justify-end items-center gap-2">
        {categories?.map((category) => (
          <div
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`${
              !getIsCategorySelected(category.id)
                ? 'bg-none border-blog-blue border'
                : 'bg-blog-blue border border-transparent'
            }  flex items-center justify-center px-2 py-1 rounded-md text-xs cursor-pointer`}
          >
            {category.name}
          </div>
        ))}
      </div>
      {coverImage ? (
        <div className="w-full flex justify-center relative py-5">
          <span className="relative">
            <button
              onClick={removeCoverImage}
              className="absolute top-2 right-2 bg-red-500 rounded-full p-0 h-[24px] w-[24px]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <Image
              src={coverImage}
              alt=""
              width={100}
              height={200}
              className="w-[400px] rounded-md"
            />
          </span>
        </div>
      ) : (
        <div className="w-full flex justify-center relative py-5">
          <label className="pointer" htmlFor="cover-image">
            <img src="https://via.assets.so/img.jpg?w=400&h=200&tc=#FFF&bg=#212121&t=Upload cover image" />
          </label>
          <input
            className="hidden"
            type="file"
            name="cover-image"
            id="cover-image"
            onChange={handleImageSelect}
          />
        </div>
      )}
      <EditorContent editor={summaryEditor} className="text-4xl" />
      <BodyEditor
        editor={bodyEditor}
        deleteImages={deleteImages}
        updateUploadedImagesList={(key) => uploadedImageKeys.current.push(key)}
      />
      <div className="mt-5">
        <button
          disabled={isCreating}
          onClick={handleSubmit}
          className="button-primary"
        >
          {isCreating ? 'Loading' : 'Submit'}
        </button>
      </div>
    </main>
  );
};

export default TextEditor;
