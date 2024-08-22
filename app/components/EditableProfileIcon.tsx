'use client';
import React, { useState } from 'react';
import { uploadImage } from '../helpers/s3';
import Image from 'next/image';

interface IEditableProfileIcon {
  initialProfileIconLink: string;
  canEdit?: boolean;
  saveProfileImage: (image: string) => Promise<void>;
}

const EditableProfileIcon = ({
  initialProfileIconLink,
  canEdit,
  saveProfileImage,
}: IEditableProfileIcon) => {
  const [profileIconLink, setProfileIconLink] = useState(
    initialProfileIconLink
  );

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const image = e.target.files?.[0];
    if (image) {
      const imageUrl = await uploadImage(image);
      if (imageUrl && typeof imageUrl === 'string') {
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          setProfileIconLink(imageUrl);
          saveChange(imageUrl);
        }
      };
      reader.readAsDataURL(image);
    }
  }

  async function saveChange(imageUrl: string) {
    await saveProfileImage(imageUrl);
  }

  return (
    <>
      <input
        className="hidden"
        type="file"
        name=""
        id="profile-image"
        disabled={!canEdit}
        onChange={handleImageSelect}
        accept="image/*"
      />
      <label
        htmlFor="profile-image"
        className="relative before:absolute before:w-full before:h-full before:rounded-full top-0 left-0 before:hidden before:opacity-50 before:bg-white hover:before:flex mb-2 after:absolute after:top-0 after:left-0 after:hidden"
      >
        <Image
          height={150}
          width={150}
          className={`w-[150px] h-[150px] rounded-full object-cover  ${
            canEdit && 'cursor-pointer'
          } `}
          src={profileIconLink}
          alt="user profile image"
        />
      </label>
    </>
  );
};

export default EditableProfileIcon;
