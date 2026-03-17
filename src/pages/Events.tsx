import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Calendar, MapPin, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(
          collection(db, 'events'),
          orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Calendar className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
          <h2 className="text-3xl font-extrabold text-slate-900">Upcoming & Past Events</h2>
          <p className="mt-4 text-lg text-slate-600">
            Stay updated with our latest activities and programs.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="relative h-48 bg-slate-200">
                  {event.imageUrl ? (
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <Calendar className="h-12 w-12 opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm font-bold text-emerald-700 text-sm">
                    {event.date ? format(event.date.toDate(), 'MMM dd, yyyy') : 'TBA'}
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">{event.title}</h3>
                  
                  {event.location && (
                    <div className="flex items-start gap-2 text-slate-500 text-sm mb-4">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{event.location}</span>
                    </div>
                  )}
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {event.description}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-100 mt-auto">
                    <button className="text-emerald-600 font-medium text-sm hover:text-emerald-700 transition-colors flex items-center gap-1">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-lg">No events scheduled at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
