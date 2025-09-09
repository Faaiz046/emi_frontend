import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';
import { selectCompanies } from '../../../store/slices/companySlice';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import { FiUsers, FiShoppingCart, FiScissors, FiBarChart2, FiCalendar } from "react-icons/fi";
import { FaBuilding, FaBoxOpen, FaMoneyBillWave } from "react-icons/fa";
const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const companies = useAppSelector(selectCompanies);
  const navigate = useNavigate();
  
  // Get the first company for display (you can enhance this later to show selected company)
  const currentCompany = companies.length > 0 ? companies[0] : null;

  const dashboardCards = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: <FiUsers className='text-white' />,
      color: "bg-blue-500",
      path: "/users",
      stats: "Active Users: 25",
    },
    {
      title: "Company Management",
      description: "Manage company information and branches",
      icon: <FaBuilding className='text-white' />,
      color: "bg-green-500",
      path: "/company",
      stats: "Companies: 3",
    },
    {
      title: "Product Catalog",
      description: "Manage brands, categories, and products",
      icon: <FaBoxOpen className='text-white' />,
      color: "bg-purple-500",
      path: "/products",
      stats: "Products: 150+",
    },
    {
      title: "Lease Accounts",
      description: "Manage installment and lease accounts",
      icon: <FaMoneyBillWave className='text-white' />,
      color: "bg-yellow-500",
      path: "/accounts",
      stats: "Active Accounts: 45",
    },
    {
      title: "POS System",
      description: "Point of sale and inventory management",
      icon: <FiShoppingCart className='text-white' />,
      color: "bg-indigo-500",
      path: "/pos/sales",
      stats: "Today's Sales: $2,450",
    },
    {
      title: "Tailor Management",
      description: "Custom orders and measurements",
      icon: <FiScissors className='text-white' />,
      color: "bg-pink-500",
      path: "/tailor/orders",
      stats: "Active Orders: 12",
    },
    {
      title: "Appointments",
      description: "Schedule and manage appointments",
      icon: <FiCalendar className='text-white' />,
      color: "bg-teal-500",
      path: "/appointments/calendar",
      stats: "Today: 8 Appointments",
    },
    {
      title: "Analytics",
      description: "Business insights and reports",
      icon: <FiBarChart2 className='text-white' />,
      color: "bg-orange-500",
      path: "/analytics",
      stats: "Revenue: +15% this month",
    },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="mt-2 text-gray-600">
              Here's what's happening with your business today
            </p>
            {currentCompany && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Current Company:</span> {currentCompany.company_name}
                </p>
              </div>
            )}
          </div>

          {/* Dashboard Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dashboardCards.map((card, index) => (
              <DashboardCard
                key={index}
                title={card.title}
                description={card.description}
                icon={card.icon}
                color={card.color}
                stats={card.stats}
                onClick={() => navigate(card.path)}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/pos/sales')}>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Start New Sale</h3>
                    <p className="text-gray-600">Process customer transactions</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/tailor/orders')}>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <span className="text-2xl">✂️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">New Tailor Order</h3>
                    <p className="text-gray-600">Create custom clothing orders</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/appointments/calendar')}>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-teal-100 rounded-lg">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Schedule Appointment</h3>
                    <p className="text-gray-600">Book customer appointments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default DashboardPage; 