import React from "react";
import { IGoods } from "../../types";

interface Props {
  dish: IGoods;
  onClickAdd: React.MouseEventHandler;
  count: number;
}

const Dish: React.FC<Props> = ({ dish, onClickAdd, count }) => {
  return (
    <div className="grid__elem">
      <img src={dish.imageUrl} alt={dish.title} />
      <div className="grid__elem_info">
        <h3>{dish.title}</h3>
        <p>{dish.description}</p>
      </div>
      <div className="grid__elem_bottom">
        <p className="price">{dish.price}₽</p>
        <div className="button_orange js-modalButton">
          <button onClick={onClickAdd}>
            {dish.buttonLabel}{" "}
            {count > 0 && <span className="button_orange__span">{count}</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dish;
