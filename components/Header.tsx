export interface HeaderProps {
  title?: string;
  userName?: string;
  onLogout?: () => void;
  showLogoutButton?: boolean;
}

export const Header = ({
  title = 'Feed',
  userName,
  onLogout,
  showLogoutButton = true,
}: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-4">
          {userName && (
            <span
              className="text-sm text-gray-600 max-w-[150px] truncate"
              title={userName}
            >
              {userName}
            </span>
          )}
          {showLogoutButton && onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex-shrink-0"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
