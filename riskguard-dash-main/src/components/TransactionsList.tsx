import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, TrendingDown, TrendingUp } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  description: string;
  status: 'FLAGGED' | 'NORMAL' | 'SUSPICIOUS';
  location?: string;
}

interface TransactionsListProps {
  accountId: string;
}

// Mock transaction data - replace with your actual data
const mockTransactions: Record<string, Transaction[]> = {
  '1': [
    {
      id: 'txn-001',
      date: '2024-01-15',
      type: 'DEPOSIT',
      amount: 50000,
      description: 'Large cash deposit',
      status: 'FLAGGED',
      location: 'Branch A'
    },
    {
      id: 'txn-002',
      date: '2024-01-14',
      type: 'TRANSFER',
      amount: 25000,
      description: 'International wire transfer',
      status: 'SUSPICIOUS',
      location: 'Online'
    },
    {
      id: 'txn-003',
      date: '2024-01-13',
      type: 'WITHDRAWAL',
      amount: 9900,
      description: 'ATM withdrawal',
      status: 'FLAGGED',
      location: 'ATM-123'
    },
    {
      id: 'txn-004',
      date: '2024-01-12',
      type: 'DEPOSIT',
      amount: 15000,
      description: 'Check deposit',
      status: 'NORMAL',
      location: 'Branch B'
    },
    {
      id: 'txn-005',
      date: '2024-01-11',
      type: 'TRANSFER',
      amount: 30000,
      description: 'Wire transfer to offshore account',
      status: 'SUSPICIOUS',
      location: 'Online'
    }
  ],
  '2': [
    {
      id: 'txn-006',
      date: '2024-01-14',
      type: 'TRANSFER',
      amount: 20000,
      description: 'International transfer',
      status: 'FLAGGED',
      location: 'Online'
    },
    {
      id: 'txn-007',
      date: '2024-01-13',
      type: 'DEPOSIT',
      amount: 12000,
      description: 'Cash deposit',
      status: 'SUSPICIOUS',
      location: 'Branch C'
    }
  ],
  '3': [
    {
      id: 'txn-008',
      date: '2024-01-13',
      type: 'TRANSFER',
      amount: 10000,
      description: 'Round number transfer',
      status: 'FLAGGED',
      location: 'Online'
    }
  ],
  '4': [
    {
      id: 'txn-009',
      date: '2024-01-16',
      type: 'DEPOSIT',
      amount: 45000,
      description: 'Structured deposit',
      status: 'SUSPICIOUS',
      location: 'Branch A'
    },
    {
      id: 'txn-010',
      date: '2024-01-15',
      type: 'TRANSFER',
      amount: 75000,
      description: 'Shell company transfer',
      status: 'FLAGGED',
      location: 'Online'
    }
  ]
};

export const TransactionsList: React.FC<TransactionsListProps> = ({ accountId }) => {
  const transactions = mockTransactions[accountId] || [];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'FLAGGED': return 'destructive';
      case 'SUSPICIOUS': return 'default';
      case 'NORMAL': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'WITHDRAWAL': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'TRANSFER': return <CreditCard className="h-4 w-4 text-blue-600" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'text-green-600';
      case 'WITHDRAWAL': return 'text-red-600';
      case 'TRANSFER': return 'text-blue-600';
      default: return 'text-foreground';
    }
  };

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Transaction History ({transactions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions found</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-full">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.date} • {transaction.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${getAmountColor(transaction.type)}`}>
                    {transaction.type === 'WITHDRAWAL' ? '-' : '+'}${transaction.amount.toLocaleString()}
                  </div>
                  <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};