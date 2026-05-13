import './Badge.css';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  className = '',
}) {
  const classes = [
    'rol-badge',
    `rol-badge--${variant}`,
    `rol-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {Icon && <Icon size={size === 'sm' ? 10 : 12} />}
      <span>{children}</span>
    </span>
  );
}
