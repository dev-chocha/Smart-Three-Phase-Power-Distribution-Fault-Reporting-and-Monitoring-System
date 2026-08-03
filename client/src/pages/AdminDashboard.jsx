import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import API from '../services/api';
import { FiUsers, FiAlertCircle, FiClock, FiCheckCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  const [faults, setFaults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaults = async () => {
      try {
        const { data } = await API.get('/faults');
        setFaults(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaults();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const total = faults.length;
  const pending = faults.filter((f) => f.status === 'Pending').length;
  const critical = faults.filter((f) => f.severity === 'Critical').length;
  const completed = faults.filter((f) => f.status === 'Completed').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Company Operations Dashboard</h1>
          <p className="text-slate-500 text-sm">System metrics and high-priority power grid faults.</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Faults</span>
              <FiUsers className="text-sky-600 w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-800 mt-2">{total}</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Pending Review</span>
              <FiClock className="text-amber-500 w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-800 mt-2">{pending}</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Critical Severity</span>
              <FiAlertCircle className="text-red-500 w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-800 mt-2">{critical}</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Resolved</span>
              <FiCheckCircle className="text-emerald-500 w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-800 mt-2">{completed}</div>
          </div>
        </div>

        {/* Recent Complaints Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Fault Reports</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">ID</th>
                  <th className="px-4 py-2.5">Title</th>
                  <th className="px-4 py-2.5">Village</th>
                  <th className="px-4 py-2.5">Severity</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faults.slice(0, 5).map((f) => (
                  <tr key={f._id}>
                    <td className="px-4 py-3 font-mono text-xs text-sky-700">{f.complaintId}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{f.title}</td>
                    <td className="px-4 py-3 text-slate-600">{f.village}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          f.severity === 'Critical'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {f.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{f.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;