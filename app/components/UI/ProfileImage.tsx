import React from 'react';

interface IProfileImage {
  imagePath?: string | null;
}

const ProfileImage = (props: IProfileImage) => {
  return props.imagePath ? (
    <img
      src={props.imagePath}
      className="rounded-full object-cover h-full w-full cursor-pointer"
      alt="profile image"
    />
  ) : (
    <div className="flex items-center justify-center rounded-full h-full w-full bg-gray-500">
      <span className="material-symbols-outlined">person</span>
    </div>
  );
};

export default ProfileImage;
