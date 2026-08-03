import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import API from '../services/api';

const AdminPowerTimetable = () => {
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [reason, setReason] = useState('');
  const [expectedRestore, setExpectedRestore] = useState('');
  const [powerMessage, setPowerMessage] = useState('');

  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [startTime, setStartTime] = useState('06:00 AM');
  const [endTime, setEndTime] = useState('10:00 AM');

  useEffect(() => {
    fetchPowerStatus();
    fetchTimetable();
  }, []);

  const fetchPowerStatus = async () => {
    const { data } = await API.get('/power-status');
    setIsPowerOn(data.isPowerOn);
    setReason(data.reason || '');
    setExpectedRestore(data.expectedRestorationTime || '');
  };

  const fetchTimetable = async () => {
    const { data } = await API.get('/timetable');
    setTimetable(data);
  };

  const handleUpdatePower = async (e) => {
    e.preventDefault();
    try {
      await API.put('/power-status', {
        isPowerOn,
        reason,
        expectedRestorationTime: expectedRestore,
      });
      setPowerMessage('Power status successfully updated!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      const existing = timetable.find((t) => t.day === selectedDay);
      const currentSlots = existing ? existing.slots : [];

      const updatedSlots = [
        ...currentSlots,
        { startTime, endTime, phaseType: 'Three Phase' },
      ];

      await API.post('/timetable', {
        day: selectedDay,
        slots: updatedSlots,
      });

      fetchTimetable();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Grid Power & Timetable Control</h1>
          <p className="text-slate-500 text-sm">Toggle regional power state and edit three-phase weekly schedules.</p>
        </div>

        {/* Grid Power Switch Box */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
            Grid Availability Switch
          </h2>

          {powerMessage && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm rounded-lg">
              {powerMessage}
            </div>
          )}

          <form onSubmit={handleUpdatePower} className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-slate-700">Main Power Feed State:</label>
              <button
                type="button"
                onClick={() => setIsPowerOn(!isPowerOn)}
                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider ${
                  isPowerOn ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {isPowerOn ? 'POWER IS ON' : 'POWER IS OFF'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Outage / Maintenance</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Substation Maintenance"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Restoration Time</label>
                <input
                  type="text"
                  value={expectedRestore}
                  onChange={(e) => setExpectedRestore(e.target.value)}
                  placeholder="e.g. Today 4:00 PM"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Update Power Status
            </button>
          </form>
        </div>

        {/* Timetable Editor Box */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
            Add/Update Three-Phase Time Slot
          </h2>

          <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Day</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="06:00 AM"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="10:00 AM"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Save Schedule Slot
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPowerTimetable;