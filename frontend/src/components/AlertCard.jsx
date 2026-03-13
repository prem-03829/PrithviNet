import Badge from './Badge';

export default function AlertCard({ title, type, desc }) {
  const getBadgeVariant = (type) => {
    switch(type) {
      case 'CRITICAL': return 'danger';
      case 'WARNING': return 'warning';
      case 'STABLE': return 'success';
      default: return 'primary';
    }
  };

  return (
    <div className="p-4 rounded-lg bg-panel/30 border border-border">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-bold text-primary">{title}</span>
        <Badge variant={getBadgeVariant(type)}>{type}</Badge>
      </div>
      <p className="text-sm text-text-muted">{desc}</p>
    </div>
  );
}
