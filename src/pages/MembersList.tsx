import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, Loader2, TableProperties } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function MembersList() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const q = query(
          collection(db, 'members'),
          where('status', '==', 'active'),
          orderBy('name')
        );
        const querySnapshot = await getDocs(q);
        const membersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member => 
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.serviceNo && member.serviceNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (member.phone && member.phone.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <TableProperties className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
          <h2 className="text-3xl font-extrabold text-slate-900">Members Directory</h2>
          <p className="mt-4 text-lg text-slate-600">
            Complete registry of ABPSSP AP STATE (ABPSSP)
          </p>
        </div>

        <div className="mb-8 max-w-md mx-auto">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md p-3 border bg-white"
              placeholder="Search by name, service no, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
          </div>
        ) : filteredMembers.length > 0 ? (
          <div className="overflow-x-auto bg-white shadow-sm rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Service No</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Rank</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Defence Service</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">DoB</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Retirement</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Service</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">PPO No</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Spouse Name</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Address</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Mobile</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Aadhar No</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">PAN No</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">{member.serviceNo ? '***' : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.rank || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">{member.name || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.defenceService || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.dob ? '***' : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.dateOfRetirement ? '***' : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.serviceYears ? '***' : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.ppoNo ? '***' : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.spouseName ? '***' : '-'}</td>
                    <td className="px-4 py-3 min-w-[300px] text-slate-600">{member.address ? '***' : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.phone ? '***' : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.aadharNo ? '***' : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.panNo ? '***' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-lg">No active members found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
