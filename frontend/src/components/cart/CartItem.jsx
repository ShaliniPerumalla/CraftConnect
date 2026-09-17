import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <div className="bg-white border border-border rounded-2xl p-4 flex gap-4">

      {/* Image */}
      <Link
        to={`/craft/${item.id}`}
        className="w-28 h-28 shrink-0 rounded-xl overflow-hidden"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">

        <Link
          to={`/craft/${item.id}`}
          className="font-display text-lg text-ink hover:text-amber-dark"
        >
          {item.name}
        </Link>

        <p className="text-sm text-ink-soft mt-1">
          {item.creator}
        </p>

        <p className="font-medium text-ink mt-2">
          ${item.price}
        </p>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-4">

          <div className="flex items-center border border-border rounded-lg">

            <button
              onClick={() => onDecrease(item.id)}
              className="p-2 hover:bg-cream"
            >
              <Minus size={15} />
            </button>

            <span className="w-8 text-center text-sm">
              {item.quantity}
            </span>

            <button
              onClick={() => onIncrease(item.id)}
              className="p-2 hover:bg-cream"
            >
              <Plus size={15} />
            </button>

          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="flex items-center gap-1 text-sm text-rose hover:underline"
          >
            <Trash2 size={15} />
            Remove
          </button>

        </div>

      </div>

      {/* Total */}
      <div className="text-right font-medium text-ink">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

    </div>
  );
}