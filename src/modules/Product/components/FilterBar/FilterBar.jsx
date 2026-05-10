import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { useThemeContext } from '../../../../styles/ThemeContext';
import { rgba } from '../../../../styles/utils';

const availableFilters = ['Onetime', 'Recurring', 'Streaming', 'Sports', 'Premium', 'Basic', 'Live'];

const FilterBar = ({ activeFilters, onRemoveFilter, onAddFilter }) => {
  const { colors, fonts } = useThemeContext();
  const [showDropdown, setShowDropdown] = useState(false);

  const remainingFilters = availableFilters.filter((f) => !activeFilters.includes(f));

  const styles = {
    root: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' },
    chip: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 500,
      backgroundColor: colors.bgDark, color: colors.textOnDark,
      padding: '6px 12px', borderRadius: 20, height: 32,
    },
    chipClose: { cursor: 'pointer', fontSize: 14, color: colors.mutedTan, display: 'flex' },
    addBtnWrapper: { position: 'relative' },
    addBtn: {
      display: 'flex', alignItems: 'center', gap: 4,
      backgroundColor: 'transparent', border: `1.5px dashed ${colors.accentPrimary}`,
      color: colors.accentPrimary, fontFamily: fonts.body, fontSize: 'var(--text-base)',
      fontWeight: 600, cursor: 'pointer', padding: '6px 14px', borderRadius: 20,
    },
    dropdown: {
      position: 'absolute', top: '100%', left: 0, marginTop: 6,
      backgroundColor: colors.bgSurface, borderRadius: 10,
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: `1px solid ${colors.borderLight}`,
      minWidth: 160, padding: '6px 0', zIndex: 100,
    },
    dropdownItem: {
      display: 'block', width: '100%', padding: '8px 14px',
      fontFamily: fonts.body, fontSize: 'var(--text-base)', color: colors.textPrimary,
      backgroundColor: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer',
    },
  };

  return (
    <div style={styles.root} role="toolbar" aria-label="Product filters">
      {activeFilters.map((filter) => (
        <span key={filter} style={styles.chip}>
          {filter}
          <span style={styles.chipClose} onClick={() => onRemoveFilter(filter)} aria-label={`Remove ${filter}`}>
            <CloseIcon style={{ fontSize: 14 }} />
          </span>
        </span>
      ))}
      <div style={styles.addBtnWrapper}>
        <button style={styles.addBtn} onClick={() => setShowDropdown(!showDropdown)} aria-label="Add filters">
          <AddIcon style={{ fontSize: 18 }} /> Add Filters
        </button>
        {showDropdown && remainingFilters.length > 0 && (
          <div style={styles.dropdown}>
            {remainingFilters.map((filter) => (
              <button
                key={filter}
                style={styles.dropdownItem}
                onClick={() => {
                  onAddFilter(filter);
                  setShowDropdown(false);
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
