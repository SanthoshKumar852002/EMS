import React, { useState } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Leave request under review', read: false },
    { id: 2, message: 'Salary credited for September', read: true },
    { id: 3, message: 'New company policy update', read: false },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
        Notifications
      </h2>
      <ul className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((note) => (
            <li
              key={note.id}
              className={`flex justify-between items-center p-3 rounded-lg border transition ${
                note.read
                  ? 'bg-gray-100 dark:bg-gray-700 border-gray-300'
                  : 'bg-teal-50 dark:bg-gray-600 border-teal-300'
              }`}
            >
              <span className="text-gray-800 dark:text-gray-200 text-sm">
                {note.message}
              </span>
              {!note.read && (
                <button
                  onClick={() => markAsRead(note.id)}
                  className="text-xs text-white bg-teal-500 px-3 py-1 rounded-lg hover:bg-teal-600"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-sm">No notifications available</li>
        )}
      </ul>
    </div>
  );
};
export default Notifications;