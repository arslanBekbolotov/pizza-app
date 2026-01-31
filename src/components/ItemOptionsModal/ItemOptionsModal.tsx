import React, { useEffect, useMemo, useState } from "react";
import {
  IGoods,
  ISizeOption,
  IDoughOption,
  IAddOnIngredient,
} from "../../types";
import "./ItemOptionsModal.css";

export interface ItemOptionsModalProps {
  dish: IGoods | null;
  onClose: () => void;
  onAddToCart: (payload: AddToCartPayload) => void;
}

export interface AddToCartPayload extends IGoods {
  selectedSize?: ISizeOption;
  selectedDough?: IDoughOption;
  addedIngredients?: IAddOnIngredient[];
}

const ItemOptionsModal: React.FC<ItemOptionsModalProps> = ({
  dish,
  onClose,
  onAddToCart,
}) => {
  const hasSizes = dish?.sizes && dish.sizes.length > 0;
  const hasDough = dish?.doughTypes && dish.doughTypes.length > 0;
  const isDrink = dish?.category === "drinks" || dish?.category === "напитки";

  const [selectedSize, setSelectedSize] = useState<ISizeOption | undefined>(
    () => dish?.sizes?.[0],
  );
  const [selectedDough, setSelectedDough] = useState<IDoughOption | undefined>(
    () => dish?.doughTypes?.[0],
  );
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (dish) {
      setSelectedSize(dish.sizes?.[0]);
      setSelectedDough(dish.doughTypes?.[0]);
      setAddedIds(new Set());
    }
  }, [dish]);

  useEffect(() => {
    if (dish) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [dish]);

  const totalPrice = useMemo(() => {
    if (!dish) return 0;
    const base = dish.price;
    const sizeMod = selectedSize?.priceModifier ?? 0;
    const addOns =
      dish.addOnIngredients?.filter((i) => addedIds.has(i.id)) ?? [];
    const addOnsSum = addOns.reduce((s, i) => s + i.price, 0);
    return base + sizeMod + addOnsSum;
  }, [dish, selectedSize, addedIds]);

  const toggleAddOn = (id: string) => {
    setAddedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!dish) return;
    onAddToCart({
      ...dish,
      selectedSize: hasSizes ? selectedSize : undefined,
      selectedDough: hasDough ? selectedDough : undefined,
      addedIngredients: dish.addOnIngredients?.filter((i) =>
        addedIds.has(i.id),
      ),
    });
    onClose();
  };

  if (!dish) return null;

  const descriptionParts: string[] = [];
  if (selectedSize?.description)
    descriptionParts.push(selectedSize.description);
  else if (selectedSize) descriptionParts.push(selectedSize.label);
  if (selectedDough) descriptionParts.push(selectedDough.label);
  const descriptionLine =
    descriptionParts.length > 0
      ? descriptionParts.join(", ") +
        (dish.description ? `, ${dish.description}` : "")
      : dish.description;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <div className="modal__body">
          <div className="modal__image-wrap">
            <img src={dish.imageUrl} alt={dish.title} />
          </div>

          <div className="modal__content">
            <div className="modal__header">
              <h2 id="modal-title" className="modal__title">
                {dish.title}
              </h2>
              <span className="modal__info" title="Информация" aria-hidden>
                i
              </span>
            </div>

            {descriptionLine && (
              <p className="modal__description">{descriptionLine}</p>
            )}

            {!isDrink &&
              dish.baseIngredients &&
              dish.baseIngredients.length > 0 && (
                <div className="modal__base-ingredients">
                  {dish.baseIngredients.map((name, idx) => (
                    <span key={idx} className="modal__base-tag">
                      {name}
                      <span className="modal__base-tag-x" aria-hidden>
                        ×
                      </span>
                    </span>
                  ))}
                </div>
              )}

            {!isDrink && hasSizes && (
              <div className="modal__options">
                <span className="modal__options-label">Размер</span>
                <div className="modal__pills">
                  {dish.sizes!.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`modal__pill ${selectedSize?.id === s.id ? "modal__pill_active" : ""}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isDrink && hasDough && (
              <div className="modal__options">
                <span className="modal__options-label">Тесто</span>
                <div className="modal__pills">
                  {dish.doughTypes!.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className={`modal__pill ${selectedDough?.id === d.id ? "modal__pill_active" : ""}`}
                      onClick={() => setSelectedDough(d)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isDrink &&
              dish.addOnIngredients &&
              dish.addOnIngredients.length > 0 && (
                <div className="modal__addons">
                  <h3 className="modal__addons-title">Добавить по вкусу</h3>
                  <div className="modal__addons-grid">
                    {dish.addOnIngredients.map((ing) => (
                      <button
                        key={ing.id}
                        type="button"
                        className={`modal__addon-card ${addedIds.has(ing.id) ? "modal__addon-card_selected" : ""}`}
                        onClick={() => toggleAddOn(ing.id)}
                      >
                        {addedIds.has(ing.id) && (
                          <span className="modal__addon-check" aria-hidden>
                            ✓
                          </span>
                        )}
                        {ing.imageUrl ? (
                          <img src={ing.imageUrl} alt="" />
                        ) : (
                          <span className="modal__addon-placeholder" />
                        )}
                        <span className="modal__addon-name">{ing.title}</span>
                        <span className="modal__addon-price">
                          {ing.price} ₽
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            <div className="modal__footer">
              <button
                type="button"
                className="modal__add-btn"
                onClick={handleAddToCart}
              >
                В корзину за {totalPrice} ₽
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemOptionsModal;
