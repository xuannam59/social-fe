import React from 'react';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  className?: string;
}

const StoryButtonCreate: React.FC<IProps> = ({
  icon,
  title,
  onClick,
  className,
  ...props
}) => {
  return (
    <>
      <div
        className={`w-full h-full rounded-lg relative group overflow-hidden cursor-pointer ${className}`}
        onClick={onClick}
        {...props}
      >
        <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
          <div className="!bg-white w-10 h-10 rounded-full flex justify-center items-center shadow-md">
            {icon}
          </div>
          <div className="text-white text-sm font-semibold">{title}</div>
        </div>
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-black/15 hidden group-hover:block" />
      </div>
    </>
  );
};

export default StoryButtonCreate;
