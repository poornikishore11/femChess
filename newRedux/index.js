const store = require("./app/store");
const cakeActions = require("./features/cake/cakeSlice").cakeActions;
const icecreamActions =
  require("./features/Icecream/icecreamSlice").cakeActions;
const fetchUsers = require("./features/user/userSlice").fetchUsers;

console.log("Initial State", store.getState());
const unsubscribe = store.subscribe(() => {
  //console.log("Updated state", store.getState());
});
store.dispatch(fetchUsers());
store.dispatch(cakeActions.ordered());
store.dispatch(cakeActions.restocked(1));
store.dispatch(icecreamActions.ordered());
store.dispatch(icecreamActions.restocked(1));

unsubscribe();
