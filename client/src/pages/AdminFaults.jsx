import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Modal from '../components/Modal';
import API from '../services/api';

const AdminFaults = () => {
  const [faults, setFaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFault, setSelectedFault] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [status, setStatus] = useState('Pending');
  const [assignedEngineer, setAssignedEngineer] = useState('');
  const [repairTime, setRepairTime] = useState('');
  const [remarks, setRemarks] = useState('');

  const fetchFaults = async () => {
    try {
      const { data } = await API.get('/faults');
      setFaults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaults();
  }, []);

  const openUpdateModal = (fault) => {
    setSelectedFault(fault);
    setStatus(fault.status);
    setAssignedEngineer(fault.assignedEngineer || '');
    setRepairTime(fault.repairTime || '');
    setRemarks(fault.remarks || '');
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/faults/${selectedFault._id}`, {
        status,
        assignedEngineer,
        repairTime,
        remarks,
      });
      setIsModalOpen(false);
      fetchFaults();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint record?')) {
      try {
        await API.delete(`/faults/${id}`);
        fetchFaults();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fault Complaint Management</h1>
          <p className="text-slate-500 text-sm">Assign engineers, update repair timelines, and resolve issues.</p>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Title & Location</th>
                  <th className="px-4 py-3">Reporter</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Engineer</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faults.map((f) => (
                  <tr key={f._id}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-sky-700">{f.complaintId}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{f.title}</div>
                      <div className="text-xs text-slate-400">
                        {f.village} - {f.exactLocation}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div>{f.reporter?.name}</div>
                      <div className="text-slate-400">{f.reporter?.mobileNumber}</div>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold">{f.severity}</td>
                    <td className="px-4 py-3 text-xs font-semibold">{f.status}</td>
                    <td className="px-4 py-3 text-xs">{f.assignedEngineer || 'Unassigned'}</td>
                    <td className="px-4 py-3 text-xs space-x-2">
                      <button
                        onClick={() => openUpdateModal(f)}
                        className="bg-sky-50 text-sky-700 hover:bg-sky-100 px-2.5 py-1 rounded font-semibold"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(f._id)}
                        className="bg-red-50 text-red-700 hover:bg-red-100 px-2.5 py-1 rounded font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for Updates */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Fault Complaint">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Engineer / Field Staff</label>
              <input
                type="text"
                value={assignedEngineer}
                onChange={(e) => setAssignedEngineer(e.target.value)}
                placeholder="e.g. Eng. Vikram Sharma"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Repair Completion</label>
              <input
                type="text"
                value={repairTime}
                onChange={(e) => setRepairTime(e.target.value)}
                placeholder="e.g. Today by 6:00 PM"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks</label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Notes regarding work status..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg text-sm"
            >
              Save Changes
            </button>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AdminFaults;