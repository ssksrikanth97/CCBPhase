import { createSelector } from 'reselect';

const selectPromotionState = (state) => state.promotions;

export const selectPromotions = createSelector(
  [selectPromotionState],
  (promotions) => promotions.items
);

export const selectPromotionsLoading = createSelector(
  [selectPromotionState],
  (promotions) => promotions.loading
);

export const selectPromotionsError = createSelector(
  [selectPromotionState],
  (promotions) => promotions.error
);

export const selectPromotionFilters = createSelector(
  [selectPromotionState],
  (promotions) => promotions.activeFilters
);

export const selectFilteredPromotions = createSelector(
  [selectPromotions, selectPromotionFilters],
  (promotions, filters) => {
    if (!filters.length) return promotions;
    return promotions.filter((promo) =>
      filters.some((filter) =>
        promo.tags?.includes(filter)
      )
    );
  }
);

export const selectPromotionForm = createSelector(
  [selectPromotionState],
  (promotions) => promotions.form
);

export const selectPromotionCreating = createSelector(
  [selectPromotionState],
  (promotions) => promotions.creating
);
