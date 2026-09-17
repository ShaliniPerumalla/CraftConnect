// src/components/explore/CraftGrid.jsx

import CraftCard from "./CraftCard";

export default function CraftGrid({
  crafts,
  wishlist,
  onWishlist,
  onAddToCart,
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-9 lg:gap-x-5 lg:gap-y-11">

      {crafts.map((craft) => (
        <CraftCard
          key={craft.id}
          craft={craft}
          wishlist={wishlist}
          onWishlist={onWishlist}
          onAddToCart={onAddToCart}
        />
      ))}

    </div>
  );
}
