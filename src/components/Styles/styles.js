const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  },
  header: {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #2563eb 100%)',
    color: 'white',
    padding: '32px',
    textAlign: 'center',
    marginBottom: '32px',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  headerTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '12px',
    margin: 0,
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  },
  headerSubtitle: {
    fontSize: '1.25rem',
    margin: 0,
    opacity: 0.9
  },
  alert: {
    padding: '16px',
    marginBottom: '20px',
    borderRadius: '12px',
    border: '1px solid',
    fontWeight: '500'
  },
  alertSuccess: {
    backgroundColor: '#dcfce7',
    borderColor: '#bbf7d0',
    color: '#166534'
  },
  alertError: {
    backgroundColor: '#fecaca',
    borderColor: '#fca5a5',
    color: '#991b1b'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.1rem',
    color: '#64748b'
  },
  navContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '32px',
    justifyContent: 'center'
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: 'white',
    fontWeight: '600',
    fontSize: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  navButtonActive: {
    backgroundColor: '#1e293b',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.2)'
  },
  navButtonInactive: {
    backgroundColor: '#3b82f6'
  },
  contentSection: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: 0
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#16a34a',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  refreshButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
    padding: '20px',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    border: '2px solid #e2e8f0'
  },
  yearSelect: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '2px solid #d1d5db',
    backgroundColor: 'white',
    fontSize: '16px',
    fontWeight: '500'
  },
  matchesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
    gap: '24px',
    marginTop: '24px'
  },
  matchCard: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '16px',
    padding: '24px',
    border: '2px solid #e2e8f0',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  matchCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    borderColor: '#3b82f6'
  },
  matchHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e2e8f0'
  },
  matchDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '600'
  },
  matchTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '600'
  },
  competitionBadge: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    alignSelf: 'flex-start'
  },
  teamsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  teamSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    maxWidth: '40%'
  },
  teamName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: '8px',
    lineHeight: '1.3',
    wordWrap: 'break-word',
    hyphens: 'auto'
  },
  vsSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 20px',
    minWidth: '80px'
  },
  scoreContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: '8px'
  },
  matchInfo: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '2px solid #e2e8f0'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#64748b',
    fontSize: '14px'
  },
  infoLabel: {
    fontWeight: '600'
  },
  noData: {
    color: '#64748b',
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '1.2rem'
  },
  spin: {
    animation: 'spin 1s linear infinite'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid #d1d5db',
    marginTop: '20px',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold'
  },
  tableCell: {
    border: '1px solid #d1d5db',
    padding: '12px'
  },
  tableRowEven: {
    backgroundColor: 'white'
  },
  tableRowOdd: {
    backgroundColor: '#f9fafb'
  },
  debugBox: {
    backgroundColor: '#f0f9ff',
    border: '2px solid #0ea5e9',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
    fontSize: '12px',
    fontFamily: 'monospace'
  }
};

export default styles;
