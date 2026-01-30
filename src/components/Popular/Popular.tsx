import React from "react";
import PopularItem from "./PopularItem";
import "./Popular.css";
import { IPopular } from "../../types";

interface Props {
  popularList: IPopular[];
}

const Popular: React.FC<Props> = ({ popularList }) => {
  return (
    <section className="new">
      <h2>Новое и популярное</h2>
      <div className="popular grid__container">
        {popularList.map((item) => (
          <PopularItem key={item.id} popular={item} />
        ))}
      </div>
    </section>
  );
};

export default Popular;
