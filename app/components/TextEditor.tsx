'use client';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useRef, useState } from 'react';
import type { categories, Prisma } from '@prisma/client';
import { useRouter } from 'next/navigation';
import CharacterCount from '@tiptap/extension-character-count';
import BodyEditor from './CreatePost/BodyEditor';
import { Image as CustomTiptapImage } from '@/app/helpers/tiptap';
import { uploadImage } from '../helpers/s3';
import { createPost, editPost } from '../actions/posts';
import { deleteImages } from '../actions/images';

interface ITextEditor {
  categories?: categories[];
  post?: Prisma.postsGetPayload<{
    include: {
      post_categories: true;
    };
  }>;
  userId?: string;
}

const TextEditor = ({ categories, post, userId }: ITextEditor) => {
  const [coverImage, setCoverImage] = useState(post?.cover_image || '');
  const [file, setFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const titleEditor = useEditor({
    extensions: [StarterKit, CharacterCount.configure({ limit: 100 })],
    content: post?.title || '<h1>This is the title of your article!</h1>',
    injectCSS: false,
    editorProps: {
      attributes: {
        class: 'px-1 py-1',
      },
    },
  });

  const summaryEditor = useEditor({
    extensions: [StarterKit, CharacterCount.configure({ limit: 300 })],
    content: post?.summary || '<h2>Write a quick summary!</h2>',
    injectCSS: false,
    editorProps: {
      attributes: {
        class: 'px-1 py-1',
      },
    },
  });

  const bodyEditor = useEditor({
    extensions: [StarterKit, CustomTiptapImage],
    content: post?.html_content || '<p>Hello World! 🌎️</p>',
    editorProps: {
      attributes: {
        class: 'px-1 py-1',
      },
    },
  });

  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    post?.post_categories?.map((category) => category.categories_id) || []
  );
  const uploadedImageKeys = useRef<string[]>([]);
  const shouldDeleteImages = useRef(false);

  useEffect(() => {
    return () => {
      if (shouldDeleteImages.current) {
        deleteImages(uploadedImageKeys.current);
      }
    };
  }, []);

  const handleSubmit = async () => {
    if (post) {
      try {
        setIsCreating(true);
        shouldDeleteImages.current = false;
        await editPost({
          id: post.id,
          categoryIds: selectedCategories,
          html_content: bodyEditor?.getHTML() || '',
          summary: summaryEditor?.getHTML() || '',
          title: titleEditor?.getHTML() || '',
        });
        router.replace('/');
      } catch (error) {
        console.error(error);
      } finally {
        setIsCreating(false);
        return;
      }
    }

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
      <EditorContent editor={titleEditor} className="text-3xl" />
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
            <img
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
            <div className="bg-blog-blue text-dark-gray w-[400px] h-[250px] flex items-center justify-center cursor-pointer">
              <span className="material-symbols-outlined !text-8xl">image</span>
            </div>
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
      <EditorContent editor={summaryEditor} className="text-xl" />
      <BodyEditor
        editor={bodyEditor}
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
