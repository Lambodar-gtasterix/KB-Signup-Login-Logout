export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}
export interface Product {
  id: string;
  title: string;
  price: string;
  image: string | number; // ✅ Supports both remote URL and local require/import
  category: string;
  description: string;
}
export interface TabItem {
  name: string;
  icon: string;
  activeIcon: string;
}

