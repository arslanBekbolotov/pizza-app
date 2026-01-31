import React from "react";
import { IPopular } from "../../types";

interface Props {
  popular: IPopular;
}

const PopularItem: React.FC<Props> = ({ popular }) => {
  return (
    <div className="popular__item">
      <img src={popular.imageUrl} alt={popular.title} />
      <div>
        <p className="popular__pizza">{popular.title}</p>
        <p className="popular__price price">{popular.price} &#8381;</p>
      </div>
    </div>
  );
};

export default PopularItem;
