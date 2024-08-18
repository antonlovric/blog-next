'use client';
import { updateUserProfile } from '@/app/actions/users';
import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';

interface IEditProfileInfoModal {
  profileData: {
    first_name: string;
    last_name: string;
    bio?: string;
    location?: string;
    phone_number?: string;
    email: string;
    id: number;
  };
  closeModal: () => void;
}

const EditProfileInfoModal = (props: IEditProfileInfoModal) => {
  function handleSubmit() {
    props.closeModal();
  }
  return (
    <div className="bg-dark-gray border-light-gray border rounded-md w-full px-6 py-6">
      <form
        className="flex flex-col gap-4"
        action={updateUserProfile}
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="id" value={props.profileData.id} />
        <div className="flex flex-col gap-2">
          <label htmlFor="firstName">First name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            className="bg-dark-gray rounded-md px-2 py-1 border border-light-gray"
            defaultValue={props.profileData.first_name}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="lastName">Last name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            className="bg-dark-gray rounded-md px-2 py-1 border border-light-gray"
            defaultValue={props.profileData.last_name}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="bio">Bio</label>
          <textarea
            name="bio"
            id="bio"
            className="bg-dark-gray rounded-md px-2 py-1 border border-light-gray"
            defaultValue={props.profileData.bio}
          ></textarea>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            name="location"
            id="location"
            className="bg-dark-gray rounded-md px-2 py-1 border border-light-gray"
            defaultValue={props.profileData.location}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phoneNumber">Phone number</label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            className="bg-dark-gray rounded-md px-2 py-1 border border-light-gray"
            defaultValue={props.profileData.phone_number}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="button-primary" type="submit">
            Confirm
          </button>
          <Dialog.Close className="border border-blog-blue px-3 py-2 rounded-md">
            Cancel
          </Dialog.Close>
        </div>
      </form>
    </div>
  );
};

export default EditProfileInfoModal;
