import React from 'react';

const TankCard = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600 mb-4">
      <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider">
        Site: {data.tank_id}
      </h3>
      <div className="flex justify-between items-center mt-2">
        <span className="text-3xl font-bold text-gray-800">{data.level_percent}%</span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          data.status === 'Safe' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {data.status}
        </span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
        <div 
          className="bg-blue-600 h-2 rounded-full" 
          style={{ width: `${data.level_percent}%` }}
        ></div>
      </div>
      <p className="text-gray-400 text-[10px] mt-4">Last Sync: {data.last_updated}</p>
    </div>
  );
};

export default TankCard;