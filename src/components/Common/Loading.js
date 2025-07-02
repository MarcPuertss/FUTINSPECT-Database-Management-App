import styles from '../Styles/styles';
import SimpleIcons from './SimpleIcons';

const Loading = ({ show, message = 'Cargando...' }) => {
  if (!show) return null;
  return (
    <div style={styles.loading}>
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <SimpleIcons.RefreshCw className="spin" />
        <span style={{ marginLeft: '12px' }}>{message}</span>
      </div>
    </div>
  );
};

export default Loading;
