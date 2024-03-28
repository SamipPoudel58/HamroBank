import { User } from '@/models/user';
import { useMutation } from '@tanstack/react-query';

const registerUser = async (regPayload: FormData): Promise<User> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/register`,
    {
      method: 'POST',
      body: regPayload,
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to register user. ${(await res.json()).message}`);
  }

  return res.json();
};

export const useRegisterUser = () => {
  return useMutation<User, Error, FormData>({ mutationFn: registerUser });
};
