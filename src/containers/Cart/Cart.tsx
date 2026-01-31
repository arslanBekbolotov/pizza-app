import React, { useCallback, useEffect, useState } from "react";
import {
  clearProducts,
  removeProducts,
  updateCartItem,
} from "../../redux/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import CartItem from "../../components/CartItem/CartItem";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { IGoodsMutation, IGoods } from "../../types";
import ItemOptionsModal, {
  AddToCartPayload,
} from "../../components/ItemOptionsModal/ItemOptionsModal";
import { axiosApi } from "../../axiosApi";
import { addProducts } from "../../redux/slices/cartSlice";

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items, totalPrice } = useAppSelector((state) => state.cart);
  const navigate = useNavigate();

  const [editingItem, setEditingItem] = useState<IGoodsMutation | null>(null);
  const [suggestions, setSuggestions] = useState<IGoods[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totalCount = items.reduce((acc, item) => acc + item.count, 0);

  const fetchSuggestions = useCallback(async () => {
    try {
      const response = await axiosApi<IGoods[]>("items?category=drinks");
      const drinks = Array.isArray(response.data) ? response.data : [];
      const snacksRes = await axiosApi<IGoods[]>("items?category=snacks");
      const snacks = Array.isArray(snacksRes.data) ? snacksRes.data : [];
      const all = [...drinks.slice(0, 3), ...snacks.slice(0, 2)];
      setSuggestions(all);
    } catch {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    void fetchSuggestions();
  }, [fetchSuggestions]);

  const onClickClear = () => {
    if (window.confirm("Очистить корзину?")) {
      dispatch(clearProducts());
    }
  };

  const onClickRemove = (cartItemKey: string) => {
    dispatch(removeProducts(cartItemKey));
  };

  const onClickEdit = (item: IGoodsMutation) => {
    setEditingItem(item);
  };

  const onSaveEdit = (payload: AddToCartPayload) => {
    if (!editingItem) return;
    dispatch(
      updateCartItem({
        oldKey: editingItem.cartItemKey,
        newItem: payload,
      }),
    );
    setEditingItem(null);
  };

  const onAddSuggestion = (dish: IGoods) => {
    dispatch(addProducts(dish));
  };

  const onPlaceOrder = () => {
    setOrderPlaced(true);
  };

  const closeOrderModal = () => {
    setOrderPlaced(false);
    dispatch(clearProducts());
    navigate("/");
  };

  const filteredSuggestions = suggestions.filter(
    (s) => !items.some((i) => i.id === s.id),
  );

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container">
        <div className="cart-empty">
          <div className="cart-empty__icon">
            <svg
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <h2 className="cart-empty__title">Корзина пуста</h2>
          <p className="cart-empty__text">
            Добавьте что-нибудь из меню, чтобы сделать заказ
          </p>
          <button
            type="button"
            className="cart-empty__btn"
            onClick={() => navigate("/")}
          >
            Перейти в меню
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-page">
        <div className="cart-page__header">
          <h1 className="cart-page__title">
            {totalCount} {totalCount === 1 ? "товар" : "товара"} на {totalPrice}{" "}
            ₽
          </h1>
          <button
            type="button"
            className="cart-page__clear"
            onClick={onClickClear}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M2.5 5H17.5M6.667 5V3.333a1.667 1.667 0 011.666-1.666h3.334a1.667 1.667 0 011.666 1.666V5m2.5 0v11.667a1.667 1.667 0 01-1.666 1.666H5.833a1.667 1.667 0 01-1.666-1.666V5h11.666z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Очистить
          </button>
        </div>

        <div className="cart-page__content">
          <div className="cart-page__items">
            {items.map((item) => (
              <CartItem
                key={item.cartItemKey}
                cartItem={item}
                onClickRemove={() => onClickRemove(item.cartItemKey)}
                onClickEdit={() => onClickEdit(item)}
              />
            ))}
          </div>

          {filteredSuggestions.length > 0 && (
            <div className="cart-suggestions">
              <h3 className="cart-suggestions__title">Добавить к заказу?</h3>
              <div className="cart-suggestions__list">
                {filteredSuggestions.map((s) => (
                  <div
                    key={s.id}
                    className="cart-suggestion"
                    onClick={() => onAddSuggestion(s)}
                  >
                    <img
                      className="cart-suggestion__img"
                      src={s.imageUrl}
                      alt={s.title}
                    />
                    <div className="cart-suggestion__info">
                      <p className="cart-suggestion__title">{s.title}</p>
                      <p className="cart-suggestion__price">от {s.price} ₽</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="cart-page__footer">
          <div className="cart-page__summary">
            <div className="cart-page__row">
              <span>{totalCount} товара</span>
              <span>{totalPrice} ₽</span>
            </div>
            <div className="cart-page__row">
              <span>Доставка</span>
              <span className="cart-page__free">Бесплатно</span>
            </div>
            <div className="cart-page__total">
              <span>Сумма заказа</span>
              <span>{totalPrice} ₽</span>
            </div>
          </div>
          <button
            type="button"
            className="cart-page__order-btn"
            onClick={onPlaceOrder}
          >
            Оформить заказ
          </button>
          <button
            type="button"
            className="cart-page__back-btn"
            onClick={() => navigate("/")}
          >
            Вернуться в меню
          </button>
        </div>
      </div>

      {editingItem && (
        <ItemOptionsModal
          dish={editingItem}
          onClose={() => setEditingItem(null)}
          onAddToCart={onSaveEdit}
        />
      )}

      {orderPlaced && (
        <div className="order-modal-overlay" onClick={closeOrderModal}>
          <div
            className="order-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="order-modal__icon">
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" fill="#4CAF50" />
                <path
                  d="M8 12l2.5 2.5L16 9"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="order-modal__title">Заказ принят!</h2>
            <p className="order-modal__text">
              Ваш заказ на сумму <strong>{totalPrice} ₽</strong> взят в работу.
              Ожидайте доставку в течение 30-60 минут.
            </p>
            <button
              type="button"
              className="order-modal__btn"
              onClick={closeOrderModal}
            >
              Отлично!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
