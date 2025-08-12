import CreatePost from '../post/CreatePost';

const CenterContent = () => {
  return (
    <>
      <div className="flex flex-1 flex-col justify-start items-center gap-2">
        <CreatePost />
      </div>
    </>
  );
};

export default CenterContent;
