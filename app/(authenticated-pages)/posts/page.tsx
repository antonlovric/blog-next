import PostCard from '@/app/components/PostCard';
import PostCategoriesFilter from '@/app/components/PostCategoriesFilter';
import PostsSearch from '@/app/components/PostsSearch';
import PageSizeSelector from '@/app/components/UI/PageSizeSelector';
import Pagination from '@/app/components/UI/Pagination';
import { prisma } from '@/app/helpers/api';
import Link from 'next/link';
import React from 'react';

export interface ISearchParams {
  categories?: string;
  search?: string;
  pageSize?: string;
  activePage?: string;
}

interface IPostsPage {
  searchParams: ISearchParams;
}

const Posts = async ({ searchParams }: IPostsPage) => {
  const parsedSearchQuery = decodeURIComponent(searchParams?.search || '');
  const parsedCategoriesQuery: number[] = JSON.parse(
    decodeURIComponent(searchParams?.categories || '[]')
  );
  const activePageNumber: number = parseInt(searchParams?.activePage || '1');

  const pageSize: number = parseInt(searchParams?.pageSize || '5');
  const whereClause: any = {};
  if (parsedSearchQuery) {
    whereClause['OR'] = [
      {
        title: {
          contains: parsedSearchQuery,
          mode: 'insensitive',
        },
      },
    ];
  }

  if (parsedCategoriesQuery.length > 0) {
    whereClause['OR'] = whereClause['OR'] || [];
    whereClause['OR'].push({
      post_categories: {
        some: {
          categories_id: {
            in: parsedCategoriesQuery,
          },
        },
      },
    });
  }

  const postCount = await prisma.posts.count({
    where: whereClause,
  });

  function getSkipValue() {
    if (activePageNumber > Math.ceil(postCount / pageSize)) {
      return 0;
    }
    return pageSize * (activePageNumber - 1);
  }

  const posts = await prisma.posts.findMany({
    select: {
      id: true,
      cover_image: true,
      title: true,
      summary: true,
      created_at: true,
      author: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      },
      post_categories: {
        select: {
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    where: whereClause,
    take: pageSize,
    skip: getSkipValue(),
  });

  const categories = await prisma.categories.findMany();

  const numberOfPages = Math.ceil(postCount / pageSize);

  return (
    <div className="w-11/12 mx-auto">
      <div>
        <h1 className="text-center text-6xl font-semibold mb-2">Tech Tales</h1>
        <h2 className="text-center text-3xl font-extralight">
          Today&apos;s stories for tomorrow&apos;s tech
        </h2>
        <PostsSearch initialValue={parsedSearchQuery} />
      </div>
      <PostCategoriesFilter categories={categories} />
      <div className="grid grid-cols-auto-fill-350 autofill:250 gap-y-8 gap-x-6">
        {posts.map((post) => (
          <Link href={`/post/${post.id}`} key={post.id}>
            <PostCard post={post} />
          </Link>
        ))}
      </div>
      <section className="flex items-start justify-between">
        <Pagination
          selectedPage={activePageNumber}
          numberOfPages={numberOfPages}
        />
        <PageSizeSelector />
      </section>
    </div>
  );
};

export default Posts;
