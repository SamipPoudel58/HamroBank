import { Dispatch, SetStateAction, useState } from 'react';

const ImageUpload = ({
  selectedFile,
  setSelectedFile,
}: {
  selectedFile: File | null;
  setSelectedFile: Dispatch<SetStateAction<any>>;
}) => {
  const [isHighlight, setIsHighlight] = useState(false);

  const handleOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    setIsHighlight(true);
  };

  const handleLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    setIsHighlight(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();

    const files = e.dataTransfer.files;

    if (files.length > 0) {
      const file = files[0];

      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setIsHighlight(false);
      } else {
        alert('Invalid file type. Please select an image file.');
      }
    }
  };

  const handleFileSelect = (event: any) => {
    const file = event.target.files[0];
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      alert('Invalid file type. Please select an image file.');
    }
  };

  return selectedFile ? (
    <img
      className="border border-slate-300 w-full h-[300px] object-fill bg-white rounded-2xl drop-shadow-[8px_-8px_8px_rgba(23,23,23,0.05)]"
      src={URL.createObjectURL(selectedFile)}
      alt="signature"
    />
  ) : (
    <div
      onDragEnter={(e) => handleOver(e)}
      onDragOver={(e) => handleOver(e)}
      onDragLeave={(e) => handleLeave(e)}
      onDrop={(e) => handleDrop(e)}
      className={`${
        isHighlight ? 'border-amber-400' : 'border-slate-200'
      } rounded-2xl p-6 h-[300px] border-2 border-dashed flex flex-col items-center justify-center`}
    >
      <div className="mb-4">
        <CloudUploadIcon classes="h-12 w-12 stroke-slate-400" />
      </div>

      <p className="text-center mb-4">
        Drag & drop or{' '}
        <label
          htmlFor="electricBillInput"
          className="text-amber-500 text-lg font-bold cursor-pointer"
        >
          Choose File
        </label>{' '}
        to upload
      </p>

      <input
        type="file"
        id="electricBillInput"
        className="hidden"
        accept="image/jpeg, image/png, image/webp, application/pdf"
        onChange={handleFileSelect}
      />
    </div>
  );
};

const CloudUploadIcon = ({ classes }: { classes: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={classes}
    width="44"
    height="44"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 18.004h-5.343c-2.572 -.004 -4.657 -2.011 -4.657 -4.487c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.38 0 2.57 .811 3.128 1.986" />
    <path d="M19 22v-6" />
    <path d="M22 19l-3 -3l-3 3" />
  </svg>
);

export default ImageUpload;
