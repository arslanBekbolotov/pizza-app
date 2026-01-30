import React from "react";
import Dish from "./Dish";
import { IGoods } from "../../types";
import { addProducts } from "../../redux/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";

interface Props {
  title?: string;
  dishes: IGoods[];
}

const Dishes: React.FC<Props> = ({ dishes, title }) => {
  const dispatch = useAppDispatch();
  const { filter, cart } = useAppSelector((state) => state);

  const findCount = (id: string) => {
    const findId = cart.items.find((item) => item.id === id);

    if (findId) {
      return findId.count;
    }

    return 0;
  };

  const onClickAdd = (dish: IGoods) => {
    dispatch(addProducts(dish));
  };

  return (
    <section id="pizza" className="pizza">
        <h2>{filter.searchValue || title}</h2>
        <div className={"grid__container"}>
          {dishes.map((dish) => (
            <Dish
              onClickAdd={() => onClickAdd(dish)}
              key={dish.id}
              dish={dish}
              count={findCount(dish.id)}
            />
          ))}
        </div>
    </section>
  );
};

export default Dishes;
