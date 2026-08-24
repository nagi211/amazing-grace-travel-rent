import {
  Image,
  Armchair,
  PartyPopper,
  Gift,
  Sparkles,
  Sparkle,
  Users,
  Cake,
  Wand2,
  CalendarHeart,
  Palmtree,
} from "lucide-react";

// Only the icons actually referenced from data files need to be listed here —
// this keeps the bundle tree-shakeable instead of pulling in the full icon set.
const ICONS = {
  Image,
  Armchair,
  PartyPopper,
  Gift,
  Sparkles,
  Sparkle,
  Users,
  Cake,
  Wand2,
  CalendarHeart,
  Palmtree,
};

/**
 * Renders a real photo when `src` is provided, otherwise falls back to a
 * branded gradient block with an icon. Lets every image slot in the site
 * ship today and get swapped for real photography later without touching
 * any layout code.
 */
export default function PlaceholderImage({
  src,
  alt = "",
  icon = "Image",
  tone = "ocean",
  className = "",
  style,
  iconSize = 48,
}) {
  if (src) {
    return <img src={src} alt={alt} className={className} style={style} loading="lazy" />;
  }

  const Icon = ICONS[icon] || ICONS.Image;

  return (
    <div className={`placeholder-img tone-${tone} ${className}`} style={style} role="img" aria-label={alt}>
      <Icon size={iconSize} strokeWidth={1.5} />
    </div>
  );
}
