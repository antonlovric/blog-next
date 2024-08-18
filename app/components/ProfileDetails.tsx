'use client';

import { Prisma } from '@prisma/client';
import {
  HomeIcon,
  PersonIcon,
  EnvelopeClosedIcon,
} from '@radix-ui/react-icons';
import React, { useState, useTransition } from 'react';
import { editUser } from '../actions/users';
import { useRouter } from 'next/navigation';

interface IProfileDetails {
  profile: Prisma.usersGetPayload<{
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
        };
      };
    };
  }>;
}

const ProfileDetails = (props: IProfileDetails) => {
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editedLocation, setEditedLocation] = useState(
    props.profile.location || ''
  );
  const [isEditingPhoneNumber, setIsEditingPhoneNumber] = useState(false);
  const [editedPhoneNumber, setEditedPhoneNumber] = useState(
    props.profile.phone_number || ''
  );
  const [_, setTransition] = useTransition();
  const { refresh } = useRouter();

  async function handleBlur(field: string, value: string) {
    setTransition(async () => {
      try {
        if (
          field === 'location' &&
          value.trim() !== props.profile.location?.trim()
        ) {
          await editUser(props.profile.id, { location: value });
        } else if (
          field === 'phone_number' &&
          value.trim() !== props.profile.phone_number?.trim()
        ) {
          await editUser(props.profile.id, { phone_number: value });
        }
        refresh();
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <div className="flex items-center gap-3 mb-4">
      {props.profile.location ? (
        <>
          <div className="flex items-center gap-2">
            <HomeIcon />
            {isEditingLocation ? (
              <input
                onBlur={(e) => {
                  setIsEditingLocation(false);
                  handleBlur('location', e.target.value);
                }}
                className="bg-dark-gray px-2 py-2 rounded-md h-4"
                value={editedLocation}
                onChange={(e) => setEditedLocation(e.target.value)}
              />
            ) : (
              <p onClick={() => setIsEditingLocation(true)}>
                {props.profile.location}
              </p>
            )}
          </div>
          <div className="w-[1px] h-4 bg-white"></div>
        </>
      ) : (
        <></>
      )}
      {props.profile.phone_number ? (
        <>
          <div className="flex items-center gap-2">
            <PersonIcon />
            {isEditingPhoneNumber ? (
              <input
                onBlur={(e) => {
                  setIsEditingPhoneNumber(false);
                  handleBlur('phone_number', e.target.value);
                }}
                className="bg-dark-gray px-2 py-2 rounded-md h-4"
                value={editedPhoneNumber}
                onChange={(e) => setEditedPhoneNumber(e.target.value)}
              />
            ) : (
              <p onClick={() => setIsEditingPhoneNumber(true)}>
                {props.profile.phone_number}
              </p>
            )}
          </div>
          <div className="w-[1px] h-4 bg-white"></div>
        </>
      ) : (
        <></>
      )}
      {props.profile.email ? (
        <>
          <div className="flex items-center gap-2">
            <EnvelopeClosedIcon />
            <p>{props.profile.email}</p>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProfileDetails;
