import CraftCard from "./CraftCard";

export default function CraftGrid({
  crafts,
  wishlist,
  onWishlist,
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-5 lg:gap-y-10">
      {crafts.map((craft) => (
        <CraftCard
          key={craft.id}
          craft={craft}
          wishlist={wishlist}
          onWishlist={onWishlist}
        />
      ))}
    </div>
  );
}
