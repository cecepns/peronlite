import { BRAND_LOGO, BRAND_NAME } from "@/constants/brand";

export default function BrandLogo({ className = "h-8 w-auto", alt = BRAND_NAME }) {
  return <img src={BRAND_LOGO} alt={alt} className={`object-contain ${className}`} />;
}
