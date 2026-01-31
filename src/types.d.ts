/** Опция размера (не для всех блюд) */
export interface ISizeOption {
  id: string;
  label: string;
  priceModifier: number;
  description?: string;
}

/** Опция теста (для пицц) */
export interface IDoughOption {
  id: string;
  label: string;
}

/** Добавляемый ингредиент */
export interface IAddOnIngredient {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
}

export interface IGoods {
  id: string;
  title: string;
  description: string;
  price: number;
  buttonLabel: string;
  imageUrl: string;
  /** Категория (напитки и т.д. — без размеров/ингредиентов) */
  category?: string;
  /** Доступные размеры (если нет — блок размера не показываем) */
  sizes?: ISizeOption[];
  /** Ингредиенты, уже входящие в блюдо (отображаются первыми, без цены) */
  baseIngredients?: string[];
  /** Ингредиенты "добавить по вкусу" (с ценой) */
  addOnIngredients?: IAddOnIngredient[];
  /** Варианты теста (для пицц) */
  doughTypes?: IDoughOption[];
}

export interface IPopular {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

/** Элемент корзины с опциями и уникальным ключом */
export interface IGoodsMutation extends IGoods {
  count: number;
  /** Уникальный ключ позиции в корзине (id + выбранные опции) */
  cartItemKey: string;
  /** Итоговая цена за единицу (базовая + размер + добавки) */
  totalUnitPrice: number;
  selectedSize?: ISizeOption;
  selectedDough?: IDoughOption;
  addedIngredients?: IAddOnIngredient[];
}
