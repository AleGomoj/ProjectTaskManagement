import { useNavigate } from 'react-router-dom';
import '../App.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <h1>TaskFlow</h1>
      <p>Organize your tasks and projects in a simple and visual way.<br></br>
        Minimalist, fast, and secure. Start now for free!</p>
      <button className="landing-btn" onClick={() => navigate('/auth')}>
        Start
      </button>
      <div style={{ marginTop: 24 }}>
      </div>
    </div>
  );
};

export default Landing;
