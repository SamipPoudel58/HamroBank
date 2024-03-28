import { HTMLInputTypeAttribute } from 'react';
import { useFormContext } from 'react-hook-form';

const Input = ({
  name,
  label,
  type = 'text',
}: {
  name: string;
  label: string;
  type?: HTMLInputTypeAttribute;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div>
      <label className="block mb-2 text-slate-500 text-sm" htmlFor={name}>
        {label}
      </label>
      <input
        {...register(name, { required: true })}
        type={type}
        className="w-full focus:outline-amber-500 bg-gray-100 rounded p-3"
      />
      {errors[name] && (
        <p data-cy="plates-error-text" className="text-red-400 pt-2 ml-1">
          {name} cannot be empty.
        </p>
      )}
    </div>
  );
};

export default Input;
