import { LucideIcon, LogOut } from 'lucide-react';

interface Club {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface HomeProps {
  clubs: Club[];
  onClubClick: (clubId: string, clubName: string) => void;
  onLogout: () => void;
}

export default function Home({ clubs, onClubClick, onLogout }: HomeProps) {
  return (
    <div>
      <div className="relative">
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <img
            src="/image.png"
            alt="Logo"
            className="h-20 md:h-24 w-auto"
          />
        </div>
        <button
          onClick={onLogout}
          className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-all duration-300 hover:bg-red-700 active:scale-95"
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            The English Hub
          </h1>
          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            This is the website for all the clubs from Department of English, to review all the activities made by the students of English department.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {clubs.map((club) => {
            const IconComponent = club.icon;
            return (
              <button
                key={club.id}
                onClick={() => onClubClick(club.id, club.name)}
                className="group relative overflow-hidden rounded-lg bg-white p-8 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
                <div className="relative flex flex-col items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-4 transition-colors duration-300 group-hover:bg-blue-200">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 transition-colors duration-300 group-hover:text-blue-600">
                    {club.name}
                  </h3>
                  <div className="h-1 w-12 bg-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
