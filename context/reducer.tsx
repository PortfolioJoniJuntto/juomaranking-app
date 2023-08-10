export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        auth: action.payload,
      };
    case 'SET_USER_DETAILS':
      return {
        ...state,
        profile: {
          ...action.payload,
        },
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload,
        },
      };

    default:
      return state;
  }
};
