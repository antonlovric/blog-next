'use server';

import { users } from '@prisma/client';
import { prisma } from '../helpers/api';
import { revalidatePath } from 'next/cache';

export async function editUser(userId: number, user: Partial<users>) {
  return prisma.users.update({
    where: { id: userId },
    data: { ...user },
  });
}

export async function saveProfileImage(
  profileImageUrl: string,
  userId?: number
) {
  try {
    if (profileImageUrl) {
      await prisma.users.update({
        where: { id: userId },
        data: { profile_image: profileImageUrl },
      });
    }
  } catch (error) {
    console.error('ERROR');
    console.error(error);
  }
}

export async function saveProfileBio(bio: string, userId?: number) {
  try {
    await prisma.users.update({ where: { id: userId }, data: { bio } });
  } catch (error) {
    console.error(error);
  }
}

export async function updateUserProfile(formData: FormData) {
  try {
    const profileInfo = {
      first_name: formData.get('firstName')?.toString(),
      last_name: formData.get('lastName')?.toString(),
      bio: formData.get('bio')?.toString(),
      location: formData.get('location')?.toString(),
      phone_number: formData.get('phoneNumber')?.toString(),
    };
    const userId = formData.get('id')?.toString();
    if (!userId)
      throw new Error('No user id provided to update profile action');
    await prisma.users.update({
      where: { id: parseInt(userId) },
      data: {
        ...profileInfo,
      },
    });
    revalidatePath(`profile/${userId}`);
  } catch (error) {
    console.error(error);
  }
}
