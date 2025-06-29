
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WeightEntry } from '@/types/weight';
import { format } from 'date-fns';
import { TrendingDown } from 'lucide-react';

interface WeightChartProps {
  entries: WeightEntry[];
  startWeight: number;
}

const WeightChart = ({ entries, startWeight }: WeightChartProps) => {
  const chartData = entries
    .slice()
    .reverse()
    .map(entry => ({
      date: format(new Date(entry.entry_date), 'MMM dd'),
      weight: entry.weight,
      weightLost: startWeight - entry.weight
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingDown className="h-5 w-5 mr-2 text-green-600" />
          Weight Progress Chart
        </CardTitle>
        <CardDescription>
          Track your weight loss journey over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']}
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold">{label}</p>
                        <p className="text-blue-600">
                          Weight: {data.weight} kg
                        </p>
                        <p className="text-green-600">
                          Lost: {data.weightLost.toFixed(1)} kg
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightChart;
