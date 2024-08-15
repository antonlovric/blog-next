'use client';
import React, { useState } from 'react';
import LoadingWrapper from './UI/LoadingWrapper';

export interface IUserSignInForm {
  email: string;
  password: string;
}

interface ISignInForm {
  handleSignIn: (user: IUserSignInForm) => Promise<void>;
  errorMessage?: string;
}

const SignInForm = ({ handleSignIn, errorMessage }: ISignInForm) => {
  const [formValues, setFormValues] = useState<IUserSignInForm>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  function handleUpdateForm(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const { value, id } = e.target;
    if (id === 'email') {
      setFormValues({ ...formValues, email: value });
    } else if (id === 'password') {
      setFormValues({ ...formValues, password: value });
    }
  }

  async function submitUser() {
    try {
      setIsLoading(true);
      await handleSignIn(formValues);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={submitUser} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 align-center">
        <label htmlFor="email">Email</label>
        <input
          onChange={handleUpdateForm}
          type="email"
          id="email"
          value={formValues.email}
          className="text-white bg-dark-gray rounded-md py-2 px-4 w-full border border-light-gray"
        />
      </div>
      <div className="flex flex-col gap-1 align-center">
        <label htmlFor="password">Password</label>
        <input
          onChange={handleUpdateForm}
          type="password"
          id="password"
          value={formValues.password}
          className="text-white bg-dark-gray rounded-md py-2 px-4 w-full border border-light-gray"
        />
      </div>
      {errorMessage ? 'Invalid credentials' : ''}
      <button type="submit" className="button-primary mt-2">
        <LoadingWrapper isLoading={isLoading}>Sign In</LoadingWrapper>
      </button>
    </form>
  );
};

export default SignInForm;
