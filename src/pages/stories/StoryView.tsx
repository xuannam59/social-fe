import { useParams } from 'react-router-dom';

const StoryView = () => {
  const { id } = useParams();
  console.log(id);
  return <div>StoryView: id</div>;
};

export default StoryView;
