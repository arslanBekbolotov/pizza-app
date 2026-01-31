import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IGoods } from "../../types";
import { axiosApi } from "../../axiosApi";
import Skeleton from "../../components/Skeleton/Skeleton";
import Dishes from "../../components/Dishes/Dishes";
import { useAppSelector } from "../../redux/hooks/hooks";

const Categories = () => {
  const { category } = useParams();
  const [dishes, setDishes] = useState<IGoods[]>([]);
  const [loading, setLoading] = useState(false);
  const searchValue = useAppSelector((state) => state.filter.searchValue);

  const fetchData = useCallback(
    async (category: string, _searchValue: string) => {
      try {
        setLoading(true);
        const response = await axiosApi<IGoods[]>(`items?category=${category}`);
        const data = response.data;
        setDishes(Array.isArray(data) ? data : []);
      } catch {
        setDishes([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (category) void fetchData(category, searchValue);
  }, [category, fetchData, searchValue]);

  return (
    <div className="container">
      {loading ? (
        <div className="grid__container">
          {[...new Array(8)].map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      ) : (
        <div>
          {dishes && category && (
            <Dishes
              dishes={dishes}
              title={category.charAt(0).toUpperCase() + category.slice(1)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;
