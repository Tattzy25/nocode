'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'

export default function CalendarComponent() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Mock bookings data
  const bookings = [
    { date: new Date(2024, 11, 15), title: "Mobility Scooter - Emma J.", type: "confirmed" },
    { date: new Date(2024, 11, 16), title: "Mobility Scooter - Emma J.", type: "confirmed" },
    { date: new Date(2024, 11, 17), title: "Mobility Scooter - Emma J.", type: "confirmed" },
    { date: new Date(2024, 11, 20), title: "Travel Stroller - Michael C.", type: "pending" },
    { date: new Date(2024, 11, 21), title: "Travel Stroller - Michael C.", type: "pending" },
    { date: new Date(2024, 11, 23), title: "Lightweight Scooter - Sarah W.", type: "confirmed" },
    { date: new Date(2024, 11, 24), title: "Lightweight Scooter - Sarah W.", type: "confirmed" },
    { date: new Date(2024, 11, 25), title: "Lightweight Scooter - Sarah W.", type: "confirmed" },
    { date: new Date(2024, 11, 26), title: "Lightweight Scooter - Sarah W.", type: "confirmed" },
  ]

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => isSameDay(booking.date, date))
  }

  const getDayClassName = (day: Date) => {
    const classes = ['w-10 h-10 flex items-center justify-center text-sm rounded-full cursor-pointer']
    
    if (!isSameMonth(day, currentDate)) {
      classes.push('text-gray-400')
    } else if (isSameDay(day, selectedDate)) {
      classes.push('bg-primary-600 text-white')
    } else {
      classes.push('text-gray-900 hover:bg-gray-100')
    }

    const dayBookings = getBookingsForDate(day)
    if (dayBookings.length > 0) {
      const hasConfirmed = dayBookings.some(b => b.type === 'confirmed')
      const hasPending = dayBookings.some(b => b.type === 'pending')
      
      if (hasConfirmed) {
        classes.push('font-bold')
      }
    }

    return classes.join(' ')
  }

  return (
    <div className="bg-white rounded-lg">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
        
        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <div key={`empty-${index}`} className="bg-white"></div>
        ))}
        
        {monthDays.map(day => {
          const dayBookings = getBookingsForDate(day)
          return (
            <div
              key={day.toString()}
              className="bg-white p-2 min-h-[80px] border-t border-gray-200"
            >
              <div className="text-center">
                <div
                  className={getDayClassName(day)}
                  onClick={() => setSelectedDate(day)}
                >
                  {format(day, 'd')}
                </div>
                
                {dayBookings.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {dayBookings.map((booking, index) => (
                      <div
                        key={index}
                        className={`text-xs px-1 py-0.5 rounded truncate ${
                          booking.type === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
          <span className="text-gray-600">Confirmed booking</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-100 rounded mr-2"></div>
          <span className="text-gray-600">Pending request</span>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h4>
          
          {getBookingsForDate(selectedDate).length > 0 ? (
            <div className="space-y-2">
              {getBookingsForDate(selectedDate).map((booking, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{booking.title}</p>
                    <p className="text-sm text-gray-500">
                      Status: {booking.type === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </p>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No bookings scheduled for this date.</p>
          )}
        </div>
      )}
    </div>
  )
}