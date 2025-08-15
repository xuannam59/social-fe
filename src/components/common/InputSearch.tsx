import type { InputProps } from 'antd/es/input';
import { Input } from 'antd';
import { TbSearch } from 'react-icons/tb';

interface IProps extends InputProps {
  className?: string;
}

const InputSearch = (props: IProps) => {
  const { className, ...inputProps } = props;
  return (
    <Input
      {...inputProps}
      className={`${className} !rounded-full !border-none !bg-gray-100`}
      prefix={<TbSearch size={20} className="text-gray-500" />}
    />
  );
};

export default InputSearch;
