import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { FiUpload, FiMapPin, FiCheck } from 'react-icons/fi';

const CATEGORIES = [
  'Transformer',
  'Distribution Line',
  'Pole Damage',
  'Cable Fault',
  'Fuse Failure',
  'Meter Problem',
  'Street Light',
  'Low Voltage',
  'Power Failure',
  'Other',
];

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

const ReportFault = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');
  const [village, setVillage] = useState(user?.village || '');
  const [exactLocation, setExactLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFetchGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          setMessage('GPS Coordinates retrieved successfully!');
        },
        () => {
          setMessage('Failed to fetch location automatically.');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('severity', severity);
      formData.append('description', description);
      formData.append('village', village);
      formData.append('exactLocation', exactLocation);
      if (latitude) formData.append('latitude', latitude);
      if (longitude) formData.append('longitude', longitude);
      if (imageFile) formData.append('image', imageFile);

      await API.post('/faults', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/citizen/my-faults');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to submit fault report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Report Electrical Fault</h1>
          <p className="text-slate-500 text-sm">Fill out the details below to alert electricity grid technicians.</p>
        </div>

        {message && (
          <div className="p-3 bg-sky-50 text-sky-800 border border-sky-200 rounded-lg text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Fault Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Transformer sparking near Primary School"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none text-sm bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none text-sm bg-white"
              >
                {SEVERITIES.map((sev) => (
                  <option key={sev} value={sev}>
                    {sev}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what happened, wire conditions, hazardous risks..."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Village Name</label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Village / Neighborhood"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Exact Location / Landmark</label>
              <input
                type="text"
                required
                value={exactLocation}
                onChange={(e) => setExactLocation(e.target.value)}
                placeholder="Near Water Tank, Pole No. 42"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-slate-700">GPS Location (Optional)</label>
              <button
                type="button"
                onClick={handleFetchGPS}
                className="text-xs text-sky-600 hover:underline flex items-center gap-1 font-medium"
              >
                <FiMapPin /> Fetch GPS
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs bg-slate-50"
              />
              <input
                type="text"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Attach Photo (Optional)</label>
            <div className="border-2 border-dashed border-slate-300 p-4 text-center rounded-xl hover:bg-slate-50 transition-colors">
              <FiUpload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Submitting Report...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ReportFault;