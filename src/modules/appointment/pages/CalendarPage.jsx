import React from 'react';
import { CalendarIcon, PlusIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

const CalendarPage = () => {
  const appointments = [
    { id: 1, customer: 'John Doe', service: 'Consultation', time: '9:00 AM', date: '2024-01-15', status: 'Confirmed' },
    { id: 2, customer: 'Jane Smith', service: 'Fitting', time: '11:00 AM', date: '2024-01-15', status: 'Confirmed' },
    { id: 3, customer: 'Mike Johnson', service: 'Final Fitting', time: '2:00 PM', date: '2024-01-15', status: 'Pending' },
    { id: 4, customer: 'Sarah Wilson', service: 'Consultation', time: '4:00 PM', date: '2024-01-15', status: 'Confirmed' },
  ];

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
  ];

  const getAppointmentForTimeSlot = (time) => {
    return appointments.find(apt => apt.time === time);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Appointment Calendar</h2>
          <p className="text-gray-600">View and manage daily appointments</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          New Appointment
        </button>
      </div>

      {/* Date Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="w-8 h-8 text-indigo-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Monday, January 15, 2024</h3>
              <p className="text-gray-600">Today's Schedule</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Appointments</div>
            <div className="text-2xl font-bold text-indigo-600">{appointments.length}</div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Daily Schedule</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {timeSlots.map((time) => {
              const appointment = getAppointmentForTimeSlot(time);
              return (
                <div key={time} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-24 text-sm font-medium text-gray-900">
                    {time}
                  </div>
                  
                  {appointment ? (
                    <div className="flex-1 ml-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <UserIcon className="w-5 h-5 text-indigo-600" />
                          <div>
                            <div className="font-medium text-indigo-900">{appointment.customer}</div>
                            <div className="text-sm text-indigo-700">{appointment.service}</div>
                          </div>
                        </div>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 ml-4 p-3 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center text-gray-500">
                        <ClockIcon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-sm">Available</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
