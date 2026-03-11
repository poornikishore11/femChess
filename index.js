import {
    createStore,
    compose,
    applyMiddleware,
    bindActionCreators
} from redux;

const initialState={value:0};
const INCREMENT = "counter/increment";
const ADD = 'ADD';
const incrementAction = {type:'INCREMENT'};
const increment = ()=> ({type:increment});
const add =(amount)=>({type:ADD, payload:amount});
const reducer=(state,action)=> {
    if(action.type === "INCREMENT"){
        return {state:state.value +1} ;
    }
    
}

const store = createStore(reducer);
console.log(store);