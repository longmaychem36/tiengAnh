import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/common/Loading';

const skillRoutes = {
  speaking: '/speaking/options',
  listening: '/listening/lessons',
  reading: '/reading/lessons',
  writing: '/writing/lessons',
  games: '/games'
};

function SkillCourse() {
  const { type } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(skillRoutes[type] || '/courses', { replace: true });
  }, [navigate, type]);

  return <Loading />;
}

export default SkillCourse;
