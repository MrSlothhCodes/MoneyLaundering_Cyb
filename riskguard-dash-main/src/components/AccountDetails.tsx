import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, DollarSign, MapPin, User } from 'lucide-react';
import { TransactionsList } from './TransactionsList';
import { AccountChart } from './AccountChart';

interface RiskyAccount {
  id: string;
  accountNumber: string;
  customerName: string;
  riskScore: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  transactionAmount: number;
  flaggedTransactions: number;
  lastActivity: string;
  suspiciousActivity: string[];
  customerDetails?: {
    email: string;
    phone: string;
    address: string;
    accountOpenDate: string;
  };
}

interface AccountDetailsProps {
  account: RiskyAccount;
  onBack: () => void;
}

export const AccountDetails: React.FC<AccountDetailsProps> = ({ account, onBack }) => {
  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'default';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'text-red-600';
      case 'MEDIUM': return 'text-orange-600';
      case 'LOW': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="dashboard-gradient rounded-lg p-6 text-white flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Account Details</h1>
                <p className="text-blue-100">{account.accountNumber}</p>
              </div>
              <Badge variant={getRiskBadgeVariant(account.riskLevel)} className="text-lg px-4 py-2">
                {account.riskLevel} RISK
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-lg font-semibold">{account.customerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Account Number</label>
                    <p className="font-mono">{account.accountNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p>{account.customerDetails?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p>{account.customerDetails?.phone || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {account.customerDetails?.address || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getRiskColor(account.riskLevel)}`}>
                      {account.riskScore}%
                    </div>
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">${account.transactionAmount.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{account.flaggedTransactions}</div>
                    <p className="text-sm text-muted-foreground">Flagged Transactions</p>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="text-sm font-medium text-muted-foreground">Suspicious Activities</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {account.suspiciousActivity.map((activity, index) => (
                      <Badge key={index} variant="secondary">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <TransactionsList accountId={account.id} />
          </div>

          {/* Right sidebar with chart and quick stats */}
          <div className="space-y-6">
            <AccountChart accountId={account.id} />
            
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Account Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Account Opened</span>
                  <span className="text-sm font-medium">{account.customerDetails?.accountOpenDate || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Activity</span>
                  <span className="text-sm font-medium">{account.lastActivity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <Badge variant={getRiskBadgeVariant(account.riskLevel)}>
                    {account.riskLevel}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};