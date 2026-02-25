import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react'; 

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
            title="Cambiar modo"
        >
            {theme === 'light' ? (
                <Moon className="text-gray-800" size={20} />
            ) : (
                <Sun className="text-yellow-400" size={20} />
            )}
        </button>
    );
};