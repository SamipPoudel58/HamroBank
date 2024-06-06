import FormWrapper from '@/components/forms/form-wrapper';
import Input from '@/components/forms/input';
import ImageUpload from '@/components/image-upload';
import { useRegisterUser } from '@/hooks/use-register-user';
import { RegistrationPayload } from '@/models/user';
import { useUserStore } from '@/store/user-store';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const RegisterPage = () => {
  const [signatureImg, setSignatureImg] = useState<File | null>(null);
  const router = useRouter();

  const { mutate: registerUser, isPending, isError } = useRegisterUser();
  const setLoginDetails = useUserStore((state) => state.setLoginDetails);
  const loginDetails = useUserStore((state) => state.loginDetails);

  const submitHandler = (data: RegistrationPayload) => {
    const formData: any = new FormData();
    formData.append('name', data.name);
    formData.append('phone', data.phone);
    formData.append('password', data.password);
    formData.append('signImg', signatureImg);

    registerUser(formData, {
      onSuccess: (user) => {
        console.log(user);
        setLoginDetails(user);
        router.push('/my-account');
      },
    });
  };

  useEffect(() => {
    if (loginDetails) {
      if (loginDetails.isAdmin) {
        router.push('/verify');
      } else {
        router.push('/my-account');
      }
    }
  }, [loginDetails, router]);

  return (
    <div>
      <div className="pt-8 w-[500px] mx-auto">
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">
            Create A New Account
          </h2>

          {isError && (
            <p className="font-bold bg-rose-100 py-4 px-4 text-center text-rose-600 mb-4">
              Registration Failed!
            </p>
          )}

          <FormWrapper
            showLoader={isPending}
            className="space-y-4"
            onSubmit={submitHandler}
          >
            <Input type="text" name="name" label="Full Name" />
            <Input type="phone" name="phone" label="Phone Number" />
            <Input type="password" name="password" label="Password" />

            <label className="block mb-2 text-slate-500 text-sm">
              Signature Image
            </label>
            <ImageUpload
              selectedFile={signatureImg}
              setSelectedFile={setSignatureImg}
              height="h-[200px]"
              textSize="text-sm"
            />
          </FormWrapper>
          <p className="mt-2 text-slate-500 text-center">
            Already have an account?{'  '}
            <Link className="text-amber-500 font-medium" href="/login">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
