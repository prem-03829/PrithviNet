import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const handleLogin = (e) => {
    e.preventDefault();
    const role = e.target.role.value;    console.log(`Login decision: role selected is "${role}"`);
    
    if (role === 'citizen') {
      setUser({
        id: 'US-4492',
        name: 'Arjun Mehra',
        email: 'arjun.mehra@example.com',
        role: 'Citizen',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcSooiWL5QJfcdvtCF5pXx7Rc-7f2WYGLJI7HXEAicDBhcfQLs1ulmlkuNyIIC4dhW4vuYUyHtnlGta_twTWhWzzvHbryg_kpmQVU94RYrrBAV6sZjdjR-UrYr6wPxo70oxs0OAVUywhYqYNwvWiUP9R54mpGwNOzTQ6MQeLZwfPV0YaPpdambOaQKYOOQLHRFZQ4A8CNw9tNOsD6eyD-OxTR9RnqXWdVqZHv8wphYU7e8WRnD2Htr4NoPLifdjBUGJq0s2U9nohw',
        city: 'Mumbai',
        phone: '+91 98765 43210'
      });
      navigate('/citizen/map');
    } else if (role === 'authority') {
      setUser({
        id: 'IND-772',
        name: 'Industrial Safety Officer',
        email: 'safety@apex-mfg.com',
        role: 'Industry',
        industryId: 'apex-mfg',
        plantIds: ['plant-01', 'plant-02'],
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp3fcDeYLg208bCk0ztIFblaK2xJzNeUZTKZaoF4Rhzs9-3IcYa8eeuAMq7cW26OCsYm5AZ2GmyrJPsb5Pu8T1m43GQA1XirbTDgvQnxGZUnc22i2cXFsQACOdcN0-vmGqAifS_N6JBjyf6SkeMsjrdoDSecHnIWbZTegcrTg9yxIbBcpHyNxZCAwlJpZOndgqi0McYgUc4x428LxOJjjbeRqAiXIk6_C3_70J8k1pRJ6e6hD0kMVTxWkVI3az7KqoQndy2tUkv1c',
        city: 'Mumbai',
        phone: '+91 99887 76655'
      });
      navigate('/industry/dashboard');
    } else if (role === 'government') {
      setUser({
        id: 'GOV-202',
        name: 'Sahil Kapoor',
        email: 'sahil.kapoor@gov.in',
        role: 'Government Official',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp3fcDeYLg208bCk0ztIFblaK2xJzNeUZTKZaoF4Rhzs9-3IcYa8eeuAMq7cW26OCsYm5AZ2GmyrJPsb5Pu8T1m43GQA1XirbTDgvQnxGZUnc22i2cXFsQACOdcN0-vmGqAifS_N6JBjyf6SkeMsjrdoDSecHnIWbZTegcrTg9yxIbBcpHyNxZCAwlJpZOndgqi0McYgUc4x428LxOJjjbeRqAiXIk6_C3_70J8k1pRJ6e6hD0kMVTxWkVI3az7KqoQndy2tUkv1c',
        city: 'Mumbai',
        phone: '+91 91234 56789'
      });
      navigate('/official/dashboard');
    } else {
      // Default to admin if anything else
      setUser({
        id: 'ADMIN-001',
        name: 'System Admin',
        email: 'admin@prithvinet.gov',
        role: 'Admin',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp3fcDeYLg208bCk0ztIFblaK2xJzNeUZTKZaoF4Rhzs9-3IcYa8eeuAMq7cW26OCsYm5AZ2GmyrJPsb5Pu8T1m43GQA1XirbTDgvQnxGZUnc22i2cXFsQACOdcN0-vmGqAifS_N6JBjyf6SkeMsjrdoDSecHnIWbZTegcrTg9yxIbBcpHyNxZCAwlJpZOndgqi0McYgUc4x428LxOJjjbeRqAiXIk6_C3_70J8k1pRJ6e6hD0kMVTxWkVI3az7KqoQndy2tUkv1c',
        city: 'New Delhi',
        phone: '+91 11001 10011'
      });
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-app text-text-primary font-display overflow-x-hidden relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 lg:px-24 bg-app border-r border-border relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(at 0% 0%, rgba(34, 197, 94, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(34, 197, 94, 0.1) 0px, transparent 50%)' }}>
        <div className="max-w-md relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-10 bg-primary bg-opacity-20 flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined text-primary text-3xl">eco</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">PrithviNet</h1>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4 text-text-primary">
            Unified environmental monitoring and civic reporting system
          </h2>
          <p className="text-text-muted text-lg mb-12">
            Empowering citizens and authorities to monitor, report, and protect our environment through integrated data analytics.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-surface/40 border border-border">
              <span className="material-symbols-outlined text-primary mb-2">sensors</span>
              <p className="text-sm font-semibold text-text-primary">Real-time Sensors</p>
              <p className="text-xs text-text-secondary">Global environmental tracking</p>
            </div>
            <div className="p-4 rounded-xl bg-surface/40 border border-border">
              <span className="material-symbols-outlined text-primary mb-2">public</span>
              <p className="text-sm font-semibold text-text-primary">Civic Action</p>
              <p className="text-xs text-text-secondary">Community-driven reporting</p>
            </div>
            <div className="p-4 rounded-xl bg-surface/40 border border-border">
              <span className="material-symbols-outlined text-primary mb-2">bar_chart</span>
              <p className="text-sm font-semibold text-text-primary">Data Insights</p>
              <p className="text-xs text-text-secondary">Advanced analytical tools</p>
            </div>
            <div className="p-4 rounded-xl bg-surface/40 border border-border">
              <span className="material-symbols-outlined text-primary mb-2">verified_user</span>
              <p className="text-sm font-semibold text-text-primary">Secure Access</p>
              <p className="text-xs text-text-secondary">Role-based governance</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-4 md:p-8 lg:p-12 bg-panel dark:bg-app/50">
        <div className="w-full max-w-md bg-surface dark:bg-surface/30 p-6 md:p-8 rounded-2xl border border-border dark:border-border/40 backdrop-blur-sm shadow-xl">
          <div className="mb-8 text-center lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-3xl">eco</span>
              <h1 className="text-2xl font-bold text-text-primary">PrithviNet</h1>
            </div>
          </div>
          <div className="mb-6 md:mb-8 text-left">
            <h3 className="text-xl md:text-2xl font-bold text-text-primary">Sign In</h3>
            <p className="text-text-secondary dark:text-text-muted text-xs md:text-sm mt-1">Access the PrithviNet dashboard</p>
          </div>
          <form className="space-y-5 md:space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs md:text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">Select Role</label>
              <div className="relative">
                <select name="role" className="w-full h-11 md:h-12 bg-panel dark:bg-app/80 border border-border dark:border-border rounded-lg px-4 appearance-none focus:ring-2 focus:ring-primary outline-none transition-all text-sm">
                  <option value="citizen">Citizen</option>
                  <option value="authority">Industry</option>
                  <option value="government">Government Official</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">Email or ID</label>
              <div className="relative">
                <input className="w-full h-11 md:h-12 bg-panel dark:bg-app/80 border border-border dark:border-border rounded-lg px-10 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="name@example.com" type="text" defaultValue="admin@prithvinet.gov" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  <span className="material-symbols-outlined text-lg">alternate_email</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs md:text-sm font-medium text-text-secondary dark:text-text-secondary">Password</label>
                <a className="text-[10px] md:text-xs text-primary hover:underline" href="#">Forgot password?</a>
              </div>
              <div className="relative">
                <input className="w-full h-11 md:h-12 bg-panel dark:bg-app/80 border border-border dark:border-border rounded-lg px-10 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="••••••••" type="password" defaultValue="password" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  <span className="material-symbols-outlined text-lg">lock</span>
                </div>
              </div>
            </div>
            <button className="w-full h-11 md:h-12 bg-primary hover:bg-primary hover:bg-opacity-90 text-background-dark font-bold rounded-lg transition-all shadow-lg shadow-primary text-sm md:text-base" type="submit">
              Login
            </button>
          </form>
          <div className="mt-6 md:mt-8 pt-6 border-t border-border dark:border-border/50 text-center">
            <p className="text-text-secondary dark:text-text-muted text-xs md:text-sm">
              New to the platform? 
              <button onClick={() => navigate('/register')} className="text-primary font-semibold hover:underline ml-1">Register as Citizen</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
