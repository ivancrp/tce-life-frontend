import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  className?: string;
}

const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const Calendar = ({ selectedDate, onDateSelect, className }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-apple-gray-200 button-transition"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-5 w-5 text-apple-gray-700" />
          </button>
          <button 
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-apple-gray-200 button-transition"
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-5 w-5 text-apple-gray-700" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-apple-gray-600">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        
        days.push(
          <div
            key={day.toString()}
            className={cn(
              "h-10 flex items-center justify-center text-sm rounded-full button-transition",
              isCurrentMonth ? "text-apple-gray-800" : "text-apple-gray-400",
              isSameDay(day, selectedDate) && "bg-apple-blue text-white",
              !isSameDay(day, selectedDate) && isCurrentMonth && "hover:bg-apple-gray-200"
            )}
            onClick={() => isCurrentMonth && onDateSelect(cloneDay)}
          >
            {format(day, 'd')}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1 mb-1">
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  return (
    <div className={cn("bg-white p-4 rounded-xl shadow-sm border border-apple-gray-200", className)}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;