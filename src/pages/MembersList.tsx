import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, Loader2, TableProperties } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const STATIC_MEMBERS = [
  {
    id: "mock-1",
    serviceNo: "14451667-N",
    rank: "HAV",
    name: "C. Ramachandraiah",
    defenceService: "Army",
    dob: "01-05-1956",
    dateOfRetirement: "01-04-1994",
    serviceYears: "22 Years",
    ppoNo: "232199402463",
    spouseName: "C. Lakshmi",
    address: "H-9/5-11-13-20 Rajujla Colony, T. Sundapalli Road, Rayachoty, Kadapa, 516269",
    phone: "9701901090",
    aadharNo: "286329649388",
    panNo: "AJQPC0362A",
    status: "active"
  },
  {
    id: "mock-2",
    serviceNo: "220330-A",
    rank: "POELA",
    name: "Midde Soma Sekhara",
    defenceService: "Navy",
    dob: "24-06-1991",
    dateOfRetirement: "31-01-2024",
    serviceYears: "15 Years 4 Days",
    ppoNo: "401202400508",
    spouseName: "Midde Soma Sekhar",
    address: "H.No 6-66, Simhadripuram Post & Mandal, Kadapa Dist, 516454",
    phone: "8122895818",
    aadharNo: "646698354927",
    panNo: "AZYPM8052B",
    status: "active"
  },
  {
    id: "mock-3",
    serviceNo: "13774853-Y",
    rank: "HAV CLK",
    name: "Kamalal Ramthu Basha",
    defenceService: "Army",
    dob: "06-06-1989",
    dateOfRetirement: "30-09-2025",
    serviceYears: "16 Years",
    ppoNo: "219202500743",
    spouseName: "Shaik Fareena Begum",
    address: "H.No 11/37-3, Mahaboob Nagar Street, Badvel Road, Mydukur, Kadapa 516172",
    phone: "7086437615",
    aadharNo: "925298742994",
    panNo: "CDOPK7702F",
    status: "active"
  },
  {
    id: "mock-4",
    serviceNo: "JC-84250K",
    rank: "Nb Sub",
    name: "A.V. Prasad",
    defenceService: "-",
    dob: "01-06-1955",
    dateOfRetirement: "31-05-2012",
    serviceYears: "-",
    ppoNo: "S/010332/2012",
    spouseName: "-",
    address: "D.No 3/57, Sadiperalla, Kamalapuram Mandal, Kadapa 516289",
    phone: "9502284028",
    aadharNo: "511372711331",
    panNo: "AODPP7971C",
    status: "active"
  },
  {
    id: "mock-5",
    serviceNo: "15154923-A",
    rank: "GNR",
    name: "R. Subramanyam Raju",
    defenceService: "Army",
    dob: "06-07-1983",
    dateOfRetirement: "01-12-2018",
    serviceYears: "16 Years 9 Months 10 Days",
    ppoNo: "153201808992",
    spouseName: "K. Nagamani",
    address: "4/123, Esukapalli, M.G. Puram Post, Rajampet Mandal, Annamayya Dist 516126",
    phone: "9618380813",
    aadharNo: "861059150261",
    panNo: "AKRPR4326B",
    status: "active"
  },
  {
    id: "mock-6",
    serviceNo: "1370833-W",
    rank: "NK",
    name: "Yanam Balaiah",
    defenceService: "Army",
    dob: "10-07-1962",
    dateOfRetirement: "31-10-1999",
    serviceYears: "19 Years",
    ppoNo: "57034107799",
    spouseName: "Vagata Lasxmu",
    address: "Kothapeta, Ramapuram, Rayachoty, Annamayya Dist - 516269",
    phone: "9948817730",
    aadharNo: "249635820672",
    panNo: "AGDPV3276C",
    status: "active"
  },
  {
    id: "mock-7",
    serviceNo: "14211518-N",
    rank: "Naik",
    name: "Mukkara Reddy Mohan",
    defenceService: "Army",
    dob: "02-12-1948",
    dateOfRetirement: "1987",
    serviceYears: "17 Years",
    ppoNo: "S/017726/87",
    spouseName: "Mukkara Syamala Devi",
    address: "1/1107, Gandhi Nagar, Yerramukkopally, Cuddapah",
    phone: "9000203909",
    aadharNo: "892688612295",
    panNo: "BS2PM4595H",
    status: "active"
  },
  {
    id: "mock-8",
    serviceNo: "14904559-F",
    rank: "NKTS",
    name: "S.N. Ravindra Reddy",
    defenceService: "Army",
    dob: "01-03-1963",
    dateOfRetirement: "31-07-1999",
    serviceYears: "17 Years",
    ppoNo: "S/022587/99",
    spouseName: "S.N. Krishna Veni",
    address: "26/931-3, Mittamadi Street, Proddatur, Cuddepan - 516360",
    phone: "9908548554",
    aadharNo: "585292205376",
    panNo: "ARUPR7334K",
    status: "active"
  }
];

export default function MembersList() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [members, setMembers] = useState<any[]>(STATIC_MEMBERS);
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
        
        // Combine static mock data with real database data
        setMembers([...STATIC_MEMBERS, ...membersData]);
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
            Complete registry of Akhil Bharatiya Poorva Sainik Seva Parishad - Andhra Pradesh
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
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">{member.serviceNo || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.rank || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">{member.name || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.defenceService || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.dob || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.dateOfRetirement || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.serviceYears || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.ppoNo || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.spouseName || '-'}</td>
                    <td className="px-4 py-3 min-w-[300px] text-slate-600">{member.address || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.phone || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.aadharNo || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{member.panNo || '-'}</td>
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
