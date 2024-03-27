import Image from 'next/image';
import { Inter } from 'next/font/google';
import ImageUpload from '@/components/image-upload';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

type ForgeryStatus = 'forged' | 'real' | null;

export default function Home() {
  const [firstImage, setFirstImage] = useState<File | null>(null);
  const [secondImage, setSecondImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [forgeryStatus, setForgeryStatus] = useState<ForgeryStatus>(null);
  const [confidence, setConfidence] = useState(0);

  const submitHandler = async () => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      if (firstImage) {
        formData.append('image1', firstImage);
      }
      if (secondImage) {
        formData.append('image2', secondImage);
      }
      formData.append('accountNumber', 'abc');

      const response = await fetch('http://127.0.0.1:8000/forgery/', {
        method: 'POST',
        body: formData,
      });

      response.json().then((res) => {
        setForgeryStatus(res.status);
        setConfidence(res.confidence);
      });

      if (!response.ok) {
        throw new Error('Failed to upload files');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`bg-[#F4F9FF] min-h-screen ${inter.className}`}>
      <div className="py-12 max-w-[1000px] mx-auto flex flex-col items-center">
        <div className="w-full flex gap-x-8 mb-6">
          <div className="w-1/2">
            <h2 className="mb-4 ml-2 text-slate-900 font-bold uppercase">
              Signature 1
            </h2>
            <ImageUpload
              selectedFile={firstImage}
              setSelectedFile={setFirstImage}
            />
          </div>
          <div className="w-1/2">
            <h2 className="mb-4 ml-2 text-slate-900 font-bold uppercase">
              Signature 2
            </h2>
            <ImageUpload
              selectedFile={secondImage}
              setSelectedFile={setSecondImage}
            />
          </div>
        </div>

        {forgeryStatus ? (
          <ForgeryResult confidence={confidence} status={forgeryStatus} />
        ) : (
          <button
            onClick={submitHandler}
            className="flex justify-center items-center w-1/2 bg-amber-500 hover:shadow-lg tracking-wide text-white font-medium py-4 rounded-full"
          >
            {loading && (
              <div>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
            <span className="drop-shadow-lg">
              {loading ? 'UPLOADING...' : 'VERIFY SIGNATURES'}
            </span>
          </button>
        )}
      </div>
    </main>
  );
}

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
        With a confidence of{' '}
        <span className="font-bold">{confidence.toFixed(3)}%</span>, the AI
        model has predicated the provided signatures to be{' '}
        <span className="font-bold">
          {status === 'real' ? 'real' : 'forged'}
        </span>
        .
      </p>
    </div>
  </div>
);
