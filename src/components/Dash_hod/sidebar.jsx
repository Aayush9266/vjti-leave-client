import React, { useEffect, useState } from 'react';
import {
  Home,
  Calendar,
  CheckSquare,
  Users,
  DollarSign,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/authContext.jsx';

export default function Sidebar() {
  const styles = {
    sidebar: {
      width: '240px',
      height: '100vh',
      backgroundColor: '#ffffff',
      color: '#1f2937',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      fontFamily: 'Segoe UI, sans-serif',
      boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '0 12px 12px 0',
    },
    header: {
      fontSize: '22px',
      fontWeight: 'bold',
      marginBottom: '30px',
      textAlign: 'center',
      color: '#b91c1c',
    },
    menu: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      flex: 1,
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 15px',
      borderRadius: '10px',
      marginBottom: '10px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease, color 0.2s ease',
      fontSize: '15px',
      position: 'relative',
    },
    itemHover: {
      backgroundColor: '#f3f4f6',
      color: '#2563eb',
    },
    icon: {
      marginRight: '12px',
    },
    notificationWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    dotWrapper: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    },
    notificationDot: {
      height: '10px',
      width: '10px',
      borderRadius: '50%',
      backgroundColor: '#dc2626',
      position: 'absolute',
      top: '-4px',
      right: '-10px',
    },
    itemHighlight: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
    },
  };

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={18} /> },
    { name: 'Leave Calendar', icon: <Calendar size={18} /> },
    { name: 'Notification', icon: <CheckSquare size={18} />, hasDot: hasUnread },
    { name: 'Team', icon: <Users size={18} /> },
    { name: 'Payroll', icon: <DollarSign size={18} /> },
    { name: 'Settings', icon: <Settings size={18} /> },
    { name: 'Help & Support', icon: <HelpCircle size={18} /> },
  ];

  useEffect(() => {
    let interval;

    if (user) {

      const fetchNotifications = () => {
        fetch(`/api/notifications/unread?email=${user.email}&role=${user.role}&department=${user.department}`)
          .then((res) => res.json())
          .then((data) => {
            console.log('Unread notification count:', data.length);
            setHasUnread(data.length > 0);
            // Optional: console.log("Unread notifications:", data.length);
          })
          .catch((err) => console.error('Error fetching unread notifications:', err));
      };

      fetchNotifications();
      interval = setInterval(fetchNotifications, 60000); // refresh every 60s
    }

    return () => clearInterval(interval);
  }, [user]);

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>Faculty Panel</div>
      <ul style={styles.menu}>
        {menuItems.map((item, index) => {
          const isHovered = hoveredIndex === index;
          const isNotificationUnread = item.name === 'Notification' && item.hasDot;

          return (
            <li
              key={index}
              style={{
                ...styles.item,
                ...(isHovered ? styles.itemHover : {}),
                ...(isNotificationUnread ? styles.itemHighlight : {}),
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                if (item.name === 'Notification') {
                  navigate('/notification');
                } else if (item.name === 'Dashboard') {
                  if(user.role === 'faculty'||user.role === 'clerk'||user.role === 'staff'||user.role === 'contractual faculty'){
                    navigate('/faculty');
                  }
                  else if(user.role === 'admin'){
                    navigate('/Admindash');
                  }
                  else{
                    navigate('/HodDash');
                  }
                }
              }}
            >
              <div style={styles.notificationWrapper}>
                <div style={styles.dotWrapper}>
                  <span style={styles.icon}>{item.icon}</span>
                  {item.name}
                  {item.hasDot && <span style={styles.notificationDot}></span>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
