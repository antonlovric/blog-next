import { prisma } from '@/app/helpers/api';
import React from 'react';

import PostCard from '@/app/components/PostCard';
import Link from 'next/link';
import { getActiveUser } from '@/app/helpers/auth';
import EditableProfileIcon from '@/app/components/EditableProfileIcon';
import ProfileBioEditor from '@/app/components/ProfileBioEditor';
import ProfileDetails from '@/app/components/ProfileDetails';

interface IProfilePage {
  params: { userId: string };
}

const UserProfile = async ({ params }: IProfilePage) => {
  const profile = await prisma.users.findFirst({
    where: { id: { equals: parseInt(params.userId || '') } },
    include: {
      posts: {
        include: {
          post_categories: {
            include: {
              categories: true,
              posts: {
                select: {
                  id: true,
                  cover_image: true,
                  summary: true,
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });
  const activeUser = getActiveUser();
  function getCanEdit() {
    return activeUser?.id === profile?.id;
  }
  const canEdit = getCanEdit();

  const profileImageSrc = profile?.profile_image || '/blank_profile_image.svg';

  async function saveProfileImage(profileImageUrl: string) {
    'use server';
    if (profile) {
      try {
        if (profileImageUrl) {
          const updatedProfile = await prisma.users.update({
            where: { id: profile.id },
            data: { profile_image: profileImageUrl },
          });
        }
      } catch (error) {
        console.error('ERROR');
        console.error(error);
      }
    }
  }

  async function saveProfileBio(bio: string) {
    'use server';
    if (profile) {
      try {
        await prisma.users.update({ where: { id: profile.id }, data: { bio } });
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div>
      <main className="">
        <section className="w-9/12 flex flex-col justify-center items-center mx-auto mb-8">
          <EditableProfileIcon
            initialProfileIconLink={profileImageSrc}
            canEdit={canEdit}
            saveProfileImage={saveProfileImage}
          />
          <p className="mb-4">
            {profile?.first_name} {profile?.last_name}
          </p>
          {profile && <ProfileDetails profile={profile} />}
          {!!profile ? (
            <ProfileBioEditor
              user={profile}
              updateUserBio={saveProfileBio}
              canEdit={canEdit}
            />
          ) : (
            <></>
          )}
        </section>
        <section>
          <p className="mb-3">Latest posts</p>
          <article className="grid grid-cols-auto-fill-350 autofill:250 gap-y-8 gap-x-6">
            {profile?.posts.map((post) => (
              <Link key={post.id} href={`/post/${post.id}`}>
                <PostCard isEditable={canEdit} post={post} />
              </Link>
            ))}
          </article>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
