'use server';

import { users } from '@prisma/client';
import { prisma } from '../helpers/api';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '../lib/mail';
import { IUserSignUpForm } from '../components/SignUpForm';
import { hash, verify } from 'argon2';
import { IUserSignInForm } from '../components/SignInForm';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { HASH_ALG, getSecretKey } from '../helpers/auth';
import { SignJWT } from 'jose';

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

export async function handleSignUp(values: IUserSignUpForm) {
  'use server';
  const userExist = await prisma.users.findFirst({
    where: { email: values.email },
  });
  if (!userExist) {
    return await prisma.users.create({
      data: {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        password: await hash(values.password),
      },
    });
  }
  throw new Error('User already exists');
}

export async function sendConfirmationEmail(email: string, userId: number) {
  if (!email) throw new Error('invalid email');
  await sendEmail({
    to: email,
    subject: 'Confirm your tech tales account',
    body: `<p>Hi there! Please click <a href="${process.env.NEXT_PUBLIC_BASE_URL}/confirm-email/${userId}" target="_blank">here</a> and confirm your Tech Tales account :)`,
  });
}

export async function confirmUserEmail(userId: string) {
  return await prisma.users.update({
    where: {
      id: parseInt(userId),
    },
    data: {
      confirmed_at: new Date(),
    },
  });
}

export async function handleSignIn(values: IUserSignInForm) {
  const user = await prisma.users.findFirst({
    where: { email: values.email },
  });
  if (!user) {
    throw new Error('User not found');
  }
  if (!user.confirmed_at) throw new Error('User not confirmed');
  const isValidSignIn = await verify(user.password, values.password);
  if (!isValidSignIn) {
    throw new Error('Invalid credentials');
  }
  const token = await new SignJWT({
    jti: user.email,
  })
    .setProtectedHeader({ alg: HASH_ALG })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(getSecretKey());
  cookies().set('auth', token, {
    httpOnly: true,
    sameSite: true,
    value: token,
    expires: dayjs().add(2, 'hours').toDate(),
    path: '/',
  });
  cookies().set('user', JSON.stringify(user), {
    expires: dayjs().add(2, 'hours').toDate(),
    path: '/',
    value: JSON.stringify(user),
  });

  redirect('/');
}
