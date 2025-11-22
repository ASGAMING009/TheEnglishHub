import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ImageUploadForm from '../components/ImageUploadForm';

interface ClubPageProps {
  clubId: string | null;
  onBack: () => void;
}

const clubInfo: Record<string, { name: string; description: string }> = {
  'cine-club': {
    name: 'Cine Club',
    description: 'Explore the world of cinema with our Cine Club. We celebrate the art of filmmaking, organize movie screenings, discussions, and creative workshops to foster a passion for visual storytelling among students.',
  },
  'quiz-club': {
    name: 'Quiz Club',
    description: 'Challenge your mind with our Quiz Club. We organize engaging quizzes, competitions, and knowledge-sharing sessions to promote intellectual growth and healthy competition among participants.',
  },
  'wall-magazine': {
    name: 'Wall Magazine',
    description: 'Stay updated with our Wall Magazine. This platform showcases creative writings, articles, and artistic contributions from students, providing a space for expression and recognition of talent.',
  },
  'reading-session': {
    name: 'Reading Session',
    description: 'Join our Reading Sessions and dive into the world of literature. We organize interactive reading events, book discussions, and literary appreciation sessions to cultivate a reading culture.',
  },
};

interface Activity {
  id: string;
  image_url: string;
  description: string;
  created_at: string;
}

export default function ClubPage({ clubId, onBack }: ClubPageProps) {
  const club = clubId ? clubInfo[clubId] : null;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (clubId) {
      loadActivities();
    }
  }, [clubId]);

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('club_activities')
        .select('id, image_url, description, created_at')
        .eq('club_id', clubId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!club) {
    return <div>Club not found</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="relative">
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <img
            src="/image.png"
            alt="Logo"
            className="h-20 md:h-24 w-auto"
          />
        </div>
        <button
          onClick={onBack}
          className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-all duration-300 hover:bg-blue-700 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Back</span>
        </button>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 text-center mt-8 drop-shadow-lg">
            {club.name}
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
              {club.description}
            </p>
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-slate-800">Activities</h2>
              <ImageUploadForm clubId={clubId} onSuccess={loadActivities} />
            </div>

            {isLoading ? (
              <p className="text-slate-600 text-lg">Loading activities...</p>
            ) : activities.length === 0 ? (
              <p className="text-slate-600 text-lg">No activities posted yet. Be the first to share!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity) => (
                  <div key={activity.id} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <img src={activity.image_url} alt="Activity" className="w-full h-48 object-cover" />
                    {activity.description && (
                      <div className="p-4">
                        <p className="text-slate-700 text-sm">{activity.description}</p>
                      </div>
                    )}
                    <div className="px-4 pb-4">
                      <p className="text-xs text-slate-500">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
