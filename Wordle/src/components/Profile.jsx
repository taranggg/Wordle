export default function Profile({ username, onLogout }) {
  return (
    <div className="p-4 mb-4 bg-white/50 dark:bg-slate-700/50 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-800 dark:text-slate-200">
          {username}
        </span>
        <button
          onClick={onLogout}
          className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
