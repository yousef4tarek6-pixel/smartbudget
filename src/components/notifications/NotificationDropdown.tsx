import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, AlertTriangle, Info, CheckCircle, ExternalLink } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/formatters';

interface NotificationDropdownProps {
  onNavigateTab?: (tab: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onNavigateTab }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-gray-400 hover:text-white light:hover:text-gray-900 bg-gray-800/80 light:bg-gray-100 hover:bg-gray-700/80 light:hover:bg-gray-200 rounded-xl transition-all cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-gray-900 light:bg-white border border-gray-800 light:border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-800 light:border-gray-100">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-gray-100 light:text-gray-900">Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-md font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-800/50 light:divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500">No notifications yet.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationAsRead(n.id);
                    if (n.linkTab && onNavigateTab) {
                      onNavigateTab(n.linkTab);
                      setIsOpen(false);
                    }
                  }}
                  className={`p-4 transition-colors flex items-start gap-3 cursor-pointer ${
                    !n.read
                      ? 'bg-indigo-500/5 light:bg-indigo-50/50 hover:bg-indigo-500/10'
                      : 'hover:bg-gray-800/50 light:hover:bg-gray-50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-gray-800 light:bg-gray-100 shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-gray-200 light:text-gray-900 truncate">
                        {n.title}
                      </h5>
                      <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                        {formatDate(n.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 light:text-gray-600 mt-1 line-clamp-2">
                      {n.message}
                    </p>
                    {n.linkTab && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-indigo-400 font-medium mt-1">
                        View details <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                    className="text-gray-600 hover:text-rose-400 p-1 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
