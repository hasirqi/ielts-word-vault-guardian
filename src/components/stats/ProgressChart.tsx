
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface ProgressChartProps {
  data: Array<{
    name: string;
    learned: number;
    reviewed: number;
  }>;
  title: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data, title }) => {
  const { theme } = useTheme();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#444' : '#eee'} />
            <XAxis 
              dataKey="name" 
              stroke={theme === 'dark' ? '#aaa' : '#666'}
            />
            <YAxis stroke={theme === 'dark' ? '#aaa' : '#666'} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#333' : '#fff',
                border: `1px solid ${theme === 'dark' ? '#666' : '#ddd'}`,
                color: theme === 'dark' ? '#fff' : '#000',
              }}
            />
            <Bar dataKey="learned" name="Learned" fill="#3498db" radius={[4, 4, 0, 0]} />
            <Bar dataKey="reviewed" name="Reviewed" fill="#2ecc71" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
