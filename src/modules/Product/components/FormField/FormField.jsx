import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useThemeContext } from '../../../../styles/ThemeContext';
import { rgba } from '../../../../styles/utils';

const FormField = ({ label, value, type, options, highlighted, onChange }) => {
  const { colors, fonts, shadows } = useThemeContext();
  const [open, setOpen] = useState(false);

  const styles = {
    root: { display: 'flex', alignItems: 'center', gap: 12, minHeight: 32 },
    label: { fontFamily: fonts.body, fontSize: 'var(--text-base)', color: colors.textSecondary, minWidth: 120, flexShrink: 0 },
    dropdown: {
      display: 'inline-flex', alignItems: 'center', gap: 4,
      backgroundColor: rgba(colors.accentSecondary, 0.12), color: colors.accentSecondaryDark,
      fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 500,
      padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
      border: `1px solid ${rgba(colors.accentSecondary, 0.3)}`, position: 'relative',
    },
    textValue: { fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 500, color: colors.textPrimary, padding: '5px 12px', borderRadius: 6 },
    textHighlighted: { backgroundColor: rgba(colors.accentPrimary, 0.08), color: colors.accentPrimary, border: `1px solid ${rgba(colors.accentPrimary, 0.2)}` },
    addBtn: {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 26, height: 26, borderRadius: 6, border: `1.5px dashed ${colors.mutedTan}`,
      backgroundColor: 'transparent', cursor: 'pointer', color: colors.textSecondary,
    },
    menu: {
      position: 'absolute', top: '100%', left: 0, marginTop: 4,
      backgroundColor: colors.bgSurface, borderRadius: 8, boxShadow: shadows.lg,
      border: `1.5px solid ${colors.borderLight}`, zIndex: 100, minWidth: 160, padding: '4px 0',
    },
    menuItem: {
      display: 'block', width: '100%', padding: '8px 14px',
      fontFamily: fonts.body, fontSize: 'var(--text-base)', color: colors.textPrimary,
      backgroundColor: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer',
    },
  };

  const renderValue = () => {
    switch (type) {
      case 'dropdown':
        return (
          <div style={{ position: 'relative' }}>
            <button style={styles.dropdown} onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}>
              {value} <ArrowDropDownIcon style={{ fontSize: 16, color: colors.accentSecondaryDark }} />
            </button>
            {open && (
              <div style={styles.menu} role="listbox">
                {options.map((opt) => (
                  <button key={opt} style={styles.menuItem} role="option" onClick={() => { onChange(opt); setOpen(false); }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      case 'text':
        return <span style={{ ...styles.textValue, ...(highlighted ? styles.textHighlighted : {}) }}>{value}</span>;
      case 'add':
        return value ? (
          <span style={styles.textValue}>{value}</span>
        ) : (
          <button style={styles.addBtn} onClick={() => onChange('')} aria-label={`Add ${label}`}>
            <AddIcon style={{ fontSize: 16 }} />
          </button>
        );
      default:
        return <span style={styles.textValue}>{value}</span>;
    }
  };

  return (
    <div style={styles.root}>
      <label style={styles.label}>{label}:</label>
      {renderValue()}
    </div>
  );
};

export default FormField;
