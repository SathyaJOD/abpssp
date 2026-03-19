import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Calendar, 
  MapPin, 
  Loader2, 
  CheckCircle,
  Flag,
  ShieldCheck,
  HeartPulse,
  GraduationCap,
  LifeBuoy,
  Tractor,
  Users,
  Star
} from 'lucide-react';
import { format } from 'date-fns';

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const activities = [
    {
      title: "National & Patriotic Events",
      icon: <Flag className="h-6 w-6 text-[#ea580c]" />,
      items: [
        "Celebration of Kargil Vijay Diwas",
        "Observance of Netaji Subhas Chandra Bose Jayanti",
        "Independence Day & Republic Day programs",
        "Tribute ceremonies for martyrs and war heroes"
      ]
    },
    {
      title: "Veteran Welfare Programs",
      icon: <ShieldCheck className="h-6 w-6 text-[#1e3a8a]" />,
      items: [
        "Support programs for ex-servicemen and their families",
        "Assistance for war widows and dependents",
        "Pension guidance and welfare awareness camps"
      ]
    },
    {
      title: "Medical & Health Camps",
      icon: <HeartPulse className="h-6 w-6 text-[#2f5a28]" />,
      items: [
        "Free health check-up camps in rural areas",
        "Awareness programs on hygiene and sanitation",
        "Blood donation drives and emergency medical support"
      ]
    },
    {
      title: "Youth Motivation & Training",
      icon: <GraduationCap className="h-6 w-6 text-[#ea580c]" />,
      items: [
        "Career guidance and motivational seminars for youth",
        "Personality development and leadership training",
        "Awareness sessions on joining Armed Forces"
      ]
    },
    {
      title: "Disaster Relief & Rescue Activities",
      icon: <LifeBuoy className="h-6 w-6 text-[#1e3a8a]" />,
      items: [
        "Participation in relief operations during floods, cyclones, and emergencies",
        "Distribution of food, medicines, and essential supplies",
        "Rehabilitation support for affected communities"
      ]
    },
    {
      title: "Social Service & Community Development",
      icon: <Tractor className="h-6 w-6 text-[#2f5a28]" />,
      items: [
        "Rural development initiatives",
        "Cleanliness drives and environmental programs",
        "Support for education and underprivileged communities"
      ]
    },
    {
      title: "Meetings & Organizational Events",
      icon: <Users className="h-6 w-6 text-[#ea580c]" />,
      items: [
        "State, district, and unit-level meetings",
        "Training sessions for members and office bearers",
        "Annual gatherings and coordination meetings"
      ]
    },
    {
      title: "Special Programs",
      icon: <Star className="h-6 w-6 text-[#1e3a8a]" />,
      items: [
        "Sainik Sammelan (veterans meet)",
        "Awareness rallies and public engagement activities",
        "Cultural and patriotic events"
      ]
    }
  ];

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
          <Calendar className="mx-auto h-12 w-12 text-[#1e3a8a] mb-4" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Activities & Initiatives</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            The <strong>Akhil Bharatiya Poorva Sainik Seva Parishad (ABPSSP)</strong> actively organizes a wide range of events and programs aimed at serving society, supporting veterans, and promoting patriotism.
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {activities.map((activity, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                <div className="bg-slate-50 p-2 rounded-lg">
                  {activity.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{activity.title}</h3>
              </div>
              <ul className="space-y-3">
                {activity.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Our Approach */}
        <div className="bg-gradient-to-r from-[#2f5a28] to-[#4d8045] rounded-2xl shadow-xl overflow-hidden border border-green-800 p-10 text-center mb-16">
          <Star className="h-12 w-12 text-[#facc15] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Our Approach</h2>
          <p className="text-green-100 text-xl max-w-4xl mx-auto leading-relaxed">
            Every event and program conducted by ABPSSP reflects the values of <strong>Service (Seva), Courage (Sahas), and Respect (Samman)</strong>, ensuring continued contribution to society and the nation.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
          </div>
        ) : events.length > 0 && (
          <>
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Latest Updates & Events</h3>
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
          </>
        )}
      </div>
    </div>
  );
}
