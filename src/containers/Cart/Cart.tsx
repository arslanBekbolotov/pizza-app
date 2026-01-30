import React from "react";
import { clearProducts, removeProducts } from "../../redux/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import CartItem from "../../components/CartItem/CartItem";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items, totalPrice } = useAppSelector((state) => state.cart);
  const navigate = useNavigate();

  const onClickClear = () => {
    dispatch(clearProducts());
  };

  const onClickRemove = (id: string) => {
    if (window.confirm("Ты действительно хочешь удалить товар")) {
      dispatch(removeProducts(id));
    }
  };

  return (
    <div>
      <main>
        <section className="order">
          <div className="container">
            <div className="order__top">
              <h2 className="order__title">Корзина</h2>
              <div onClick={onClickClear} className="cart__clear">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 5H4.16667H17.5"
                    stroke="#B6B6B6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M6.66663 5.00001V3.33334C6.66663 2.89131 6.84222 2.46739 7.15478 2.15483C7.46734 1.84227 7.89127 1.66667 8.33329 1.66667H11.6666C12.1087 1.66667 12.5326 1.84227 12.8451 2.15483C13.1577 2.46739 13.3333 2.89131 13.3333 3.33334V5.00001M15.8333 5.00001V16.6667C15.8333 17.1087 15.6577 17.5326 15.3451 17.8452C15.0326 18.1577 14.6087 18.3333 14.1666 18.3333H5.83329C5.39127 18.3333 4.96734 18.1577 4.65478 17.8452C4.34222 17.5326 4.16663 17.1087 4.16663 16.6667V5.00001H15.8333Z"
                    stroke="#B6B6B6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M8.33337 9.16667V14.1667"
                    stroke="#B6B6B6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M11.6666 9.16667V14.1667"
                    stroke="#B6B6B6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>

                <span className="clear__cart" onClick={onClickClear}>
                  Очистить корзину
                </span>
              </div>
            </div>
            <div className="order__list">
              <div className="list__wrapper">
                <span className="list__title">Состав заказа</span>
                <div className="list__items">
                  {items.map((item) => (
                    <CartItem
                      cartItem={item}
                      onClickRemove={() => onClickRemove(item.id)}
                    />
                  ))}
                </div>
                <div className="list__price">
                  <span className="list__pricetext">Стоимость заказа</span>
                  <div className="list__sum">{totalPrice} ₽</div>
                </div>
              </div>
            </div>
            <button
              className="btn--cart btn_back"
              onClick={() => {
                navigate("/");
              }}
            >
              Вернуться назад
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Cart;
