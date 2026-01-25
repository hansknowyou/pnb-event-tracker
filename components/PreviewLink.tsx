import { cn } from '@/lib/utils';

interface PreviewLinkProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function PreviewLink({ href, label = 'Preview', className }: PreviewLinkProps) {
  const trimmed = href?.trim();
  if (!trimmed) return null;

  return (
    <a
      href={trimmed}
      target="_blank"
      rel="noreferrer"
      className={cn('text-sm text-blue-600 hover:underline', className)}
    >
      {label}
    </a>
  );
}
