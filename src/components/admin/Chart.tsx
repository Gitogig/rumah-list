import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: any[];
  dataKey: string;
  isDarkMode: boolean;
}

const Chart: React.FC<ChartProps> = ({ data, dataKey, isDarkMode }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
        />
        <XAxis 
          dataKey="name" 
          stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
        />
        <YAxis 
          stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '8px',
            color: isDarkMode ? '#ffffff' : '#000000'
          }}
        />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke="#f59e0b" 
          strokeWidth={3}
          dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;