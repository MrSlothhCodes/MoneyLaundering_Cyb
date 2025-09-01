import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface AccountChartProps {
  accountId: string;
}

// Mock chart data - replace with your actual data
const mockChartData: Record<string, any[]> = {
  '1': [
    { name: 'Flagged Transactions', value: 15, fill: 'hsl(var(--destructive))' },
    { name: 'Suspicious Transactions', value: 8, fill: 'hsl(var(--warning))' },
    { name: 'Normal Transactions', value: 25, fill: 'hsl(var(--primary))' }
  ],
  '2': [
    { name: 'Flagged Transactions', value: 8, fill: 'hsl(var(--destructive))' },
    { name: 'Suspicious Transactions', value: 5, fill: 'hsl(var(--warning))' },
    { name: 'Normal Transactions', value: 18, fill: 'hsl(var(--primary))' }
  ],
  '3': [
    { name: 'Flagged Transactions', value: 3, fill: 'hsl(var(--destructive))' },
    { name: 'Suspicious Transactions', value: 2, fill: 'hsl(var(--warning))' },
    { name: 'Normal Transactions', value: 35, fill: 'hsl(var(--primary))' }
  ],
  '4': [
    { name: 'Flagged Transactions', value: 22, fill: 'hsl(var(--destructive))' },
    { name: 'Suspicious Transactions', value: 12, fill: 'hsl(var(--warning))' },
    { name: 'Normal Transactions', value: 15, fill: 'hsl(var(--primary))' }
  ]
};

const chartConfig = {
  flagged: {
    label: "Flagged",
    color: "hsl(var(--destructive))",
  },
  suspicious: {
    label: "Suspicious", 
    color: "hsl(var(--warning))",
  },
  normal: {
    label: "Normal",
    color: "hsl(var(--primary))",
  },
};

export const AccountChart: React.FC<AccountChartProps> = ({ accountId }) => {
  const data = mockChartData[accountId] || [];
  const totalTransactions = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Transaction Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="mt-4 space-y-2">
          <div className="text-center mb-3">
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <div className="text-sm text-muted-foreground">Total Transactions</div>
          </div>
          
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <div className="text-sm font-medium">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};