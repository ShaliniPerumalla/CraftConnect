from decimal import Decimal
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from marketplace.models import Category, CreatorProfile, Product

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds initial categories, creators, and products into the marketplace database."

    def handle(self, *args, **options):
        self.stdout.write("Seeding marketplace data...")

        # 1. Categories
        categories_data = [
            {
                "id_slug": "woodwork",
                "name": "Woodwork",
                "icon": "Hammer",
                "description": "Handcrafted pieces shaped from natural materials.",
                "image_url": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop",
            },
            {
                "id_slug": "pottery",
                "name": "Pottery & Ceramics",
                "icon": "Package",
                "description": "Beautiful ceramics created and finished by hand.",
                "image_url": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop",
            },
            {
                "id_slug": "jewelry",
                "name": "Jewelry",
                "icon": "Gem",
                "description": "Unique pieces designed with attention to detail.",
                "image_url": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop",
            },
            {
                "id_slug": "textiles",
                "name": "Textiles & Fiber Art",
                "icon": "Shirt",
                "description": "Traditional techniques transformed into modern designs.",
                "image_url": "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=600&auto=format&fit=crop",
            },
            {
                "id_slug": "wall-art",
                "name": "Wall Art & Prints",
                "icon": "Palette",
                "description": "Creative pieces that bring character to your space.",
                "image_url": "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&auto=format&fit=crop",
            },
            {
                "id_slug": "home-decor",
                "name": "Home Decor",
                "icon": "Home",
                "description": "Thoughtful objects made for beautiful homes.",
                "image_url": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop",
            },
            {
                "id_slug": "candles",
                "name": "Candles & Bath",
                "icon": "Flower2",
                "description": "Hand-poured creations for warmth and atmosphere.",
                "image_url": "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop",
            },
            {
                "id_slug": "leather",
                "name": "Leather Goods",
                "icon": "Briefcase",
                "description": "Durable handcrafted goods made for everyday use.",
                "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop",
            },
        ]

        category_map = {}
        for cat in categories_data:
            obj, created = Category.objects.update_or_create(
                slug=cat["id_slug"],
                defaults={
                    "name": cat["name"],
                    "icon": cat["icon"],
                    "description": cat["description"],
                    "image_url": cat["image_url"],
                },
            )
            category_map[cat["id_slug"]] = obj

        self.stdout.write(f"Seeded {len(category_map)} categories.")

        # 2. Creators
        creators_data = [
            {
                "username": "maren_holt",
                "name": "Maren Holt",
                "specialty": "Walnut & oak woodwork",
                "location": "Asheville, NC",
                "avatar": "https://i.pravatar.cc/150?img=32",
                "cover": "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80",
                "rating": Decimal("4.90"),
                "bio": "Third-generation woodturner and joinery specialist crafting sustainable heirloom tableware.",
                "skills": "Wood turning, Japanese joinery, oil finishing",
                "categories": ["woodwork", "home-decor"],
            },
            {
                "username": "priya_nair",
                "name": "Priya Nair",
                "specialty": "Hand-thrown stoneware",
                "location": "Portland, OR",
                "avatar": "https://i.pravatar.cc/150?img=47",
                "cover": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
                "rating": Decimal("5.00"),
                "bio": "Minimalist ceramist obsessed with earthy textures, food-safe glazes, and tactile warmth.",
                "skills": "Wheel throwing, glaze formulation, gas reduction firing",
                "categories": ["pottery", "home-decor"],
            },
            {
                "username": "diego_fuentes",
                "name": "Diego Fuentes",
                "specialty": "Leather & brass goods",
                "location": "Austin, TX",
                "avatar": "https://i.pravatar.cc/150?img=15",
                "cover": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
                "rating": Decimal("4.80"),
                "bio": "Master leather worker using vegetable-tanned hides and solid brass hardware for lifetime gear.",
                "skills": "Saddle stitching, wet molding, edge burnishing",
                "categories": ["leather", "jewelry"],
            },
            {
                "username": "ingrid_solberg",
                "name": "Ingrid Solberg",
                "specialty": "Wool weaving & textiles",
                "location": "Duluth, MN",
                "avatar": "https://i.pravatar.cc/150?img=26",
                "cover": "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?auto=format&fit=crop&w=800&q=80",
                "rating": Decimal("4.90"),
                "bio": "Nordic textile artist hand-weaving Icelandic wool throws, wraps, and natural plant dyes.",
                "skills": "Loom weaving, natural plant dyeing, fiber preparation",
                "categories": ["textiles", "home-decor"],
            },
        ]

        creator_map = {}
        for cdata in creators_data:
            user, _ = User.objects.get_or_create(
                username=cdata["username"],
                defaults={
                    "email": f"{cdata['username']}@example.com",
                    "first_name": cdata["name"].split()[0],
                    "last_name": cdata["name"].split()[-1] if len(cdata["name"].split()) > 1 else "",
                },
            )
            profile, _ = CreatorProfile.objects.update_or_create(
                user=user,
                defaults={
                    "name": cdata["name"],
                    "specialty": cdata["specialty"],
                    "location": cdata["location"],
                    "avatar": cdata["avatar"],
                    "cover": cdata["cover"],
                    "rating": cdata["rating"],
                    "bio": cdata["bio"],
                    "skills": cdata["skills"],
                },
            )
            for cslug in cdata["categories"]:
                if cslug in category_map:
                    profile.categories.add(category_map[cslug])

            creator_map[cdata["username"]] = profile

        self.stdout.write(f"Seeded {len(creator_map)} creators.")

        # 3. Products
        products_data = [
            {
                "name": "Handcrafted Wooden Serving Board",
                "creator": "maren_holt",
                "category": "woodwork",
                "price": Decimal("699.00"),
                "stock": 12,
                "materials": "Walnut wood",
                "tag": "Bestseller",
                "rating": Decimal("4.90"),
                "reviews_count": 112,
                "description": "Sculpted from a single block of kiln-dried American walnut. Finished with food-grade organic walnut oil.",
                "image": "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80",
            },
            {
                "name": "Handmade Ceramic Pottery",
                "creator": "priya_nair",
                "category": "pottery",
                "price": Decimal("549.00"),
                "stock": 8,
                "materials": "Stoneware clay",
                "tag": "Limited",
                "rating": Decimal("5.00"),
                "reviews_count": 87,
                "description": "Wheel-thrown rustic stoneware vase featuring a soft speckled matte white glaze with exposed raw clay foot.",
                "image": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
            },
            {
                "name": "Handcrafted Gold Jewelry",
                "creator": "diego_fuentes",
                "category": "jewelry",
                "price": Decimal("799.00"),
                "stock": 15,
                "materials": "Gold-plated brass",
                "tag": "New",
                "rating": Decimal("4.70"),
                "reviews_count": 56,
                "description": "Hand-hammered gold-plated textured pendant suspended from a 20-inch solid brass rolo chain.",
                "image": "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=80",
            },
            {
                "name": "Handwoven Textile Throw",
                "creator": "ingrid_solberg",
                "category": "textiles",
                "price": Decimal("899.00"),
                "stock": 10,
                "materials": "Wool and cotton",
                "tag": "New",
                "rating": Decimal("4.90"),
                "reviews_count": 64,
                "description": "Luxuriously soft throw woven on a 4-shaft floor loom with unbleached organic cotton and fine virgin wool.",
                "image": "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?auto=format&fit=crop&w=800&q=80",
            },
            {
                "name": "Botanical Wall Art Print",
                "creator": "maren_holt",
                "category": "wall-art",
                "price": Decimal("449.00"),
                "stock": 20,
                "materials": "Premium art paper",
                "tag": None,
                "rating": Decimal("4.80"),
                "reviews_count": 39,
                "description": "Archival giclée botanical print pressed from wild fern specimens onto heavyweight 300gsm cotton rag.",
                "image": "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&q=80",
            },
            {
                "name": "Hand-Poured Amber Candle",
                "creator": "priya_nair",
                "category": "candles",
                "price": Decimal("299.00"),
                "stock": 25,
                "materials": "Soy wax and amber glass",
                "tag": "Bestseller",
                "rating": Decimal("4.90"),
                "reviews_count": 201,
                "description": "All-natural soy candle infused with tobacco leaf, sandalwood, and sweet orange. Crackling wooden wick.",
                "image": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
            },
            {
                "name": "Full-Grain Leather Journal",
                "creator": "diego_fuentes",
                "category": "leather",
                "price": Decimal("699.00"),
                "stock": 14,
                "materials": "Full-grain leather",
                "tag": None,
                "rating": Decimal("4.80"),
                "reviews_count": 45,
                "description": "Hand-stitched full-grain harness leather journal containing 200 pages of fountain-pen friendly cotton paper.",
                "image": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
            },
            {
                "name": "Hand-Carved Wooden Bowl",
                "creator": "maren_holt",
                "category": "woodwork",
                "price": Decimal("799.00"),
                "stock": 9,
                "materials": "Carved oak wood",
                "tag": "New",
                "rating": Decimal("4.90"),
                "reviews_count": 28,
                "description": "Deep bowl gouged by hand from spalted oak. Highlights the natural grain pattern and dark character marks.",
                "image": "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80",
            },
        ]

        for pdata in products_data:
            Product.objects.update_or_create(
                name=pdata["name"],
                creator=creator_map[pdata["creator"]],
                defaults={
                    "category": category_map.get(pdata["category"]),
                    "price": pdata["price"],
                    "stock": pdata["stock"],
                    "materials": pdata["materials"],
                    "tag": pdata["tag"],
                    "rating": pdata["rating"],
                    "reviews_count": pdata["reviews_count"],
                    "description": pdata["description"],
                    "image": pdata["image"],
                },
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded marketplace!"))
