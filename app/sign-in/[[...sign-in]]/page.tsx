import React from 'react';
import { exo } from '@/app/layout';
import { Metadata } from 'next';
import SignInForm from '@/app/components/SignInForm';

export const metadata: Metadata = {
  title: 'Tech Tales | Sign in',
};

const SignInPage = async () => {
  return (
    <main className="grid grid-cols-3 relative h-screen">
      <div className="relative h-full col-span-1">
        <div className="absolute bg-black h-full w-full z-10 opacity-70"></div>
        <div
          className={`${exo.className} absolute top-1/2 -translate-y-1/2 text-center w-full z-20`}
        >
          <h1 className="text-6xl font-semibold">
            Join the Tech Tales Community
          </h1>
          <h2 className="text-4xl mt-4 font-extralight">
            Create your own tale
          </h2>
        </div>
        <img
          alt="People standing in a room with computers"
          src={'/auth-image.jpg'}
          className="h-full"
        />
      </div>
      <div className="flex flex-col w-1/3 gap-4 items-center justify-center col-span-2 mx-auto my-auto bg-dark-gray h-max p-6 rounded-lg">
        <img alt="" src={'/logo-no-background.svg'} className="w-full mb-4" />
        <SignInForm />
      </div>
    </main>
  );
};

export default SignInPage;
