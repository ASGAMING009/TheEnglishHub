import { useState, useEffect } from 'react';
import { Film, Brain, BookOpen, Users } from 'lucide-react';
import Home from './pages/Home';
import ClubPage from './pages/ClubPage';
import Login from './pages/Login';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn) {
      setIsLoggedIn(true);
      setCurrentPage('home');
    }
  }, []);

  const clubs = [
    {
      id: 'cine-club',
      name: 'Cine Club',
      icon: Film,
    },
    {
      id: 'quiz-club',
      name: 'Quiz Club',
      icon: Brain,
    },
    {
      id: 'wall-magazine',
      name: 'Wall Magazine',
      icon: BookOpen,
    },
    {
      id: 'reading-club',
      name: 'Reading Club',
      icon: Users,
    },
  ];

  const handleClubClick = (clubId: string, clubName: string) => {
    setSelectedClub(clubId);
    setCurrentPage('club');
  };

  const handleBackHome = () => {
    setCurrentPage('home');
    setSelectedClub(null);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(https://images.pexels.com/photos/5427881/pexels-photo-5427881.jpeg?auto=compress&cs=tinysrgb&w=1600)',
      }}
    >
      <div className="min-h-screen bg-black/40">
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : currentPage === 'home' ? (
          <Home clubs={clubs} onClubClick={handleClubClick} onLogout={handleLogout} />
        ) : (
          <ClubPage clubId={selectedClub} onBack={handleBackHome} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

export default App;
