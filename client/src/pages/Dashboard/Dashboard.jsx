import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const cachedCoords = JSON.parse(localStorage.getItem('user_coords'));

  return (
    <div className="min-h-screen bg-[#070a13] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center pb-6 border-b border-gray-900 mb-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">CORE ROUTING TERMINAL</h1>
            <p className="text-xs text-gray-500">Live Delivery Execution Hub</p>
          </div>
          <button 
            onClick={logout} 
            className="bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-semibold px-4 py-2 border border-gray-800 rounded-lg transition"
          >
            Terminate Session Connection
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{y:-2}} className="glass-card p-6 rounded-xl">
            <h3 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-2">Node Identity</h3>
            <p className="text-lg font-bold text-blue-400">{user?.phone}</p>
            <p className="text-xs text-gray-400 mt-1">ID: {user?.id || user?._id}</p>
          </motion.div>

          <motion.div whileHover={{y:-2}} className="glass-card p-6 rounded-xl">
            <h3 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-2">Target Cargo Pipeline</h3>
            <p className="text-lg font-bold text-indigo-400">{user?.lastOrderId || 'No Active Route'}</p>
            <p className="text-xs text-gray-400 mt-1">Status: Operational Stream</p>
          </motion.div>

          <motion.div whileHover={{y:-2}} className="glass-card p-6 rounded-xl">
            <h3 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-2">Geospatial Sync State</h3>
            {cachedCoords ? (
              <>
                <p className="text-sm font-mono text-emerald-400">LAT: {cachedCoords.lat.toFixed(5)}</p>
                <p className="text-sm font-mono text-emerald-400">LNG: {cachedCoords.lng.toFixed(5)}</p>
              </>
            ) : (
              <p className="text-sm text-amber-500">Telemetry Disconnected (No Location Data)</p>
            )}
          </motion.div>
        </div>

        <div className="mt-8 glass-card rounded-xl p-8 border border-dashed border-gray-800 text-center text-gray-500 text-sm">
          
          Real-time map tracking layer ready to mount to tracking stream channels.
        </div>
      </div>
    </div>
  );
}