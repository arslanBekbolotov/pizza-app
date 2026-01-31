import React, { useState } from "react";
import Dish from "./Dish";
import { IGoods } from "../../types";
import { addProducts } from "../../redux/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import ItemOptionsModal, {
  AddToCartPayload,
} from "../ItemOptionsModal/ItemOptionsModal";

interface Props {
  title?: string;
  dishes: IGoods[];
}

const Dishes: React.FC<Props> = ({ dishes, title }) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const [modalDish, setModalDish] = useState<IGoods | null>(null);

  const findCount = (id: string) => {
    return cart.items
      .filter((item) => item.id === id)
      .reduce((sum, item) => sum + item.count, 0);
  };

  const onOpenModal = (dish: IGoods) => {
    setModalDish(dish);
  };

  const onAddToCart = (payload: AddToCartPayload) => {
    dispatch(addProducts(payload));
  };

  if (dishes.length === 0) {
    return (
      <section id="pizza" className="pizza">
        <div className="dishes-empty">
          <div className="dishes-empty__icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className="dishes-empty__title">Ничего не найдено</h2>
          <p className="dishes-empty__text">
            По вашему запросу блюд не найдено. Попробуйте изменить поиск или
            посмотрите другие разделы.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="pizza" className="pizza">
      <h2>{title}</h2>
      <div className={"grid__container"}>
        {dishes.map((dish) => (
          <Dish
            onClickAdd={() => onOpenModal(dish)}
            key={dish.id}
            dish={dish}
            count={findCount(dish.id)}
          />
        ))}
      </div>
      {modalDish && (
        <ItemOptionsModal
          dish={modalDish}
          onClose={() => setModalDish(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </section>
  );
};

export default Dishes;
