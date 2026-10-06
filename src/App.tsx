import { Dashboard } from './pages/Dashboard';
import { useLocale } from './i18n';

function App() {
  useLocale();
  return <Dashboard />;
}

export default App;
