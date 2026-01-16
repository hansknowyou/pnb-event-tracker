// Generate consistent colors for tags based on their name
export function getTagColor(tag: string): string {
  // Hash function to convert string to number
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Color palette - vibrant but readable colors
  const colors = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-orange-100 text-orange-800 border-orange-200',
    'bg-cyan-100 text-cyan-800 border-cyan-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
    'bg-teal-100 text-teal-800 border-teal-200',
    'bg-rose-100 text-rose-800 border-rose-200',
    'bg-amber-100 text-amber-800 border-amber-200',
    'bg-lime-100 text-lime-800 border-lime-200',
    'bg-emerald-100 text-emerald-800 border-emerald-200',
  ];

  // Use hash to select color
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

// For hover states
export function getTagHoverColor(tag: string): string {
  const baseColor = getTagColor(tag);
  // Replace -100 with -200 for darker hover state
  return baseColor.replace(/-100/g, '-200');
}
