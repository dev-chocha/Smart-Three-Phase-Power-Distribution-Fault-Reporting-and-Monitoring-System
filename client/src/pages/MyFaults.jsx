import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import API from '../services/api';

const MyFaults = () => {
  const [faults, setFaults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaults = async () => {
      try {
        const { data } = await API.get('/faults/myfaults');
        setFaults(data);
      } catch (err) {
        console.error('Error fetching faults:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaults();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-amber-100 text-amber-800',
      Assigned: 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-indigo-100 text-indigo-800',
      Completed: 'bg-emerald-100 text-emerald-800',
      Rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-slate-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Fault Complaints</h1>
          <p className="text-slate-500 text-sm">Track real-time progress of reported electrical issues.</p>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        ) : faults.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            You haven't submitted any fault reports yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Complaint ID</th>
                  <th className="px-4 py-3">Title & Category</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assigned / Repair Time</th>
                  <th className="px-4 py-3">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {faults.map((fault) => (
                  <tr key={fault._id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      {fault.imageUrl ? (
                        <img
                          src={`http://localhost:5000${fault.imageUrl}`}
                          alt="Fault Attachment"
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-sky-700">
                      {fault.complaintId}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{fault.title}</div>
                      <div className="text-xs text-slate-400">{fault.category}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-slate-600">{fault.severity}</span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(fault.status)}</td>
                    <td className="px-4 py-3 text-xs">
                      <div className="font-medium text-slate-800">{fault.assignedEngineer}</div>
                      <div className="text-slate-400">{fault.repairTime}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(fault.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyFaults;