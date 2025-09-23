export default {
  control: {
    backgroundColor: 'transparent',
    fontSize: 14,
    fontWeight: 'normal',
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
  },

  '&multiLine': {
    control: {
      fontFamily: 'inherit',
      minHeight: 32,
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
    },
    highlighter: {
      padding: 12,
      border: 'none',
      outline: 'none',
    },
    input: {
      padding: 12,
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      fontFamily: 'inherit',
      fontSize: 14,
      resize: 'none',
      '&:focus': {
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
      },
    },
  },

  '&singleLine': {
    display: 'inline-block',
    width: '100%',

    highlighter: {
      padding: 12,
      border: 'none',
      outline: 'none',
    },
    input: {
      padding: 12,
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      '&:focus': {
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
      },
    },
  },

  suggestions: {
    borderRadius: 12,
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.1)',
      borderRadius: 8,
      fontSize: 14,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      maxHeight: 300,
      overflow: 'auto',
      zIndex: 9999,
      width: 300,
    },
    item: {
      // padding: 0,
      border: 'none',
      margin: 0,
      '&focused': {
        backgroundColor: 'transparent',
      },
    },
  },
};
