import { createSelector } from 'reselect';

const selectBundleState = (state) => state.bundles;

export const selectBundles = createSelector(
  [selectBundleState],
  (bundles) => bundles.items
);

export const selectBundlesLoading = createSelector(
  [selectBundleState],
  (bundles) => bundles.loading
);

export const selectBundlesError = createSelector(
  [selectBundleState],
  (bundles) => bundles.error
);

export const selectBundleFilters = createSelector(
  [selectBundleState],
  (bundles) => bundles.activeFilters
);

export const selectFilteredBundles = createSelector(
  [selectBundles, selectBundleFilters],
  (bundles, filters) => {
    if (!filters.length) return bundles;
    return bundles.filter((bundle) =>
      filters.some((filter) =>
        bundle.tags?.includes(filter)
      )
    );
  }
);

export const selectBundleForm = createSelector(
  [selectBundleState],
  (bundles) => bundles.form
);

export const selectBundleCreating = createSelector(
  [selectBundleState],
  (bundles) => bundles.creating
);
