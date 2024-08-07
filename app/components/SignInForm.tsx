'use client';
import React, { useState } from 'react';

export interface IUserSignInForm {
  email: string;
  password: string;
}

interface ISignInForm {
  handleSignIn: (user: IUserSignInForm) => void;
  errorMessage?: string;
}

const SignInForm = ({ handleSignIn, errorMessage }: ISignInForm) => {
  const [formValues, setFormValues] = useState<IUserSignInForm>({
    email: '',
    password: '',
  });

  function handleUpdateForm(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const { value, id } = e.target;
    if (id === 'email') {
      setFormValues({ ...formValues, email: value });
    } else if (id === 'password') {
      setFormValues({ ...formValues, password: value });
    }
  }

  function submitUser() {
    handleSignIn(formValues);
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
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;
