const SimpleIcons = {
  Eye: () => <span>👁️</span>,
  RefreshCw: ({ className }) => <span className={className} style={{ display: 'inline-block' }}>🔄</span>,
  User: () => <span>👤</span>,
  Flag: () => <span>🏁</span>,
  Play: () => <span>▶️</span>,
  Trophy: () => <span>🏆</span>,
  Stadium: () => <span>🏟️</span>,
  Calendar: () => <span>📅</span>,
  Vs: () => <span style={{ fontWeight: 'bold', color: '#ef4444' }}>VS</span>,
};

export default SimpleIcons;
