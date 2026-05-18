import React, { useState, useRef, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useThemeContext } from '../../../../styles/ThemeContext';
import { rgba } from '../../../../styles/utils';

/**
 * FormField component
 * 
 * Props:
 * - type: 'dropdown' | 'text' | 'add'
 * - inputType: (for type='add') 'text' | 'select' | 'date' | 'multiselect'
 * - options: array of options (for dropdown, select, multiselect)
 * - placeholder: placeholder text for inputs
 */
const FormField = ({ label, value, type, inputType = 'text', options, highlighted, placeholder, onChange }) => {
  const { colors, fonts, shadows } = useThemeContext();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSelectOpen(false);
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const styles = {
    root: { display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 36, marginRight: 20, marginBottom: 4, transition: 'all 0.25s ease', position: 'relative' },
    label: { fontFamily: fonts.body, fontSize: 'var(--text-base)', color: colors.textSecondary, whiteSpace: 'nowrap' },
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
      width: 28, height: 28, borderRadius: 6, border: `1.5px dashed ${colors.accentPrimary}`,
      backgroundColor: rgba(colors.accentPrimary, 0.04), cursor: 'pointer', color: colors.accentPrimary,
      transition: 'all 0.25s ease', transform: 'scale(1)',
    },
    menu: {
      position: 'absolute', top: '100%', left: 0, marginTop: 4,
      backgroundColor: colors.bgSurface, borderRadius: 8, boxShadow: shadows.lg,
      border: `1.5px solid ${colors.borderLight}`, zIndex: 1000, minWidth: 160, padding: '4px 0',
      maxHeight: 200, overflowY: 'auto',
    },
    menuItem: {
      display: 'block', width: '100%', padding: '8px 14px',
      fontFamily: fonts.body, fontSize: 'var(--text-base)', color: colors.textPrimary,
      backgroundColor: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer',
    },
    menuItemActive: {
      backgroundColor: rgba(colors.accentPrimary, 0.08), color: colors.accentPrimary,
    },
    // Input styles for 'add' type
    inputWrap: {
      display: 'inline-flex', alignItems: 'center', gap: 6, position: 'relative',
      animation: 'fadeSlideIn 0.2s ease forwards',
    },
    textInput: {
      fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 500,
      color: colors.textPrimary, padding: '5px 12px', borderRadius: 6,
      border: `1.5px solid ${colors.accentPrimary}`, outline: 'none',
      backgroundColor: rgba(colors.accentPrimary, 0.04),
      minWidth: 120, transition: 'border-color 0.2s',
    },
    dateInput: {
      fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 500,
      color: colors.textPrimary, padding: '5px 12px', borderRadius: 6,
      border: `1.5px solid ${colors.accentPrimary}`, outline: 'none',
      backgroundColor: rgba(colors.accentPrimary, 0.04),
      cursor: 'pointer',
    },
    selectBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 500,
      color: value ? colors.textPrimary : colors.textMuted,
      padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
      border: `1.5px solid ${colors.accentPrimary}`,
      backgroundColor: rgba(colors.accentPrimary, 0.04),
    },
    multiSelectWrap: {
      display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center',
    },
    multiChip: {
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 500,
      padding: '3px 8px', borderRadius: 12,
      backgroundColor: rgba(colors.accentPrimary, 0.1), color: colors.accentPrimary,
      border: `1px solid ${rgba(colors.accentPrimary, 0.2)}`,
    },
    multiChipClose: { cursor: 'pointer', display: 'flex', fontSize: 12 },
    valueDisplay: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 500,
      color: colors.textPrimary, padding: '5px 12px', borderRadius: 6,
      backgroundColor: rgba(colors.accentPrimary, 0.06),
      border: `1px solid ${rgba(colors.accentPrimary, 0.15)}`,
      cursor: 'pointer', transition: 'all 0.2s ease',
      animation: 'fadeSlideIn 0.2s ease forwards',
    },
    editIcon: { color: colors.textMuted, fontSize: 14, cursor: 'pointer' },
  };

  const handleAddClick = () => {
    setEditing(true);
    if (inputType === 'select' || inputType === 'multiselect') {
      setSelectOpen(true);
    }
  };

  const handleTextSubmit = (e) => {
    if (e.key === 'Enter') {
      setEditing(false);
    }
  };

  const handleTextBlur = () => {
    setEditing(false);
  };

  const handleSelectOption = (opt) => {
    onChange(opt);
    setSelectOpen(false);
    setEditing(false);
  };

  const handleMultiSelectOption = (opt) => {
    const currentValues = value ? value.split(',').map((v) => v.trim()).filter(Boolean) : [];
    if (currentValues.includes(opt)) {
      const newValues = currentValues.filter((v) => v !== opt);
      onChange(newValues.join(', '));
    } else {
      onChange([...currentValues, opt].join(', '));
    }
  };

  const removeMultiValue = (opt) => {
    const currentValues = value ? value.split(',').map((v) => v.trim()).filter(Boolean) : [];
    onChange(currentValues.filter((v) => v !== opt).join(', '));
  };

  const renderAddField = () => {
    // If has value and not editing, show the value with click-to-edit
    if (value && !editing) {
      if (inputType === 'multiselect') {
        const values = value.split(',').map((v) => v.trim()).filter(Boolean);
        return (
          <div style={styles.multiSelectWrap}>
            {values.map((v) => (
              <span key={v} style={styles.multiChip}>
                {v}
                <span style={styles.multiChipClose} onClick={() => removeMultiValue(v)}>
                  <CloseIcon style={{ fontSize: 12 }} />
                </span>
              </span>
            ))}
            <button style={{ ...styles.addBtn, width: 22, height: 22 }} onClick={handleAddClick} aria-label={`Edit ${label}`}>
              <AddIcon style={{ fontSize: 14 }} />
            </button>
          </div>
        );
      }
      return (
        <span style={styles.valueDisplay} onClick={() => setEditing(true)}>
          {value}
        </span>
      );
    }

    // If no value and not editing, show the plus button
    if (!editing) {
      return (
        <button style={styles.addBtn} onClick={handleAddClick} aria-label={`Add ${label}`}>
          <AddIcon style={{ fontSize: 16 }} />
        </button>
      );
    }

    // Editing state — render appropriate input
    switch (inputType) {
      case 'date':
        return (
          <div style={styles.inputWrap}>
            <input
              ref={inputRef}
              type="date"
              style={styles.dateInput}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              onBlur={handleTextBlur}
            />
          </div>
        );

      case 'select':
        return (
          <div style={styles.inputWrap} ref={wrapperRef}>
            <button style={styles.selectBtn} onClick={() => setSelectOpen(!selectOpen)}>
              {value || placeholder || 'Select...'} <ArrowDropDownIcon style={{ fontSize: 16 }} />
            </button>
            {selectOpen && options && (
              <div style={styles.menu}>
                {options.map((opt) => (
                  <button key={opt} style={styles.menuItem} onClick={() => handleSelectOption(opt)}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 'multiselect':
        const currentValues = value ? value.split(',').map((v) => v.trim()).filter(Boolean) : [];
        return (
          <div style={styles.inputWrap} ref={wrapperRef}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={styles.multiSelectWrap}>
                {currentValues.map((v) => (
                  <span key={v} style={styles.multiChip}>
                    {v}
                    <span style={styles.multiChipClose} onClick={() => removeMultiValue(v)}>
                      <CloseIcon style={{ fontSize: 12 }} />
                    </span>
                  </span>
                ))}
                <button style={styles.selectBtn} onClick={() => setSelectOpen(!selectOpen)}>
                  <AddIcon style={{ fontSize: 14 }} /> Add
                </button>
              </div>
              {selectOpen && options && (
                <div style={{ ...styles.menu, position: 'relative', marginTop: 0 }}>
                  {options.map((opt) => (
                    <button
                      key={opt}
                      style={{ ...styles.menuItem, ...(currentValues.includes(opt) ? styles.menuItemActive : {}) }}
                      onClick={() => handleMultiSelectOption(opt)}
                    >
                      {currentValues.includes(opt) ? '✓ ' : ''}{opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'text':
      default:
        return (
          <div style={styles.inputWrap}>
            <input
              ref={inputRef}
              type="text"
              style={styles.textInput}
              value={value || ''}
              placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleTextSubmit}
              onBlur={handleTextBlur}
            />
          </div>
        );

      case 'currency':
        return (
          <div style={styles.inputWrap}>
            <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 600, color: colors.accentPrimary }}>$</span>
            <input
              ref={inputRef}
              type="number"
              step="0.01"
              style={{ ...styles.textInput, minWidth: 100 }}
              value={value || ''}
              placeholder={placeholder || '0.00'}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleTextSubmit}
              onBlur={handleTextBlur}
            />
          </div>
        );
    }
  };

  const renderValue = () => {
    switch (type) {
      case 'dropdown':
        return (
          <div style={{ position: 'relative' }} ref={wrapperRef}>
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
        return renderAddField();
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
