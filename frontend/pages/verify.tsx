import FormWrapper from '@/components/forms/form-wrapper';
import Input from '@/components/forms/input';
import ImageUpload from '@/components/image-upload';
import { useVerification } from '@/hooks/use-verification';
import {
  ForgeryStatus,
  VerificationPayload,
  VerificationResult,
} from '@/models/verification';
import { useUserStore } from '@/store/user-store';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const VerifyPage = () => {
  const { mutate: verifySignature, isPending, isError } = useVerification();

  const [chequeImg, setChequeImg] = useState<File | null>(null);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);

  const user = useUserStore((state) => state.loginDetails);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        router.push('/verify');
      } else {
        router.push('/my-account');
      }
    } else {
      router.push('/register');
    }
  }, [user, router]);

  const submitHandler = (data: VerificationPayload) => {
    const formData: any = new FormData();
    formData.append('chequeImg', chequeImg);
    formData.append('accountNo', Number(data.accountNo));

    verifySignature(formData, {
      onSuccess: (result) => {
        setVerificationResult(result);
      },
    });
  };

  return (
    <div className="pt-8 bg-[#F4F9FF] min-h-screen">
      <div
        className={`${
          verificationResult ? 'max-w-[1000px]' : 'max-w-[600px]'
        }  mx-auto`}
      >
        {verificationResult ? (
          <h2 className="w-max mx-auto text-4xl font-bold text-slate-900 border-b-[6px] border-amber-400 mt-2 mb-16 text-center">
            Verification Results
          </h2>
        ) : (
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Verify Cheque Signature
          </h2>
        )}

        {verificationResult && chequeImg ? (
          <div className="flex flex-col justify-center items-center">
            <div className="w-full flex gap-x-8 mb-6">
              <div className="w-1/2">
                <h2 className="mb-4 ml-2 text-slate-900 text-sm font-medium uppercase">
                  Cheque Signature
                </h2>
                <img
                  className={`h-[300px] w-full border border-slate-300 object-fill bg-white rounded-2xl drop-shadow-[8px_-8px_8px_rgba(23,23,23,0.05)]`}
                  src={URL.createObjectURL(chequeImg)}
                  alt="cheque signature"
                />
              </div>
              <div className="w-1/2">
                <h2 className="mb-4 ml-2 text-slate-900 text-sm font-medium font-bold uppercase">
                  Original Signature
                </h2>
                <img
                  className={`h-[300px] w-full border border-slate-300 object-fill bg-white rounded-2xl drop-shadow-[8px_-8px_8px_rgba(23,23,23,0.05)]`}
                  src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${verificationResult.originalSignImg}`}
                  alt="signature"
                />
              </div>
            </div>
            <ForgeryResult
              confidence={verificationResult.confidence}
              status={verificationResult.status}
            />
          </div>
        ) : (
          <FormWrapper
            showLoader={isPending}
            className="space-y-4"
            onSubmit={submitHandler}
            buttonText="Check for Forgery"
          >
            <Input
              bgColor="bg-white shadow-[0px_8px_16px_rgba(23,23,23,0.05)] "
              type="text"
              name="accountNo"
              label="Account Number"
            />

            <label className="block mb-2 text-slate-500 text-sm">
              Cheque Signature
            </label>
            <ImageUpload
              selectedFile={chequeImg}
              setSelectedFile={setChequeImg}
            />
          </FormWrapper>
        )}
      </div>
    </div>
  );
};

const ForgeryResult = ({
  confidence,
  status,
}: {
  confidence: number;
  status: ForgeryStatus;
}) => (
  <div className="flex items-center gap-x-2 py-8">
    <div>
      {status === 'real' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.2}
          stroke="currentColor"
          className={`w-32 h-32 stroke-emerald-500`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-32 h-32 stroke-rose-600`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      )}
    </div>
    <div>
      <h3
        className={`font-bold text-2xl mb-2 ${
          status === 'real' ? 'text-emerald-500' : 'text-rose-600'
        }`}
      >
        {status && status[0].toUpperCase() + status.slice(1)} Signatures.
      </h3>
      <p className="text-slate-500 max-w-[400px]">
        With a confidence of <span className="">{confidence.toFixed(3)}%</span>,
        the AI model has predicted the provided signatures to be{' '}
        <span className="">{status === 'real' ? 'real' : 'forged'}</span>.
      </p>
    </div>
  </div>
);

export default VerifyPage;
