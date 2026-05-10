import { createSelector } from 'reselect';

const selectProductState = (state) => state.products;

export const selectProducts = createSelector(
  [selectProductState],
  (products) => products.items
);

export const selectProductsLoading = createSelector(
  [selectProductState],
  (products) => products.loading
);

export const selectProductsError = createSelector(
  [selectProductState],
  (products) => products.error
);

export const selectActiveFilters = createSelector(
  [selectProductState],
  (products) => products.activeFilters
);

export const selectFilteredProducts = createSelector(
  [selectProducts, selectActiveFilters],
  (products, filters) => {
    if (!filters.length) return products;
    return products.filter((product) =>
      filters.some((filter) =>
        product.tags?.includes(filter)
      )
    );
  }
);

export const selectProductForm = createSelector(
  [selectProductState],
  (products) => products.form
);

export const selectProductCreating = createSelector(
  [selectProductState],
  (products) => products.creating
);

export const selectProductCreateError = createSelector(
  [selectProductState],
  (products) => products.createError
);
