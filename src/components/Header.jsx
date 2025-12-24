import { useState, useEffect } from 'react';
import { RefreshCw, Sun, Moon, Bell, Clock, ChefHat } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

function Header({ pendingCount = 0, preparingCount = 0, readyCount = 0, onRefresh }) {
    const [time, setTime] = useState(new Date());
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
    };

    return (
        <header className="header">
            <div className="header-brand">
                <div className="brand-logo">
                    <ChefHat size={24} />
                </div>
                <div className="brand-text">
                    <h1>Kitchen Display</h1>
                    <span>Order Management</span>
                </div>
            </div>

            <div className="header-stats">
                <div className="stat-badge pending">
                    <Bell size={16} />
                    <span className="stat-count">{pendingCount}</span>
                    <span className="stat-label">Pending</span>
                </div>
                <div className="stat-badge preparing">
                    <Clock size={16} />
                    <span className="stat-count">{preparingCount}</span>
                    <span className="stat-label">Preparing</span>
                </div>
                <div className="stat-badge ready">
                    <ChefHat size={16} />
                    <span className="stat-count">{readyCount}</span>
                    <span className="stat-label">Ready</span>
                </div>
            </div>

            <div className="header-right">
                <div className="header-time">
                    {formatTime(time)}
                </div>
                <button className="icon-btn" onClick={onRefresh} title="Refresh">
                    <RefreshCw size={20} />
                </button>
                <button className="icon-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
}

export default Header;
