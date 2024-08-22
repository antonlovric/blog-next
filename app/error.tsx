'use client';
import Image from 'next/image';
import React, { useState } from 'react';

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const [isMoreShown, setIsMoreShown] = useState(false);
  function showMore() {
    setIsMoreShown(true);
  }
  return (
    <div className="w-screen h-screen grid place-items-center bg-dark-gray">
      <div className="flex flex-col gap-3">
        <Image
          src="/error.svg"
          height={500}
          width={500}
          alt="error image"
          className="h-[500px] w-[500px]"
        />
        <p className="text-center">We have unfortunately had an error! </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={showMore}
            className="bg-slate-700 px-3 py-2 rounded-md"
          >
            Show more
          </button>
          <button onClick={reset} className="bg-blog-blue px-3 py-2 rounded-md">
            Try again
          </button>
        </div>
        {isMoreShown ? (
          <div className="text-center font-semibold max-w-[450px]">
            {error.message}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Error;
