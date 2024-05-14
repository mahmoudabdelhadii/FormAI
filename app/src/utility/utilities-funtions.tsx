import { Dimensions } from "react-native";

export const calcWidth = (size) => size * Dimensions.get("window").width;
export const calcHeight = (size) => size * Dimensions.get("window").height;

export const getFocusedRouteNameFromState = (state) => {
  if (!state || !state.routes || state.routes.length === 0) {
    return null;
  }

  const route = state.routes[state.index];

  // Dive into nested navigators if there are any
  if (route.state) {
    return getFocusedRouteNameFromState(route.state);
  }

  return route.name;
};
