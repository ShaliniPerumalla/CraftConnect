// src/utils/mockData.js

// ======================================================
// CRAFT CATEGORIES
// ======================================================

export const categories = [
  {
    id: "woodwork",
    name: "Woodwork",
    icon: "Hammer",
    count: 128,
  },
  {
    id: "pottery",
    name: "Pottery & Ceramics",
    icon: "Package",
    count: 94,
  },
  {
    id: "jewelry",
    name: "Jewelry",
    icon: "Gem",
    count: 210,
  },
  {
    id: "textiles",
    name: "Textiles & Fiber Art",
    icon: "Shirt",
    count: 76,
  },
  {
    id: "wall-art",
    name: "Wall Art & Prints",
    icon: "Palette",
    count: 143,
  },
  {
    id: "home-decor",
    name: "Home Decor",
    icon: "Home",
    count: 89,
  },
  {
    id: "candles",
    name: "Candles & Bath",
    icon: "Flower2",
    count: 61,
  },
  {
    id: "leather",
    name: "Leather Goods",
    icon: "Briefcase",
    count: 47,
  },
];

// ======================================================
// CREATORS
// ======================================================

export const creators = [
  {
    id: "c1",
    name: "Maren Holt",
    specialty: "Walnut & oak woodwork",
    location: "Asheville, NC",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 4.9,
    products: 34,
    cover:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "c2",
    name: "Priya Nair",
    specialty: "Hand-thrown stoneware",
    location: "Portland, OR",
    avatar: "https://i.pravatar.cc/150?img=47",
    rating: 5.0,
    products: 51,
    cover:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "c3",
    name: "Diego Fuentes",
    specialty: "Leather & brass goods",
    location: "Austin, TX",
    avatar: "https://i.pravatar.cc/150?img=15",
    rating: 4.8,
    products: 22,
    cover:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "c4",
    name: "Ingrid Solberg",
    specialty: "Wool weaving & textiles",
    location: "Duluth, MN",
    avatar: "https://i.pravatar.cc/150?img=26",
    rating: 4.9,
    products: 40,
    cover:
      "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?auto=format&fit=crop&w=800&q=80",
  },

    {
    id: "c5",
    name: "Ananya Ceramics",
    specialty: "Handmade ceramic pottery",
    location: "Jaipur, India",
    avatar: "https://i.pravatar.cc/150?img=44",
    rating: 4.8,
    products: 28,
    cover:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "c6",
    name: "Arjun Woodworks",
    specialty: "Handcrafted wooden furniture",
    location: "Mysore, India",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 4.7,
    products: 31,
    cover:
      "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "c7",
    name: "Meera Jewellery",
    specialty: "Handmade silver jewellery",
    location: "Hyderabad, India",
    avatar: "https://i.pravatar.cc/150?img=49",
    rating: 4.9,
    products: 24,
    cover:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
  },
];

// ======================================================
// INITIAL CRAFTS
// ======================================================

export const crafts = [
  {
    id: "p1",
    name: "Handcrafted Wooden Serving Board",
    creator: "Maren Holt",
    creatorId: "c1",
    price: 699,
    rating: 4.9,
    reviews: 112,
    category: "woodwork",
    tag: "Bestseller",
    stock: 12,
    materials: "Walnut wood",
    image:
      "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "p2",
    name: "Handmade Ceramic Pottery",
    creator: "Priya Nair",
    creatorId: "c2",
    price: 549,
    rating: 5.0,
    reviews: 87,
    category: "pottery",
    tag: "Limited",
    stock: 8,
    materials: "Stoneware clay",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "p3",
    name: "Handcrafted Gold Jewelry",
    creator: "Diego Fuentes",
    creatorId: "c3",
    price: 799,
    rating: 4.7,
    reviews: 56,
    category: "jewelry",
    tag: null,
    stock: 15,
    materials: "Gold-plated brass",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "p4",
    name: "Handwoven Textile Throw",
    creator: "Ingrid Solberg",
    creatorId: "c4",
    price: 899,
    rating: 4.9,
    reviews: 64,
    category: "textiles",
    tag: "New",
    stock: 10,
    materials: "Wool and cotton",
    image:
      "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "p5",
    name: "Botanical Wall Art Print",
    creator: "Maren Holt",
    creatorId: "c1",
    price: 449,
    rating: 4.8,
    reviews: 39,
    category: "wall-art",
    tag: null,
    stock: 20,
    materials: "Premium art paper",
    image: "/botanical-wall-art.jpg",
  },

  {
    id: "p6",
    name: "Hand-Poured Amber Candle",
    creator: "Priya Nair",
    creatorId: "c2",
    price: 299,
    rating: 4.9,
    reviews: 201,
    category: "candles",
    tag: "Bestseller",
    stock: 25,
    materials: "Soy wax and amber glass",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "p7",
    name: "Full-Grain Leather Journal",
    creator: "Diego Fuentes",
    creatorId: "c3",
    price: 699,
    rating: 4.8,
    reviews: 45,
    category: "leather",
    tag: null,
    stock: 14,
    materials: "Full-grain leather",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "p8",
    name: "Hand-Carved Wooden Bowl",
    creator: "Maren Holt",
    creatorId: "c1",
    price: 799,
    rating: 4.9,
    reviews: 28,
    category: "woodwork",
    tag: "New",
    stock: 9,
    materials: "Carved oak wood",
    image:
      "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80",
  },
];