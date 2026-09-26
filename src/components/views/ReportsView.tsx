import React, { useState, useMemo } from 'react';
import { FileSpreadsheet, Download, Printer, FileText, Calendar, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatCurrency, exportToCSV, exportToJSON, formatFullDate } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Badge } from '../common/Badge';

export const ReportsView: React.FC = () => {
  const { user } = useAuth();
  const { transactions, financialSummary, budgets, goals } = useData();

  const [reportType, setReportType] = useState<'monthly' | 'yearly' | 'category' | 'full'>('monthly');

  const currency = user?.defaultCurrency || 'AED';

  const reportData = useMemo(() => {
    return {
      generatedAt: new Date().toISOString(),
      user: user?.name,
      currency,
      summary: financialSummary,
      transactionCount: transactions.length,
      budgets,
      goals,
      transactions,
    };
  }, [user, currency, financialSummary, transactions, budgets, goals]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const rows = transactions.map((t) => ({
      ID: t.id,
      Date: t.date,
      Type: t.type,
      Description: t.description,
      Merchant: t.merchant || '',
      Category: t.category,
      Amount: t.amount,
      PaymentMethod: t.paymentMethod,
    }));
    exportToCSV(`SmartBudget_Report_${reportType}_${new Date().toISOString().split('T')[0]}`, rows);
  };

  const handleExportJSON = () => {
    exportToJSON(`SmartBudget_FullBackup_${new Date().toISOString().split('T')[0]}`, reportData);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white light:text-gray-900 tracking-tight">
            Financial Statements & Reports
          </h1>
          <p className="text-xs text-gray-400">Generate, print, and export audit-ready financial summaries</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
            Print Statement
          </Button>
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={handleExportJSON}>
            Backup JSON
          </Button>
        </div>
      </div>

      {/* Report Selector Controls */}
      <Card className="print:hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-gray-300">Select Report Type:</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {(['monthly', 'yearly', 'category', 'full'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl capitalize transition-colors cursor-pointer ${
                  reportType === type
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-800 light:bg-gray-100 text-gray-400 hover:text-white'
                }`}
              >
                {type} Statement
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Printable Statement Canvas */}
      <Card className="bg-gray-900 light:bg-white border border-gray-800 light:border-gray-200 p-8 sm:p-12 space-y-8 print:border-none print:shadow-none">
        {/* Statement Header */}
        <div className="flex items-center justify-between border-b border-gray-800 light:border-gray-200 pb-6">
          <div>
            <h2 className="text-2xl font-black text-white light:text-gray-900 tracking-tight">
              SmartBudget Financial Statement
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Account Holder: <strong className="text-gray-200">{user?.name}</strong> ({user?.email})
            </p>
          </div>
          <div className="text-right">
            <Badge variant="info">OFFICIAL REPORT</Badge>
            <p className="text-[11px] text-gray-400 mt-1">
              Date: {formatFullDate(new Date().toISOString())}
            </p>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-gray-950/60 light:bg-gray-50 border border-gray-800">
            <span className="text-xs text-gray-400">Total Net Balance</span>
            <p className="text-xl font-bold text-white mt-1">
              {formatCurrency(financialSummary.totalBalance, currency)}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-950/60 light:bg-gray-50 border border-gray-800">
            <span className="text-xs text-gray-400">Monthly Inflow</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              {formatCurrency(financialSummary.monthlyIncome, currency)}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-950/60 light:bg-gray-50 border border-gray-800">
            <span className="text-xs text-gray-400">Monthly Outflow</span>
            <p className="text-xl font-bold text-rose-400 mt-1">
              {formatCurrency(financialSummary.monthlyExpenses, currency)}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-950/60 light:bg-gray-50 border border-gray-800">
            <span className="text-xs text-gray-400">Total Savings</span>
            <p className="text-xl font-bold text-indigo-400 mt-1">
              {formatCurrency(financialSummary.totalSavings, currency)}
            </p>
          </div>
        </div>

        {/* Transactions Table Section */}
        <div>
          <h3 className="text-base font-extrabold text-white light:text-gray-900 mb-4">
            Transaction Breakdown ({transactions.length} Records)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-800 light:border-gray-200 text-[10px] font-bold text-gray-400 uppercase">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Method</th>
                  <th className="py-2 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40 light:divide-gray-100">
                {transactions.slice(0, 15).map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-2.5 px-3 text-gray-400">{tx.date}</td>
                    <td className="py-2.5 px-3 font-bold text-gray-200 light:text-gray-900">
                      {tx.description}
                    </td>
                    <td className="py-2.5 px-3 text-gray-400">{tx.category}</td>
                    <td className="py-2.5 px-3 text-gray-400 capitalize">{tx.paymentMethod}</td>
                    <td className="py-2.5 px-3 text-right font-bold">
                      <span className={tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}>
                        {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Audit Notice */}
        <div className="pt-6 border-t border-gray-800 light:border-gray-200 flex justify-between items-center text-[10px] text-gray-500">
          <span>Generated by SmartBudget Personal Wealth Platform</span>
          <span>Encrypted Local Storage Engine</span>
        </div>
      </Card>
    </div>
  );
};
