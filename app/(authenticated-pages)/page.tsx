import { Metadata } from 'next';
import FeaturedPost from '../components/FeaturedPost';
import { inter } from './layout';
import { getRelevantPostId, updateRelevanceScores } from '../helpers/analytics';
import { prisma } from '../helpers/api';
import { getSanitizedHtml } from '../helpers/global';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tech Tales | Home',
};

export default async function Home() {
  updateRelevanceScores();
  const relevantPostId = await getRelevantPostId();

  const relevantPost = await prisma.posts.findFirst({
    where: {
      id: {
        equals: relevantPostId,
      },
    },
    include: {
      author: true,
      post_categories: {
        include: {
          categories: true,
        },
      },
    },
  });

  const postsByCategory = await prisma.categories.findMany({
    include: {
      post_categories: {
        include: {
          posts: true,
        },
        orderBy: {
          posts: {
            created_at: { sort: 'desc' },
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
        <section
          className="flex flex-col gap-2 mt-6 [&:not(:last-child)]:border-b-4 border-blog-blue pb-4"
          key={category.id}
        >
          <div className="flex items-center justify-between">
            <p>Latest {category.name} news</p>
            <Link href={`/posts?categories=[${category.id}]`}>
              <button className="button-primary">More</button>
            </Link>
          </div>
          <div className="flex items-start gap-8">
            {category.post_categories.map((post) => (
              <Link
                href={`post/${post.posts_id}`}
                className="relative flex flex-col gap-2 items-start justify-center w-[400px] cursor-pointer"
                key={`${post.categories_id}-${post.posts_id}`}
              >
                <img
                  src={post.posts.cover_image || ''}
                  alt=""
                  className=" h-[250px] w-full object-cover"
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
