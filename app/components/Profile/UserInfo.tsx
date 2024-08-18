'use client';
import * as Dialog from '@radix-ui/react-dialog';
import Tooltip from '../UI/Tooltip';
import React, { useState } from 'react';
import EditableProfileIcon from '../EditableProfileIcon';
import ProfileBioEditor from '../ProfileBioEditor';
import ProfileDetails from '../ProfileDetails';
import { Prisma } from '@prisma/client';
import { saveProfileImage } from '@/app/actions/users';
import EditProfileInfoModal from './EditProfileInfoModal';

interface IUserInfo {
  canEdit?: boolean;
  userProfile: Prisma.usersGetPayload<{
    select: {
      id: true;
      bio: true;
      email: true;
      first_name: true;
      last_name: true;
      location: true;
      phone_number: true;
      profile_image: true;
      posts: {
        select: {
          id: true;
          cover_image: true;
          summary: true;
          title: true;
          post_categories: {
            select: {
              categories: true;
              categories_id: true;
              posts_id: true;
            };
          };
        };
      };
    };
  }>;
}

const UserInfo = (props: IUserInfo) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  function closeModal() {
    console.log('CLOSING');

    setIsModalOpen(false);
  }
  function handleClick() {
    console.log(1);
  }
  const profileImageSrc =
    props.userProfile?.profile_image || '/blank_profile_image.svg';

  return (
    <div className="flex flex-col justify-center items-center">
      <EditableProfileIcon
        initialProfileIconLink={profileImageSrc}
        canEdit={props.canEdit}
        saveProfileImage={saveProfileImage}
      />

      <div className="flex items-center gap-3 mb-4">
        <p>
          {props.userProfile?.first_name} {props.userProfile?.last_name}
        </p>
        {props.canEdit ? (
          <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Dialog.Trigger className="bg-dark-gray border-light-gray border rounded-full flex items-center justify-center text-sm p-1">
              <Tooltip tooltipText="Edit profile">
                <span className="material-symbols-outlined !text-xs !leading-[1] w-3 h-3">
                  edit
                </span>
              </Tooltip>
            </Dialog.Trigger>
            <Dialog.Overlay
              onClick={handleClick}
              className="bg-dark-gray z-20 absolute top-0 left-0 w-screen h-screen opacity-60"
            />
            <Dialog.Portal>
              <Dialog.Content
                className="fixed z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-8/12 grid place-items-center"
                onInteractOutside={closeModal}
              >
                <Dialog.Title className="hidden">
                  Edit profile info modal
                </Dialog.Title>
                <Dialog.Description className="hidden">
                  Modal used to edit profile data
                </Dialog.Description>
                <EditProfileInfoModal
                  profileData={{
                    email: props.userProfile.email,
                    first_name: props.userProfile.first_name || '',
                    last_name: props.userProfile.last_name || '',
                    bio: props.userProfile.bio || '',
                    location: props.userProfile.location || '',
                    phone_number: props.userProfile.phone_number || '',
                    id: props.userProfile.id,
                  }}
                  closeModal={closeModal}
                />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        ) : (
          <></>
        )}
      </div>
      {props.userProfile && <ProfileDetails profile={props.userProfile} />}
      <div className="flex flex-col gap-3 w-full">
        <div className="border-b border-b-light-gray pb-1">About me</div>
        <div>{props.userProfile.bio}</div>
      </div>
    </div>
  );
};

export default UserInfo;
