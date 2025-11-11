import { useState } from 'react';
import { Film, Brain, BookOpen, Users } from 'lucide-react';
import Home from './pages/Home';
import ClubPage from './pages/ClubPage';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedClub, setSelectedClub] = useState<string | null>(null);

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
      id: 'reading-session',
      name: 'Reading Session',
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

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(/image\ copy.png)',
      }}
    >
      <div className="min-h-screen bg-black/30">
        {currentPage === 'home' ? (
          <Home clubs={clubs} onClubClick={handleClubClick} />
        ) : (
          <ClubPage clubId={selectedClub} onBack={handleBackHome} />
        )}
      </div>
    </div>
  );
}

export default App;
