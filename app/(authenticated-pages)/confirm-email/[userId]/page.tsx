import { confirmUserEmail } from '@/app/actions/users';
import Image from 'next/image';
import React from 'react';

interface IConfirmEmailPage {
  params: { userId: string };
}

const ConfirmEmail = async ({ params }: IConfirmEmailPage) => {
  const confirmedEmailRes = await confirmUserEmail(params.userId);
  if (!confirmedEmailRes)
    return (
      <div className="h-full w-full flex items-center justify-center text-5xl">
        There has been an error confirming your account. Please try again later.
      </div>
    );
  return (
    <div className="h-full w-full flex items-center justify-center flex-col gap-4 text-center">
      <Image
        src="/confirmed-email.svg"
        className="h-[500px] w-[500px]"
        height={500}
        width={500}
        alt=""
      />
      <div className="max-w-[600px] text-xl font-semibold">
        Welcome to the club! Your account is now confirmed and you may proceed
        with logging into your account.
      </div>
    </div>
  );
};

export default ConfirmEmail;
