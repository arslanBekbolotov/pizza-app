import React, { useCallback, useEffect, useState } from "react";
import { axiosApi } from "../../axiosApi";
import { IGoods, IPopular } from "../../types";
import Popular from "../../components/Popular/Popular";
import Dishes from "../../components/Dishes/Dishes";
import Skeleton from "../../components/Skeleton/Skeleton";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Home = () => {
  const [dishes, setDishes] = useState<IGoods[]>([]);
  const [popularDishes, setPopularDishes] = useState<IPopular[]>([]);
  const [loading, setLoading] = useState(false);
  const searchValue = useSelector(
    (state: RootState) => state.filter.searchValue,
  );

  const search = searchValue ? `search=${searchValue}` : "";

  const fetchData = useCallback(async (search: string) => {
    try {
      setLoading(true);
      const response = await axiosApi<IGoods[]>(`items?${search}`);
      const data = response.data;
      setDishes(Array.isArray(data) ? data : []);
    } catch {
      setDishes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPopularDishes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosApi<IPopular[]>(`elements`);
      const data = response.data;
      setPopularDishes(Array.isArray(data) ? data : []);
    } catch {
      setPopularDishes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData(search);
    void getPopularDishes();
  }, [fetchData, getPopularDishes, search]);

  return (
    <div className="container">
      {!loading && dishes ? (
        <>
          {searchValue.length < 2 && <Popular popularList={popularDishes} />}
          <Dishes dishes={dishes} title={"All"} />
        </>
      ) : (
        <div className="grid__container">
          {[...new Array(8)].map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
