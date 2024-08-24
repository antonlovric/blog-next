import { Metadata } from 'next';
import FeaturedPost from '../components/FeaturedPost';
import { inter } from './layout';
import { getRelevantPostId, updateRelevanceScores } from '../helpers/analytics';
import { prisma } from '../helpers/api';
import { getSanitizedHtml } from '../helpers/global';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Tech Tales | Home',
};

export default async function Home() {
  updateRelevanceScores();
  const relevantPostId = await getRelevantPostId();

  const relevantPost = relevantPostId
    ? await prisma.posts.findFirst({
        where: {
          id: relevantPostId,
        },
        select: {
          id: true,
          cover_image: true,
          title: true,
          summary: true,
          created_at: true,
          author: {
            select: {
              first_name: true,
              last_name: true,
              id: true,
              profile_image: true,
            },
          },
          post_categories: {
            select: {
              categories: true,
              posts: {
                select: {
                  cover_image: true,
                  created_at: true,
                  id: true,
                  summary: true,
                  title: true,
                },
              },
            },
          },
        },
      })
    : null;
  const POST_PER_CATEGORY_COUNT = 5;

  const postsByCategory = await prisma.categories.findMany({
    select: {
      id: true,
      name: true,
      post_categories: {
        select: {
          posts: {
            select: {
              cover_image: true,
              title: true,
              summary: true,
              id: true,
            },
          },
          categories: {
            select: {
              id: true,
            },
          },
        },
        take: POST_PER_CATEGORY_COUNT,
        orderBy: {
          posts: {
            created_at: {
              sort: 'desc',
            },
          },
        },
      },
    },
  });

  const filteredPostCategories = postsByCategory.filter(
    (category) => category.post_categories.length
  );

  return (
    <div className={inter.className}>
      <h1 className="text-heading">
        Unlocking tech&apos;s untold stories
        <span className="text-blog-blue"> one post at a time</span>
      </h1>
      <main>{relevantPost ? <FeaturedPost post={relevantPost} /> : <></>}</main>
      {filteredPostCategories.map((category) => (
        <section className="flex flex-col gap-2 mt-6 pb-4" key={category.id}>
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center justify-between gap-6 w-full">
              <p className="whitespace-nowrap">Latest {category.name} news</p>
              <div className="h-[1px] bg-blog-blue w-full"></div>
            </div>
            <Link href={`/posts?categories=[${category.id}]`}>
              <button className="button-primary">More</button>
            </Link>
          </div>
          <div className="grid md:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-y-8 gap-x-6 overflow-x-scroll mt-2">
            {category.post_categories.map((post) => (
              <Link
                href={`post/${post.posts.id}`}
                className="bg-dark-gray  rounded-md p-2 cursor-pointer h-full flex flex-col justify-between relative"
                key={`${post.categories.id}-${post.posts.id}`}
              >
                <Image
                  src={post.posts.cover_image || ''}
                  alt=""
                  className="block rounded-md h-[250px] w-full object-cover"
                  height={350}
                  width={600}
                />
                <span
                  dangerouslySetInnerHTML={{
                    __html: getSanitizedHtml(post.posts.title),
                  }}
                ></span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: getSanitizedHtml(post.posts.summary),
                  }}
                ></span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
