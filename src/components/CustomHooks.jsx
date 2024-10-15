import { useNavigate } from 'react-router-dom';

//navigation hook
const useCustomNavigate = () => {
  const navigate = useNavigate();

  const customNavigate = (path, options = {}) => {
    navigate(path, options);
  };
  return customNavigate;
};

export default useCustomNavigate;