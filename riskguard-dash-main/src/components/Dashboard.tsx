import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, AlertTriangle, Shield, TrendingUp, Users } from 'lucide-react';
import { AccountDetails } from './AccountDetails';

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

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('ALL');
  const [selectedAccount, setSelectedAccount] = useState<RiskyAccount | null>(null);
  const [accounts, setAccounts] = useState<RiskyAccount[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Load CSV data on component mount
  useEffect(() => {
    const loadCsvData = async () => {
      try {
        setDataLoading(true);
        setDataError(null);

        const response = await fetch('/fan_pattern_results_combined.csv');

        if (!response.ok) {
          throw new Error(`Failed to fetch CSV file: ${response.statusText}`);
        }

        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              const parsed: RiskyAccount[] = (results.data as any[]).map((row, idx) => {
                // Map Risk_Level to dashboard's riskLevel
                let riskLevelRaw = (row.Risk_Level || '').toUpperCase();
                let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
                if (riskLevelRaw === 'CRITICAL' || riskLevelRaw === 'HIGH') riskLevel = 'HIGH';
                else if (riskLevelRaw === 'MEDIUM') riskLevel = 'MEDIUM';
                else if (riskLevelRaw === 'LOW') riskLevel = 'LOW';

                // Combine pattern info as suspiciousActivity
                const suspiciousActivity: string[] = [];
                if (row.Pattern_Type) suspiciousActivity.push(`Pattern: ${row.Pattern_Type}`);
                if (row.Fan_Degree) suspiciousActivity.push(`Fan Degree: ${row.Fan_Degree}`);
                if (row.Connection_Type) suspiciousActivity.push(`Connection: ${row.Connection_Type}`);
                if (row.Unique_Currencies) suspiciousActivity.push(`Currencies: ${row.Unique_Currencies}`);
                if (row.Time_Span_Days) suspiciousActivity.push(`Days: ${row.Time_Span_Days}`);
                if (row.Amount_Range_Ratio) suspiciousActivity.push(`Amt Range Ratio: ${row.Amount_Range_Ratio}`);
                if (row.Temporal_Clustering) suspiciousActivity.push(`Temporal Clustering: ${row.Temporal_Clustering}`);

                return {
                  id: row.Account || String(idx + 1),
                  accountNumber: row.Account || `ACC-${String(idx + 1).padStart(4, '0')}`,
                  customerName: row.Customer_Name || `Customer ${idx + 1}`, // Added fallback customer name
                  riskScore: Number(row.Risk_Score) || 0,
                  riskLevel,
                  transactionAmount: Number(row.Total_Amount) || 0,
                  flaggedTransactions: Number(row.Transaction_Count) || 0,
                  lastActivity: row.Last_Activity || new Date().toISOString().split('T')[0], // Added fallback date
                  suspiciousActivity,
                  customerDetails: undefined
                };
              });
              setAccounts(parsed);
              setDataLoading(false);
            } catch (err) {
              setDataError('Failed to parse CSV data. Please check the file format.');
              setDataLoading(false);
            }
          },
          error: (error) => {
            setDataError(`Failed to parse CSV file: ${error.message}`);
            setDataLoading(false);
          }
        });
      } catch (err) {
        setDataError(`Failed to load CSV file: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setDataLoading(false);
      }
    };

    loadCsvData();
  }, []);

  // Fallback mock data if CSV loading fails
  const mockData: RiskyAccount[] = [
    {
      id: '1',
      accountNumber: 'ACC-2024-001',
      customerName: 'John Smith',
      riskScore: 87,
      riskLevel: 'HIGH' as 'HIGH',
      transactionAmount: 250000,
      flaggedTransactions: 15,
      lastActivity: '2024-01-15',
      suspiciousActivity: ['Large cash deposits', 'Frequent international transfers'],
      customerDetails: {
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        address: '123 Main St, New York, NY 10001',
        accountOpenDate: '2020-05-15'
      }
    },
    {
      id: '2',
      accountNumber: 'ACC-2024-002',
      customerName: 'Maria Garcia',
      riskScore: 65,
      riskLevel: 'MEDIUM' as 'MEDIUM',
      transactionAmount: 120000,
      flaggedTransactions: 8,
      lastActivity: '2024-01-14',
      suspiciousActivity: ['Unusual transaction patterns', 'High-risk jurisdictions'],
      customerDetails: {
        email: 'maria.garcia@email.com',
        phone: '+1-555-0124',
        address: '456 Oak Ave, Los Angeles, CA 90210',
        accountOpenDate: '2019-08-22'
      }
    },
    {
      id: '3',
      accountNumber: 'ACC-2024-003',
      customerName: 'David Johnson',
      riskScore: 42,
      riskLevel: 'LOW' as 'LOW',
      transactionAmount: 75000,
      flaggedTransactions: 3,
      lastActivity: '2024-01-13',
      suspiciousActivity: ['Round number transactions'],
      customerDetails: {
        email: 'david.johnson@email.com',
        phone: '+1-555-0125',
        address: '789 Pine St, Chicago, IL 60601',
        accountOpenDate: '2021-03-10'
      }
    },
    {
      id: '4',
      accountNumber: 'ACC-2024-004',
      customerName: 'Sarah Wilson',
      riskScore: 91,
      riskLevel: 'HIGH' as 'HIGH',
      transactionAmount: 380000,
      flaggedTransactions: 22,
      lastActivity: '2024-01-16',
      suspiciousActivity: ['Structuring', 'Shell company connections', 'PEP connections'],
      customerDetails: {
        email: 'sarah.wilson@email.com',
        phone: '+1-555-0126',
        address: '321 Elm St, Miami, FL 33101',
        accountOpenDate: '2018-11-05'
      }
    }
  ];

  // Use loaded CSV data if available, else fallback to mock data
  const dataToUse = accounts.length > 0 ? accounts : mockData;

  const filteredAccounts = dataToUse.filter(account => {
    const matchesSearch = account.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = selectedRiskLevel === 'ALL' || account.riskLevel === selectedRiskLevel;
    return matchesSearch && matchesRisk;
  });

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

  const totalAccounts = dataToUse.length;
  const highRiskAccounts = dataToUse.filter(a => a.riskLevel === 'HIGH').length;
  const totalFlaggedTransactions = dataToUse.reduce((sum, a) => sum + a.flaggedTransactions, 0);
  const totalSuspiciousAmount = dataToUse.reduce((sum, a) => sum + a.transactionAmount, 0);

  if (selectedAccount) {
    return <AccountDetails account={selectedAccount} onBack={() => setSelectedAccount(null)} />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="dashboard-gradient rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Money Laundering Detection Dashboard</h1>
          <p className="text-blue-100">Monitor and analyze potentially risky financial accounts</p>
        </div>

        {/* Data Loading Status */}
        {dataLoading && (
          <Card className="card-shadow">
            <CardContent className="py-6">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">Loading data from fan_pattern_results_combined.csv...</div>
                <div className="text-sm text-muted-foreground">Please wait while we load the account data.</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Error Status */}
        {dataError && (
          <Card className="card-shadow border-red-200">
            <CardContent className="py-6">
              <div className="text-center">
                <div className="text-lg font-medium mb-2 text-red-600">Error Loading Data</div>
                <div className="text-sm text-red-500 mb-2">{dataError}</div>
                <div className="text-sm text-muted-foreground">Using fallback mock data for demonstration.</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-shadow hover:card-shadow-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Risky Accounts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAccounts}</div>
              <p className="text-xs text-muted-foreground">Flagged for review</p>
            </CardContent>
          </Card>

          <Card className="card-shadow hover:card-shadow-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Accounts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{highRiskAccounts}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card className="card-shadow hover:card-shadow-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged Transactions</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFlaggedTransactions}</div>
              <p className="text-xs text-muted-foreground">Suspicious activities detected</p>
            </CardContent>
          </Card>

          <Card className="card-shadow hover:card-shadow-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount at Risk</CardTitle>
              <Shield className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSuspiciousAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Under investigation</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Risk Account Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or account number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((level) => (
                  <Button
                    key={level}
                    variant={selectedRiskLevel === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedRiskLevel(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            {/* Accounts Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Account</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Risk Level</th>
                    <th className="text-left py-3 px-4 font-medium">Risk Score</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Flagged Txns</th>
                    <th className="text-left py-3 px-4 font-medium">Last Activity</th>
                    <th className="text-left py-3 px-4 font-medium">Suspicious Activities</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account) => (
                    <tr 
                      key={account.id} 
                      className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedAccount(account)}
                    >
                      <td className="py-3 px-4 font-mono text-sm">{account.accountNumber}</td>
                      <td className="py-3 px-4 font-medium">{account.customerName}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getRiskBadgeVariant(account.riskLevel)}>
                          {account.riskLevel}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${getRiskColor(account.riskLevel)}`}>
                          {account.riskScore}%
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ${account.transactionAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline">{account.flaggedTransactions}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {account.lastActivity}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {account.suspiciousActivity.slice(0, 2).map((activity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                          {account.suspiciousActivity.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{account.suspiciousActivity.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;