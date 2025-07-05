import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface LineGraphProps {
  data: number[] | { value: number; [key: string]: any }[];
  xAxisKey?: string;
  yAxisKey?: string;
  color?: string;
  name?: string;
  showGrid?: boolean;
  className?: string;
  height?: number;
}

const LineGraph: React.FC<LineGraphProps> = ({
  data,
  xAxisKey = 'index',
  yAxisKey = 'value',
  color = '#0ea5e9',
  name = 'Value',
  showGrid = true,
  className = '',
  height = 300,
}) => {
  // If data is just an array of numbers, convert it to the format required by Recharts
  const formattedData = Array.isArray(data)
  ? typeof data[0] === 'number'
    ? data.map((value, index) => ({ [xAxisKey]: index, [yAxisKey]: value }))
    : data
  : [];


  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
          <XAxis 
            dataKey={xAxisKey} 
            tick={{ fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            tick={{ fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderColor: '#e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={yAxisKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2 }}
            name={name}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;