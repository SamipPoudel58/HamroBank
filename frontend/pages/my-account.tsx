import { useUserStore } from '@/store/user-store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const MyAccountPage = () => {
  const loginDetails = useUserStore((state) => state.loginDetails);

  const router = useRouter();

  useEffect(() => {
    if (!loginDetails) {
      router.push('/register');
    }
  }, [loginDetails, router]);

  const summary: Record<string, any> = {
    'Account Number': '#' + loginDetails?.id,
    'Full Name': loginDetails?.name,
    'Phone Number': loginDetails?.phone,
    Address: 'Banasthali, Kathmandu',
  };

  return (
    <div className="pt-8 bg-[#F4F9FF] min-h-screen">
      <div className="max-w-[1000px] mx-auto">
        <h2 className="text-5xl text-center font-bold text-slate-900">
          Welcome {loginDetails?.name.split(' ')[0]} 👋
        </h2>
        <p className="text-center text-slate-500 max-w-[440px] mx-auto mt-4">
          Your bank account registration process is complete.
          <br />
          Here are your profile details.
        </p>

        <div className="text-white bg-amber-400 shadow-[0px_8px_16px_rgba(23,23,23,0.05)] flex justify-center items-end rounded-full h-24 w-24 px-2 overflow-hidden mx-auto mt-12 mb-2">
          <svg
            className=""
            viewBox="0 0 264 210"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M264 176.923V210H0V177.044C15.3554 156.523 35.287 139.868 58.2097 128.403C81.1324 116.938 106.414 110.979 132.044 111C185.988 111 233.904 136.894 264 176.923ZM176.022 44.9893C176.022 56.6588 171.386 67.8504 163.135 76.102C154.883 84.3536 143.692 88.9893 132.022 88.9893C120.352 88.9893 109.161 84.3536 100.909 76.102C92.6577 67.8504 88.022 56.6588 88.022 44.9893C88.022 33.3197 92.6577 22.1282 100.909 13.8766C109.161 5.62496 120.352 0.989258 132.022 0.989258C143.692 0.989258 154.883 5.62496 163.135 13.8766C171.386 22.1282 176.022 33.3197 176.022 44.9893Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="max-w-[400px] mx-auto mt-8 space-y-4">
          <div className="space-y-4">
            {Object.keys(summary).map((info, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <strong className="text-slate-900 font-medium">{info}</strong>
                <p className="text-slate-700">{summary[info]}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-900 font-medium">Uploaded Signature:</p>
          <img
            className={`h-[200px] w-full border border-slate-300 object-fill bg-white rounded-2xl drop-shadow-[8px_-8px_8px_rgba(23,23,23,0.05)]`}
            src={`${process.env.NEXT_PUBLIC_BASE_API_URL}${loginDetails?.signImg}`}
            alt="signature"
          />
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
