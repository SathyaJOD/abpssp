import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, orderBy, getDoc, setDoc } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth, googleProvider } from '../firebase';
import { Shield, Users, Calendar, LogOut, Check, X, Loader2, Trash2, Edit, Image as ImageIcon, Settings, Globe, Layout } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('verification');
  const [isAdmin, setIsAdmin] = useState(false);

  // Data states
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState({
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ABPSSP-PAYMENT',
    bankName: 'State Bank of India',
    accountName: 'ABPSSP AP STATE',
    accountNo: '12345678901',
    ifscCode: 'SBIN0001234',
    branch: 'Vijayawada Main'
  });

  // Form states
  const [newEvent, setNewEvent] = useState({ title: '', imageUrl: '' });
  const [newGalleryItem, setNewGalleryItem] = useState({ title: '', imageUrl: '' });
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [newMember, setNewMember] = useState({
    name: '', phone: '', email: '', aadharNo: '', panNo: '',
    address: '', dob: '', dateOfRetirement: '', ppoNo: '',
    defenceService: 'Army', rank: '', serviceNo: '', serviceYears: '', spouseName: '',
    photoUrl: ''
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

    // Fetch payment settings initially for the login page
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'payment');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPaymentSettings(docSnap.data() as any);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();

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
      } else if (tab === 'gallery') {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else if (tab === 'settings') {
        const docRef = doc(db, 'settings', 'payment');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPaymentSettings(docSnap.data() as any);
        }
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
        defenceService: 'Army', rank: '', serviceNo: '', serviceYears: '', spouseName: '',
        photoUrl: ''
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
      await addDoc(collection(db, 'events'), {
        ...newEvent,
        createdAt: serverTimestamp()
      });
      setNewEvent({ title: '', imageUrl: '' });
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
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'gallery'), {
        ...newGalleryItem,
        createdAt: serverTimestamp()
      });
      setNewGalleryItem({ title: '', imageUrl: '' });
      alert('Gallery item added successfully!');
      fetchData('gallery');
    } catch (error) {
      console.error('Error adding gallery item:', error);
      alert('Failed to add gallery item.');
    }
  };

  const deleteGalleryItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      await deleteDoc(doc(db, 'gallery', id));
      setGallery(gallery.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting gallery item:', error);
    }
  };

  // Bulk Actions
  const deleteAllData = async (collectionName: string) => {
    const confirmation = window.prompt(`Type "DELETE ALL ${collectionName.toUpperCase()}" to confirm deleting all ${collectionName} records. THIS ACTION IS IRREVERSIBLE.`);
    if (confirmation !== `DELETE ALL ${collectionName.toUpperCase()}`) {
      alert('Confirmation failed. No records deleted.');
      return;
    }

    try {
      setDataLoading(true);
      const q = query(collection(db, collectionName));
      const snapshot = await getDocs(q);
      
      const { writeBatch } = await import('firebase/firestore');
      const batch = writeBatch(db);
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Also clear PPO numbers if deleting members
      if (collectionName === 'members') {
        const ppoSnapshot = await getDocs(collection(db, 'ppo_numbers'));
        ppoSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
      }

      await batch.commit();
      alert(`Successfully deleted all ${collectionName} records.`);
      fetchData(activeTab);
    } catch (error) {
      console.error(`Error deleting all ${collectionName}:`, error);
      alert(`Failed to delete all ${collectionName}.`);
    } finally {
      setDataLoading(false);
    }
  };

  const startEditEvent = (event: any) => {
    setEditingEvent({ ...event });
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      await updateDoc(doc(db, 'events', editingEvent.id), {
        title: editingEvent.title,
        imageUrl: editingEvent.imageUrl
      });
      setEditingEvent(null);
      fetchData('events');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event.');
    }
  };

  const handleUpdatePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'payment'), {
        ...paymentSettings,
        updatedAt: serverTimestamp()
      });
      alert('Payment settings updated successfully!');
    } catch (error) {
      console.error('Error updating payment settings:', error);
      alert('Failed to update payment settings.');
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
            <button
              onClick={() => handleTabChange('gallery')}
              className={`${activeTab === 'gallery' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
            >
              <ImageIcon className="h-5 w-5" /> Gallery
            </button>
            <button
              onClick={() => handleTabChange('settings')}
              className={`${activeTab === 'settings' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
            >
              <Settings className="h-5 w-5" /> Payment Settings
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
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {member.photoUrl ? (
                                  <img className="h-10 w-10 rounded-full object-cover border border-slate-200" src={member.photoUrl} alt="" />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                    <Users className="h-5 w-5 text-slate-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">{member.name}</div>
                                <div className="text-sm text-slate-500">{member.phone}</div>
                                <div className="text-xs text-slate-400">{member.email}</div>
                              </div>
                            </div>
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      {newMember.photoUrl ? (
                        <img src={newMember.photoUrl} alt="Preview" className="h-12 w-12 rounded-full object-cover border border-slate-200" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                          <Users className="h-6 w-6 text-slate-400" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 800000) {
                            alert('Photo size must be less than 800KB.');
                            e.target.value = '';
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewMember({ ...newMember, photoUrl: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      />
                    </div>
                  </div>
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
                    <input type="url" required placeholder="Image URL" value={newEvent.imageUrl} onChange={e => setNewEvent({...newEvent, imageUrl: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
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
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {events.map((event) => (
                        <tr key={event.id}>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900">{event.title}</div>
                            <div className="text-xs text-slate-500 truncate max-w-xs">{event.imageUrl}</div>
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
            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div className="space-y-8">
                <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Add Photo to Gallery</h3>
                  <form onSubmit={handleAddGalleryItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" required placeholder="Photo Title" value={newGalleryItem.title} onChange={e => setNewGalleryItem({...newGalleryItem, title: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                    <input type="url" required placeholder="Image URL (e.g., https://...)" value={newGalleryItem.imageUrl} onChange={e => setNewGalleryItem({...newGalleryItem, imageUrl: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                    <div className="md:col-span-2 flex justify-end">
                      <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors">Add Photo</button>
                    </div>
                  </form>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
                      <div className="relative h-48">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => deleteGalleryItem(item.id)} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-medium text-slate-900 mb-6">Payment Settings</h3>
                <form onSubmit={handleUpdatePaymentSettings} className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">QR Code Image</label>
                      <div className="flex flex-col sm:flex-row items-start gap-6 mb-4">
                        <div className="shrink-0">
                          {paymentSettings.qrCodeUrl ? (
                            <img src={paymentSettings.qrCodeUrl} alt="QR Preview" className="h-32 w-32 object-contain border border-slate-200 rounded-lg bg-slate-50 p-2" />
                          ) : (
                            <div className="h-32 w-32 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 text-sm text-center p-2">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 w-full space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Upload Image File</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 800000) {
                                  alert('Image size must be less than 800KB. Please choose a smaller image.');
                                  e.target.value = ''; // Reset input
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setPaymentSettings({ ...paymentSettings, qrCodeUrl: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            />
                            <p className="mt-1 text-xs text-slate-500">Max size: 800KB. Formats: JPG, PNG, WEBP.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                        <input 
                          type="text" 
                          required 
                          value={paymentSettings.bankName} 
                          onChange={e => setPaymentSettings({...paymentSettings, bankName: e.target.value})} 
                          className="w-full border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Account Name</label>
                        <input 
                          type="text" 
                          required 
                          value={paymentSettings.accountName} 
                          onChange={e => setPaymentSettings({...paymentSettings, accountName: e.target.value})} 
                          className="w-full border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                        <input 
                          type="text" 
                          required 
                          value={paymentSettings.accountNo} 
                          onChange={e => setPaymentSettings({...paymentSettings, accountNo: e.target.value})} 
                          className="w-full border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code</label>
                        <input 
                          type="text" 
                          required 
                          value={paymentSettings.ifscCode} 
                          onChange={e => setPaymentSettings({...paymentSettings, ifscCode: e.target.value})} 
                          className="w-full border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
                        <input 
                          type="text" 
                          required 
                          value={paymentSettings.branch} 
                          onChange={e => setPaymentSettings({...paymentSettings, branch: e.target.value})} 
                          className="w-full border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors font-medium">
                      Update Payment Details
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}
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
              <form id="edit-event-form" onSubmit={handleUpdateEvent} className="grid grid-cols-1 gap-4">
                <input type="text" required placeholder="Event Title" value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                <input type="url" required placeholder="Image URL" value={editingEvent.imageUrl} onChange={e => setEditingEvent({...editingEvent, imageUrl: e.target.value})} className="border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
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
