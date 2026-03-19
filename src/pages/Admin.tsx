import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth, googleProvider } from '../firebase';
import { Shield, Users, Calendar, LogOut, Check, X, Loader2, Trash2, Edit } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('verification');
  const [isAdmin, setIsAdmin] = useState(false);

  // Data states
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Form states
  const [newEvent, setNewEvent] = useState({ title: '', description: '', location: '', date: '' });
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [newMember, setNewMember] = useState({
    name: '', phone: '', email: '', aadharNo: '', panNo: '',
    address: '', dob: '', dateOfRetirement: '', ppoNo: '',
    defenceService: 'Army', rank: '', serviceNo: '', serviceYears: '', spouseName: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is admin (using the email defined in rules)
        if (currentUser.email?.toLowerCase() === 'satyashalem456@gmail.com' && currentUser.emailVerified) {
          setIsAdmin(true);
          fetchData('verification');
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
      if (tab === 'members' || tab === 'verification') {
        const q = query(collection(db, 'members'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else if (tab === 'events') {
        const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
  const updateMemberStatus = async (id: string, status: string, member: any) => {
    try {
      await updateDoc(doc(db, 'members', id), { status });
      setMembers(members.map(m => m.id === id ? { ...m, status } : m));
      
      if (status === 'active') {
        const loginId = `USER${Math.floor(1000 + Math.random() * 9000)}`;
        const password = Math.random().toString(36).slice(-8);
        alert(`✅ Approved!\n\nSimulated Email & SMS sent to ${member.name} (${member.phone}).\n\nLogin ID: ${loginId}\nPassword: ${password}`);
      } else if (status === 'rejected') {
        alert(`❌ Rejected.\n\nSimulated Email & SMS sent to ${member.name} regarding rejection.`);
      }
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Failed to update member status.');
    }
  };

  const deleteMember = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      const member = members.find(m => m.id === id);
      if (member && member.ppoNo) {
        await deleteDoc(doc(db, 'ppo_numbers', member.ppoNo.trim()));
      }
      await deleteDoc(doc(db, 'members', id));
      setMembers(members.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const applicationId = 'ABPSSP2026-' + Math.floor(10000 + Math.random() * 90000);
      const memberRef = await addDoc(collection(db, 'members'), {
        ...newMember,
        status: 'active',
        applicationId,
        createdAt: serverTimestamp()
      });

      if (newMember.ppoNo) {
        await updateDoc(doc(db, 'ppo_numbers', newMember.ppoNo.trim()), {
          memberId: memberRef.id,
          createdAt: serverTimestamp()
        }).catch(async () => {
          // If update fails because document doesn't exist, create it
          const { setDoc } = await import('firebase/firestore');
          await setDoc(doc(db, 'ppo_numbers', newMember.ppoNo.trim()), {
            memberId: memberRef.id,
            createdAt: serverTimestamp()
          });
        });
      }

      setNewMember({
        name: '', phone: '', email: '', aadharNo: '', panNo: '',
        address: '', dob: '', dateOfRetirement: '', ppoNo: '',
        defenceService: 'Army', rank: '', serviceNo: '', serviceYears: '', spouseName: ''
      });
      alert('Member added successfully!');
      fetchData('members');
      setActiveTab('members');
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member.');
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
      setNewEvent({ title: '', description: '', location: '', date: '' });
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

  const startEditEvent = (event: any) => {
    let formattedDate = '';
    if (event.date) {
      const d = event.date.toDate();
      formattedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }
    setEditingEvent({ ...event, date: formattedDate });
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      const eventDate = new Date(editingEvent.date);
      await updateDoc(doc(db, 'events', editingEvent.id), {
        title: editingEvent.title,
        description: editingEvent.description,
        location: editingEvent.location,
        date: eventDate
      });
      setEditingEvent(null);
      fetchData('events');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event.');
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
        <div className="border-b border-slate-200 mb-8 overflow-x-auto">
          <nav className="-mb-px flex space-x-8 min-w-max">
            <button
              onClick={() => handleTabChange('members')}
              className={`${activeTab === 'members' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
            >
              <Users className="h-5 w-5" /> Active Members
            </button>
            <button
              onClick={() => handleTabChange('add-member')}
              className={`${activeTab === 'add-member' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
            >
              <Users className="h-5 w-5" /> Add Member
            </button>
            <button
              onClick={() => handleTabChange('verification')}
              className={`${activeTab === 'verification' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
            >
              <Shield className="h-5 w-5" /> Payment Verification
            </button>
            <button
              onClick={() => handleTabChange('events')}
              className={`${activeTab === 'events' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
            >
              <Calendar className="h-5 w-5" /> Events
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
            {/* Members & Verification Tabs */}
            {(activeTab === 'members' || activeTab === 'verification') && (
              <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-lg leading-6 font-medium text-slate-900">
                    {activeTab === 'verification' ? 'Pending Payment Verifications' : 'Active Members'}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-slate-500">
                    {activeTab === 'verification' ? 'Review pending applications and verify payments.' : 'Manage approved members.'}
                  </p>
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
                      {members
                        .filter(m => activeTab === 'verification' ? m.status === 'pending' : m.status !== 'pending')
                        .map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">{member.name}</div>
                            <div className="text-sm text-slate-500">{member.phone}</div>
                            <div className="text-xs text-slate-400">{member.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">{member.serviceNo || '-'}</div>
                            <div className="text-sm text-slate-500">{member.rank || '-'}</div>
                            <div className="text-xs text-slate-400 font-mono mt-1">App ID: {member.applicationId || member.paymentId}</div>
                            {member.utrId && <div className="text-xs text-slate-500 font-mono mt-1">UTR: {member.utrId}</div>}
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
                                <button onClick={() => updateMemberStatus(member.id, 'active', member)} className="text-emerald-600 hover:text-emerald-900 mr-3" title="Approve">
                                  <Check className="h-5 w-5" />
                                </button>
                                <button onClick={() => updateMemberStatus(member.id, 'rejected', member)} className="text-red-600 hover:text-red-900 mr-3" title="Reject">
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
                      {members.filter(m => activeTab === 'verification' ? m.status === 'pending' : m.status !== 'pending').length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                            {activeTab === 'verification' ? 'No pending applications.' : 'No active members found.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Add Member Tab */}
            {activeTab === 'add-member' && (
              <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Add New Member</h3>
                <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" required placeholder="Full Name" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  <input type="email" required placeholder="Email Address" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  <input type="tel" required placeholder="Phone Number" value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  <input type="text" placeholder="Aadhar Number" value={newMember.aadharNo} onChange={e => setNewMember({...newMember, aadharNo: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  <input type="text" placeholder="PAN Number" value={newMember.panNo} onChange={e => setNewMember({...newMember, panNo: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  <input type="text" required placeholder="PPO Number" value={newMember.ppoNo} onChange={e => setNewMember({...newMember, ppoNo: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  <select required value={newMember.defenceService} onChange={e => setNewMember({...newMember, defenceService: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="Army">Army</option>
                    <option value="Navy">Navy</option>
                    <option value="Air Force">Air Force</option>
                  </select>
                  <input type="text" placeholder="Rank" value={newMember.rank} onChange={e => setNewMember({...newMember, rank: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  <input type="text" placeholder="Service Number" value={newMember.serviceNo} onChange={e => setNewMember({...newMember, serviceNo: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  <input type="text" placeholder="Service Years" value={newMember.serviceYears} onChange={e => setNewMember({...newMember, serviceYears: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  <input type="text" placeholder="Date of Birth (DD-MM-YYYY)" value={newMember.dob} onChange={e => setNewMember({...newMember, dob: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  <input type="text" placeholder="Date of Retirement (DD-MM-YYYY)" value={newMember.dateOfRetirement} onChange={e => setNewMember({...newMember, dateOfRetirement: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  <input type="text" placeholder="Spouse Name" value={newMember.spouseName} onChange={e => setNewMember({...newMember, spouseName: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  <textarea placeholder="Address" value={newMember.address} onChange={e => setNewMember({...newMember, address: e.target.value})} className="border border-slate-300 rounded-md p-2 md:col-span-2 focus:ring-emerald-500 focus:border-emerald-500" rows={3}></textarea>
                  <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors">Add Member</button>
                  </div>
                </form>
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
                    <input type="text" placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="border border-slate-300 rounded-md p-2 md:col-span-2 focus:ring-emerald-500 focus:border-emerald-500" />
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
                            <button onClick={() => startEditEvent(event)} className="text-emerald-600 hover:text-emerald-900 mr-3"><Edit className="h-5 w-5 inline" /></button>
                            <button onClick={() => deleteEvent(event.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5 inline" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="relative max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900">Edit Event</h3>
              <button onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="edit-event-form" onSubmit={handleUpdateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" required placeholder="Event Title" value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                <input type="datetime-local" required value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                <input type="text" placeholder="Location" value={editingEvent.location} onChange={e => setEditingEvent({...editingEvent, location: e.target.value})} className="border border-slate-300 rounded-md p-2 md:col-span-2 focus:ring-emerald-500 focus:border-emerald-500" />
                <textarea required placeholder="Description" value={editingEvent.description} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} className="border border-slate-300 rounded-md p-2 md:col-span-2 focus:ring-emerald-500 focus:border-emerald-500" rows={4}></textarea>
              </form>
            </div>
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end space-x-3">
              <button onClick={() => setEditingEvent(null)} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" form="edit-event-form" className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
