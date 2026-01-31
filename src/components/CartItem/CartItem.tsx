import React from "react";
import { IGoodsMutation } from "../../types";
import "./CartItem.css";
import { addProducts, minusProducts } from "../../redux/slices/cartSlice";
import { useAppDispatch } from "../../redux/hooks/hooks";

interface Props {
  cartItem: IGoodsMutation;
  onClickRemove: () => void;
  onClickEdit: () => void;
}

const CartItem: React.FC<Props> = ({
  cartItem,
  onClickRemove,
  onClickEdit,
}) => {
  const dispatch = useAppDispatch();

  const onPlus = () => {
    dispatch(addProducts(cartItem));
  };

  const onMinus = () => {
    dispatch(minusProducts(cartItem.cartItemKey));
  };

  const optionParts: string[] = [];
  if (cartItem.selectedSize) optionParts.push(cartItem.selectedSize.label);
  if (cartItem.selectedDough) optionParts.push(cartItem.selectedDough.label);
  const optionLine = optionParts.length > 0 ? optionParts.join(", ") : null;

  const hasAddedIngredients =
    cartItem.addedIngredients && cartItem.addedIngredients.length > 0;

  return (
    <div className="cart-item">
      <div className="cart-item__main">
        <img
          className="cart-item__img"
          src={cartItem.imageUrl}
          alt={cartItem.title}
        />
        <div className="cart-item__info">
          <p className="cart-item__title">{cartItem.title}</p>
          {optionLine && <p className="cart-item__options">{optionLine}</p>}
          {hasAddedIngredients && (
            <p className="cart-item__extras">
              + {cartItem.addedIngredients!.map((i) => i.title).join(", ")}
            </p>
          )}
        </div>
        <button
          type="button"
          className="cart-item__remove"
          onClick={onClickRemove}
          aria-label="Удалить"
        >
          ×
        </button>
      </div>
      <div className="cart-item__footer">
        <p className="cart-item__price">
          {cartItem.totalUnitPrice * cartItem.count} ₽
        </p>
        <button type="button" className="cart-item__edit" onClick={onClickEdit}>
          Изменить
        </button>
        <div className="cart-item__qty">
          <button
            type="button"
            className="cart-item__qty-btn"
            onClick={onMinus}
            disabled={cartItem.count <= 1}
          >
            −
          </button>
          <span className="cart-item__qty-num">{cartItem.count}</span>
          <button type="button" className="cart-item__qty-btn" onClick={onPlus}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
