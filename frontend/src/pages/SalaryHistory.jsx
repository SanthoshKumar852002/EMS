import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiDollarSign, FiCalendar, FiDownload, FiFilter, FiArrowUp, FiArrowDown } from 'react-icons/fi';

const SalaryHistory = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [sortConfig, setSortConfig] = useState({ key: 'payDate', direction: 'desc' });
  const { user } = useAuth();

  // Get unique years from salary history
  const getAvailableYears = () => {
    const years = history.map(item => new Date(item.payDate).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a);
  };

  // Filter by selected year
  useEffect(() => {
    if (history.length > 0) {
      const filtered = history.filter(item => 
        new Date(item.payDate).getFullYear() === selectedYear
      );
      setFilteredHistory(filtered);
    }
  }, [history, selectedYear]);

  // Sort functionality
  useEffect(() => {
    if (filteredHistory.length > 0) {
      const sortedData = [...filteredHistory].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      setFilteredHistory(sortedData);
    }
  }, [sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const fetchSalaryHistory = async () => {
      if (!user?._id) {
        setLoading(false);
        setError("Could not identify the logged-in user.");
        return;
      }

      try {
        const token = localStorage.getItem('employeeToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        
        const res = await axios.get(`/api/salaries/employee/${user._id}`, config);
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to fetch salary history:', err);
        setError('Could not load salary history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryHistory();
  }, [user]);

  // Calculate summary statistics
  const calculateSummary = () => {
    if (filteredHistory.length === 0) return null;
    
    const totalSalary = filteredHistory.reduce((sum, item) => sum + item.salary, 0);
    const totalAllowance = filteredHistory.reduce((sum, item) => sum + item.allowance, 0);
    const totalDeduction = filteredHistory.reduce((sum, item) => sum + item.deduction, 0);
    const totalNet = filteredHistory.reduce((sum, item) => sum + item.total, 0);
    
    return {
      totalSalary,
      totalAllowance,
      totalDeduction,
      totalNet,
      count: filteredHistory.length
    };
  };

  const summary = calculateSummary();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-6 rounded-lg">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-5 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <FiDollarSign className="mr-2 text-teal-600" />
              Salary History
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View your salary payments and details
            </p>
          </div>
          
          {history.length > 0 && (
            <div className="mt-4 md:mt-0 flex items-center">
              <FiFilter className="text-gray-400 mr-2" />
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {getAvailableYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <FiDollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No salary records</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              You do not have any salary records yet.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Payments</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{summary.count}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-500 dark:text-blue-400">Total Base Salary</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(summary.totalSalary)}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-500 dark:text-green-400">Total Allowances</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">+ {formatCurrency(summary.totalAllowance)}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-500 dark:text-red-400">Total Deductions</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">- {formatCurrency(summary.totalDeduction)}</p>
                </div>
              </div>
            )}

            {/* Net Salary Summary */}
            {summary && (
              <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-teal-500 dark:text-teal-400">Net Salary for {selectedYear}</p>
                    <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">{formatCurrency(summary.totalNet)}</p>
                  </div>
                  <button className="flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
                    <FiDownload className="mr-1" />
                    Export
                  </button>
                </div>
              </div>
            )}

            {/* Salary Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('payDate')}
                    >
                      <div className="flex items-center">
                        <FiCalendar className="mr-1" />
                        Pay Date
                        {sortConfig.key === 'payDate' && (
                          sortConfig.direction === 'asc' ? <FiArrowUp className="ml-1" /> : <FiArrowDown className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('salary')}
                    >
                      <div className="flex items-center justify-end">
                        Base Salary
                        {sortConfig.key === 'salary' && (
                          sortConfig.direction === 'asc' ? <FiArrowUp className="ml-1" /> : <FiArrowDown className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('allowance')}
                    >
                      <div className="flex items-center justify-end">
                        Allowance
                        {sortConfig.key === 'allowance' && (
                          sortConfig.direction === 'asc' ? <FiArrowUp className="ml-1" /> : <FiArrowDown className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('deduction')}
                    >
                      <div className="flex items-center justify-end">
                        Deduction
                        {sortConfig.key === 'deduction' && (
                          sortConfig.direction === 'asc' ? <FiArrowUp className="ml-1" /> : <FiArrowDown className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('total')}
                    >
                      <div className="flex items-center justify-end">
                        Total Paid
                        {sortConfig.key === 'total' && (
                          sortConfig.direction === 'asc' ? <FiArrowUp className="ml-1" /> : <FiArrowDown className="ml-1" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredHistory.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(item.payDate).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                        {formatCurrency(item.salary)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 dark:text-green-400">
                        + {formatCurrency(item.allowance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 dark:text-red-400">
                        - {formatCurrency(item.deduction)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-teal-600 dark:text-teal-400">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No salary records found for {selectedYear}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SalaryHistory;