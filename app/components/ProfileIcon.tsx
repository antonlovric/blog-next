'use client';

import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ExitIcon, FilePlusIcon, PersonIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { users } from '@prisma/client';
import ProfileImage from './UI/ProfileImage';

interface IProfileIcon {
  profileImage?: string;
  logout: () => void;
  user: users | null;
}

const ProfileIcon = ({ profileImage, logout, user }: IProfileIcon) => {
  const router = useRouter();
  const handleProfileClick = async () => {
    try {
      if (user) {
        router.replace(`/profile/${user.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddPost = () => {
    router.replace('/create-post');
  };
  function handleLogout() {
    logout();
  }

  const handleSelect = (e: any) => {
    switch (e.target.attributes?.itemid.value) {
      case 'profile':
        return handleProfileClick();
      case 'add-post':
        return handleAddPost();
      case 'logout':
        return handleLogout();
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div className="h-[40px] w-[40px]">
          <ProfileImage imagePath={user?.profile_image} />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mr-5 mt-1 bg-dark-gray p-2 rounded-md">
          <DropdownMenu.Arrow></DropdownMenu.Arrow>
          <DropdownMenu.Item
            className="py-2 px-1 cursor-pointer"
            onSelect={handleSelect}
            itemID="profile"
          >
            <div className="flex items-center gap-2">
              <PersonIcon />
              <p>Profile</p>
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="py-2 px-1 cursor-pointer"
            onSelect={handleSelect}
            itemID="add-post"
          >
            <div className="flex items-center gap-2">
              <FilePlusIcon />
              <p>Create Post</p>
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="py-2 px-1 cursor-pointer"
            onSelect={handleSelect}
            itemID="logout"
          >
            <div className="flex items-center gap-2">
              <ExitIcon />
              <p>Log out</p>
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default ProfileIcon;
