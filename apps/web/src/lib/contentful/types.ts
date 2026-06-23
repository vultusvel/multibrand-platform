export interface Brand {
  id:              string;
  slug:            string;
  name:            string;
  color:           string;
  backgroundColor: string;
  initial:         string;
  heroImageUrl?:   string | null;
}

export interface Product {
  id:        string;
  slug:      string;
  title:     string;
  price:     number;
  wasPrice?: number | null;
  badge?:    string | null;
  inStock:   boolean;
  category:  string;
  brandSlug: string;
  imageUrls: string[];
}

export interface Banner {
  id:                 string;
  title:              string;
  subtitle?:          string | null;
  ctaText:            string;
  ctaLink:            string;
  backgroundImageUrl?: string | null;
  brandSlug?:         string | null;
}
