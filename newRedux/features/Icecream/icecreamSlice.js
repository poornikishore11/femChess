const { cakeActions } = require("../cake/cakeSlice");
const createSlice = require("@reduxjs/toolkit").createSlice;

const initialState = {
  numOfIcecream: 10,
};
const IcecreamSlice = createSlice({
  name: "cake",
  initialState,
  reducers: {
    ordered: (state) => {
      state.numOfIcecream--;
    },
    restocked: (state, action) => {
      state.numOfIcecream += action.payload;
    },
  },
  //   extraReducers: {
  //     ["cake/ordered"]: (state, action) => {
  //       state.numOfIcecream--;
  //     },
  //   },
  extraReducer: (builder) => {
    builder.addCase(cakeActions.ordered, (state) => {
      state.numOfIcecream--;
    });
  },
});

module.exports = IcecreamSlice.reducer;
module.exports.IcecreamActions = IcecreamSlice.actions;
