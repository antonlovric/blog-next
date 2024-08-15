'use client';
import React, { useState } from 'react';

export interface IUserSignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface ISignUpForm {
  handleSignUp: (user: IUserSignUpForm) => Promise<void>;
}

const SignUpForm = ({ handleSignUp }: ISignUpForm) => {
  const [formValues, setFormValues] = useState<IUserSignUpForm>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  function handleUpdateForm(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const { value, id } = e.target;
    if (id === 'firstName') {
      setFormValues({ ...formValues, firstName: value });
    } else if (id === 'lastName') {
      setFormValues({ ...formValues, lastName: value });
    } else if (id === 'email') {
      setFormValues({ ...formValues, email: value });
    } else if (id === 'password') {
      setFormValues({ ...formValues, password: value });
    }
  }

  async function submitUser() {
    try {
      setIsLoading(true);
      await handleSignUp(formValues);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={submitUser} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 align-center">
        <label htmlFor="firstName">First name</label>
        <input
          onChange={handleUpdateForm}
          type="text"
          id="firstName"
          value={formValues.firstName}
          className="text-white bg-dark-gray rounded-md py-2 px-4 w-full border border-light-gray"
        />
      </div>
      <div className="flex flex-col gap-1 align-center">
        <label htmlFor="lastName">Last name</label>
        <input
          onChange={handleUpdateForm}
          type="text"
          id="lastName"
          value={formValues.lastName}
          className="text-white bg-dark-gray rounded-md py-2 px-4 w-full border border-light-gray"
        />
      </div>
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
      <button
        disabled={isLoading}
        type="submit"
        className="button-primary mt-2"
      >
        {isLoading ? 'Loading' : 'Sign up'}
      </button>
    </form>
  );
};

export default SignUpForm;
