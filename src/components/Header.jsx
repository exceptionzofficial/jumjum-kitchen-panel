import { ChefHat, Sun, Moon, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

function Header({ pendingCount, onRefresh }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="header">
            <div className="header-brand">
                <div className="header-logo">
                    <ChefHat size={40} />
                </div>
                <div className="header-title">
                    <h1>Kitchen Dashboard</h1>
                    <span className="header-subtitle">JumJum Bar & Kitchen</span>
                </div>
            </div>

            <div className="header-stats">
                {pendingCount > 0 && (
                    <div className="pending-badge animate-glow">
                        <span className="pending-count">{pendingCount}</span>
                        <span>Pending Orders</span>
                    </div>
                )}
            </div>

            <div className="header-actions">
                <button className="btn btn-icon btn-secondary" onClick={onRefresh} title="Refresh Orders">
                    <RefreshCw size={24} />
                </button>

                <button
                    className="btn btn-icon btn-secondary theme-toggle"
                    onClick={toggleTheme}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
                </button>
            </div>
        </header>
    );
}

export default Header;
