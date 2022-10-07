import { InfoCircle, UserPlus } from 'tabler-icons-react';

type Props = {
  text: string;
  success?: boolean;
};

function Message({ text, success }: Props) {
  if (success) {
    return (
      <div
        className="flex items-center p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
        role="alert">
        <div className="mr-3 mt-2">
          <UserPlus />
        </div>
        <div>
          <span className="font-medium">{text}</span>
        </div>
      </div>
    );
  }
  return (
    <div
      className="mt-2 items-center flex p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
      role="alert">
      <div className="mr-3 flex">
        <InfoCircle />
      </div>
      <div>
        <span className="font-medium">{text}</span> 
      </div>
    </div>
  );
}

export default Message;
