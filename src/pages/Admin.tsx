import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth, googleProvider } from '../firebase';
import { Shield, Users, Calendar, Image as ImageIcon, LogOut, Check, X, Loader2, Trash2 } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  const [isAdmin, setIsAdmin] = useState(false);

  // Data states
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Form states
  const [newEvent, setNewEvent] = useState({ title: '', description: '', location: '', imageUrl: '', date: '' });
  const [newGallery, setNewGallery] = useState({ title: '', imageUrl: '', date: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is admin (using the email defined in rules)
        if (currentUser.email === 'SATYASHALEM456@gmail.com' && currentUser.emailVerified) {
          setIsAdmin(true);
          fetchData('members');
        } else {
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => signOut(auth);

  const fetchData = async (tab: string) => {
    setDataLoading(true);
    try {
      if (tab === 'members') {
        const q = query(collection(db, 'members'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else if (tab === 'events') {
        const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else if (tab === 'gallery') {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (error) {
      console.error(`Error fetching ${tab}:`, error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    fetchData(tab);
  };

  // Member Actions
  const updateMemberStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'members', id), { status });
      setMembers(members.map(m => m.id === id ? { ...m, status } : m));
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Failed to update member status.');
    }
  };

  const deleteMember = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      await deleteDoc(doc(db, 'members', id));
      setMembers(members.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  // Event Actions
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventDate = new Date(newEvent.date);
      await addDoc(collection(db, 'events'), {
        ...newEvent,
        date: eventDate,
        createdAt: serverTimestamp()
      });
      setNewEvent({ title: '', description: '', location: '', imageUrl: '', date: '' });
      fetchData('events');
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event.');
    }
  };

  const deleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteDoc(doc(db, 'events', id));
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Gallery Actions
  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const photoDate = newGallery.date ? new Date(newGallery.date) : new Date();
      await addDoc(collection(db, 'gallery'), {
        ...newGallery,
        date: photoDate,
        createdAt: serverTimestamp()
      });
      setNewGallery({ title: '', imageUrl: '', date: '' });
      fetchData('gallery');
    } catch (error) {
      console.error('Error adding photo:', error);
      alert('Failed to add photo.');
    }
  };

  const deleteGalleryItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      await deleteDoc(doc(db, 'gallery', id));
      setGallery(gallery.filter(g => g.id !== id));
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100 text-center">
          <Shield className="mx-auto h-16 w-16 text-emerald-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Login Portal</h2>
          <p className="mt-2 text-sm text-slate-600">Sign in to manage ABPSSP AP content</p>
          <button
            onClick={handleLogin}
            className="mt-8 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-red-100 text-center">
          <X className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-2xl font-bold text-slate-900">Access Denied</h2>
          <p className="mt-2 text-sm text-slate-600">You do not have administrator privileges.</p>
          <button
            onClick={handleLogout}
            className="mt-8 w-full flex justify-center py-3 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-emerald-400" />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300 hidden sm:block">{user.email}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-slate-700 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('members')}
              className={`${activeTab === 'members' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
            >
              <Users className="h-5 w-5" /> Members
            </button>
            <button
              onClick={() => handleTabChange('events')}
              className={`${activeTab === 'events' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
            >
              <Calendar className="h-5 w-5" /> Events
            </button>
            <button
              onClick={() => handleTabChange('gallery')}
              className={`${activeTab === 'gallery' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
            >
              <ImageIcon className="h-5 w-5" /> Gallery
            </button>
          </nav>
        </div>

        {/* Content Area */}
        {dataLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          </div>
        ) : (
          <div>
            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-lg leading-6 font-medium text-slate-900">Membership Applications</h3>
                  <p className="mt-1 max-w-2xl text-sm text-slate-500">Review and manage member status.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name / Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {members.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">{member.name}</div>
                            <div className="text-sm text-slate-500">{member.phone}</div>
                            <div className="text-xs text-slate-400">{member.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">{member.serviceNo || '-'}</div>
                            <div className="text-sm text-slate-500">{member.rank || '-'}</div>
                            <div className="text-xs text-slate-400 font-mono mt-1">Pay: {member.paymentId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${member.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 
                                member.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {member.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {member.status === 'pending' && (
                              <>
                                <button onClick={() => updateMemberStatus(member.id, 'active')} className="text-emerald-600 hover:text-emerald-900 mr-3" title="Approve">
                                  <Check className="h-5 w-5" />
                                </button>
                                <button onClick={() => updateMemberStatus(member.id, 'rejected')} className="text-red-600 hover:text-red-900 mr-3" title="Reject">
                                  <X className="h-5 w-5" />
                                </button>
                              </>
                            )}
                            <button onClick={() => deleteMember(member.id)} className="text-slate-400 hover:text-slate-600" title="Delete">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {members.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-slate-500">No members found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-8">
                <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Add New Event</h3>
                  <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" required placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                    <input type="datetime-local" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                    <input type="text" placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                    <input type="url" placeholder="Image URL" value={newEvent.imageUrl} onChange={e => setNewEvent({...newEvent, imageUrl: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                    <textarea required placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="border border-slate-300 rounded-md p-2 md:col-span-2 focus:ring-emerald-500 focus:border-emerald-500" rows={3}></textarea>
                    <div className="md:col-span-2 flex justify-end">
                      <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors">Add Event</button>
                    </div>
                  </form>
                </div>

                <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Event</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date & Location</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {events.map((event) => (
                        <tr key={event.id}>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900">{event.title}</div>
                            <div className="text-sm text-slate-500 line-clamp-1">{event.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">{event.date ? new Date(event.date.toDate()).toLocaleDateString() : 'N/A'}</div>
                            <div className="text-sm text-slate-500">{event.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => deleteEvent(event.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5 inline" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div className="space-y-8">
                <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Add Photo to Gallery</h3>
                  <form onSubmit={handleAddGallery} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" required placeholder="Photo Title/Caption" value={newGallery.title} onChange={e => setNewGallery({...newGallery, title: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                    <input type="url" required placeholder="Image URL (https://...)" value={newGallery.imageUrl} onChange={e => setNewGallery({...newGallery, imageUrl: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                    <input type="date" value={newGallery.date} onChange={e => setNewGallery({...newGallery, date: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                    <div className="md:col-span-3 flex justify-end">
                      <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors">Add Photo</button>
                    </div>
                  </form>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {gallery.map((item) => (
                    <div key={item.id} className="relative group rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                        <p className="text-white text-sm font-medium line-clamp-2">{item.title}</p>
                        <button onClick={() => deleteGalleryItem(item.id)} className="self-end bg-red-600 text-white p-1.5 rounded-md hover:bg-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
