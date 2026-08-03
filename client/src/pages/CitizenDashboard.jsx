import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import API from '../services/api';
import { FiZap, FiClock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const CitizenDashboard = () => {
  const [powerStatus, setPowerStatus] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [myFaults, setMyFaults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [powerRes, timetableRes, faultsRes] = await Promise.all([
          API.get('/power-status'),
          API.get('/timetable'),
          API.get('/faults/myfaults'),
        ]);

        setPowerStatus(powerRes.data);
        setTimetable(timetableRes.data);
        setMyFaults(faultsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const pendingCount = myFaults.filter((f) => f.status !== 'Completed' && f.status !== 'Rejected').length;
  const completedCount = myFaults.filter((f) => f.status === 'Completed').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Citizen Dashboard</h1>
            <p className="text-slate-500 text-sm">Monitor electricity availability and track reported faults.</p>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Reported</span>
              <FiAlertTriangle className="text-amber-500 w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-800 mt-2">{myFaults.length}</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active / Pending</span>
              <FiClock className="text-sky-500 w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-800 mt-2">{pendingCount}</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Resolved</span>
              <FiCheckCircle className="text-emerald-500 w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-800 mt-2">{completedCount}</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Power Status</span>
              <FiZap className={powerStatus?.isPowerOn ? 'text-emerald-500 w-5 h-5' : 'text-red-500 w-5 h-5'} />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                  powerStatus?.isPowerOn ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {powerStatus?.isPowerOn ? 'POWER ON' : 'POWER OUTAGE'}
              </span>
            </div>
          </div>
        </div>

        {/* Current Power Status Notice */}
        <div
          className={`p-5 rounded-xl border ${
            powerStatus?.isPowerOn ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl ${
                powerStatus?.isPowerOn ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              <FiZap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Current Electricity Supply Status: {powerStatus?.isPowerOn ? 'Active' : 'Outage Reported'}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                <strong>Reason:</strong> {powerStatus?.reason || 'Grid Operating Normally'}
              </p>
              {!powerStatus?.isPowerOn && (
                <p className="text-sm text-slate-600 mt-0.5">
                  <strong>Expected Restoration:</strong> {powerStatus?.expectedRestorationTime}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Three-Phase Timetable */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FiClock className="text-sky-600" />
            <span>Weekly Three-Phase Power Timetable</span>
          </h2>

          {timetable.length === 0 ? (
            <p className="text-slate-500 text-sm">No schedule available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
              {timetable.map((item) => (
                <div key={item._id} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                  <span className="font-bold text-sm text-slate-800 block border-b border-slate-200 pb-1 mb-2">
                    {item.day}
                  </span>
                  <div className="space-y-1.5">
                    {item.slots.map((slot, idx) => (
                      <div key={idx} className="bg-white text-xs p-2 rounded border border-slate-200 shadow-2xs">
                        <span className="font-medium text-sky-700 block">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="text-slate-400 text-[10px]">{slot.phaseType}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CitizenDashboard;