import { LoginPayload, User } from '@/models/user';
import { useMutation } from '@tanstack/react-query';

const loginUser = async (loginPayload: LoginPayload): Promise<User> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/login`,
    {
      method: 'POST',
      body: JSON.stringify(loginPayload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to log user in. ${(await res.json()).message}`);
  }

  return res.json();
};

export const useLoginUser = () => {
  return useMutation<User, Error, LoginPayload>({ mutationFn: loginUser });
};
