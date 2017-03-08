//1.redux是什么：可理解成一个库，强调flux类似的思想。
//Redux 并不一定要搭配 React 使用。Redux 纯粹只是一个状态管理库，几乎可以搭配任何框架使用




//2.核心API(store对象的API):getState()获取store当前状态。
//dispatch(action)分发一个action并返回此action唯一改变store数据的方式。
//subscribe(Listener)：注册一个监听者，在store发生变化时被调用
//replaceReducer(nextReducer)更新store里面的reducer。

//3.三大原则：单一数据源，状态只读，状态修改均由纯函数完成。

//4.与react绑定:
//             顶层组件Provider，接受store作为props。
//              connect()提供了在整个React应用的任意组件获取store中数据的功能。


//操作过程：
//actionCreator 返回action。
//dispatch(action) =>调用reducer(initState,action)修改状态。
//
//用户每次 dispatch(action) 后，都会触发 reducer 的执行
// reducer 的实质是一个函数，根据 action.type 来更新 state 并返回 nextState
// 最后会用 reducer 的返回值 nextState 完全替换掉原来的 state
// 
// 总结：
// store [object] 由 Redux 的 createStore(reducer) 生成
// state [object] 通过 store.getState() 获取，本质上一般是一个存储着整个应用状态的对象
// action [object] 本质上是一个包含 type 属性的普通对象，由 Action Creator (函数) 产生
// 改变 state 必须 dispatch 一个 action
// reducer [function]本质上是根据 action.type 来更新 state 并返回 nextState 的 函数
// reducer 必须返回值，否则 nextState 即为 undefined
// 实际上，state 就是所有 reducer 返回值的汇总

//actionCreator:
var id = 1
function addTodo(content) {
  return {
    type: 'ADD_TODO',
    payload: {
      id: id++,
      content: content, // 待办事项内容
      completed: false  // 是否完成的标识
    }
  }
}

//reducer
var initState = {
  counter: 0,
  todos: []
}

function reducer(state, action) {
  // ※ 应用的初始状态是在第一次执行 reducer 时设置的 ※
  if (!state) state = initState

  switch (action.type) {
    case 'ADD_TODO':
      var nextState = _.cloneDeep(state) // 用到了 lodash 的深克隆
      nextState.todos.push(action.payload) 
      return nextState

    default:
    // 由于 nextState 会把原 state 整个替换掉
    // 若无修改，必须返回原 state（否则就是 undefined）
      return state
  }
}

//********combineReducers(reducers)
//合并reducers合成一个大的reducer。
//
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers)
  var finalReducers = {}

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i]
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }

  var finalReducerKeys = Object.keys(finalReducers)

  // 返回合成后的 reducer
  return function combination(state = {}, action) {
    var hasChanged = false
    var nextState = {}
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i]
      var reducer = finalReducers[key]
      var previousStateForKey = state[key]                       // 获取当前子 state
      var nextStateForKey = reducer(previousStateForKey, action) // 执行各子 reducer 中获取子 nextState
      nextState[key] = nextStateForKey                           // 将子 nextState 挂载到对应的键名
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    return hasChanged ? nextState : state
  }
}

/******compose*****
 * 看起来逼格很高，实际运用其实是这样子的：
 * compose(f, g, h)(...arg) => f(g(h(...args)))
 *
 * 值得注意的是，它用到了 reduceRight，因此执行顺序是从右到左
 *
 * @param  {多个函数，用逗号隔开}
 * @return {函数}
 */

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  const last = funcs[funcs.length - 1]
  const rest = funcs.slice(0, -1)
  return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))
}

//reduceRight可以传入初始值。这里last(...args)是初始值。
//
//
//******** dispatch
 function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(
        'Actions must be plain objects. ' +
        'Use custom middleware for async actions.'
      )
    }

    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      )
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      isDispatching = true
      // 关键点：currentState 与 action 会流通到--所有的--- reducer
      // 所有 reducer 的返回值整合后，替换掉当前的 currentState
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    // 令 currentListeners 等于 nextListeners，表示正在逐个执行回调函数（这就是上面 ensure 哥的判定条件）
    var listeners = currentListeners = nextListeners

    // 逐个触发回调函数
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]()

      /* 现在逐个触发回调函数变成了：
      var listener = listeners[i]
      listener() // 该中间变量避免了 this 指向 listeners 而造成泄露的问题 */
    }

    return action // 为了方便链式调用，dispatch 执行完毕后，返回 action（下文会提到的，稍微记住就好了）
  }


  //这里dispatch,subscribe,getState,replaceReducer当作对象返回，组成一个store
  //调用createStore(reducer, preloadedState, enhancer)得到的store为
    return {
          dispatch,
          subscribe,
          getState,
          replaceReducer,
          [$$observable]: observable
        }

//********************* bindActionCreators
  bindActionCreators(actionCreators, dispatch)
//这个 API 有点鸡肋，它无非就是做了这件事情：dispatch(ActionCreator(XXX))有多个actionCreator时利用
//此API自动dispatch避免繁琐。
//
//
//
//**************中间件写法 Middleware (为增强dispatch)
//说白了，Redux 引入中间件机制，其实就是为了在 dispatch 前后，统一“做爱做的事”。。。
// 诸如统一的日志记录、引入 thunk 统一处理异步 Action Creator 等都属于中间件
// 下面是一个简单的打印动作前后 state 的中间件：
//* 装逼写法 */
const printStateMiddleware = ({ getState }) => next => action => {
  console.log('state before dispatch', getState())

  let returnValue = next(action)

  console.log('state after dispatch', getState())

  return returnValue
}

-------------------------------------------------

/* 降低逼格写法 */
function printStateMiddleware(middlewareAPI) { // 记为【锚点-1】，中间件内可用的 API
  return function (dispatch) {                 // 记为【锚点-2】，传入上级中间件处理逻辑（若无则为原 store.dispatch）

    // 下面记为【锚点-3】，整个函数将会被传到下级中间件（如果有的话）作为它的 dispatch 参数
    return function (action) { // <---------------------------------------------- 这货就叫做【中间件处理逻辑哥】吧
      console.log('state before dispatch', middlewareAPI.getState())

      var returnValue = dispatch(action) // 还记得吗，dispatch 的返回值其实还是 action

      console.log('state after dispatch', middlewareAPI.getState())

      return returnValue // 继续传给下一个中间件作为参数 action
    }
  }
}

//Store Enhancer 和中间件的区别**************************************************************
//说白了，Store 增强器就是对生成的 store API 进行改造，这是它与中间件最大的区别（中间件不修改 store 的 API）
// 而改造 store 的 API 就要从它的缔造者 createStore 入手。例如，Redux 的 API applyMiddleware 就是一个 Store 增强器：
// 
// import compose from './compose' // 这货的作用其实就是 compose(f, g, h)(action) => f(g(h(action)))

/* 传入一坨中间件 */
export default function applyMiddleware(...middlewares) {

  /* 传入 createStore */
  return function(createStore) {

    /* 返回一个函数签名跟 createStore 一模一样的函数，亦即返回的是一个增强版的 createStore */
    return function(reducer, preloadedState, enhancer) {

      // 用原 createStore 先生成一个 store，其包含 getState / dispatch / subscribe / replaceReducer 四个 API
      var store = createStore(reducer, preloadedState, enhancer)

      var dispatch = store.dispatch // 指向原 dispatch
      var chain = [] // 存储中间件的数组

      // 提供给中间件的 API（其实都是 store 的 API）
      var middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action)
      }

      // 给中间件“装上” API，见上面 ⊙Middleware【降低逼格写法】的【锚点-1】 
      chain = middlewares.map(middleware => middleware(middlewareAPI))

      // 串联所有中间件
      dispatch = compose(...chain)(store.dispatch)
      // 例如，chain 为 [M3, M2, M1]，而 compose 是从右到左进行“包裹”的
      // 那么，M1 的 dispatch 参数为 store.dispatch（见【降低逼格写法】的【锚点-2】）
      // 往后，M2 的 dispatch 参数为 M1 的中间件处理逻辑哥（见【降低逼格写法】的【锚点-3】）
      // 同样，M3 的 dispatch 参数为 M2 的中间件处理逻辑哥
      // 最后，我们得到串联后的中间件链：M3(M2(M1(store.dispatch)))
      //（这种形式的串联类似于洋葱，可参考文末的拓展阅读：中间件的洋葱模型）
      // 在此衷心感谢 @ibufu 在 issue8 中指出之前我对此处的错误解读

      return {
        ...store, // store 的 API 中保留 getState / subsribe / replaceReducer
        dispatch  // 新 dispatch 覆盖原 dispatch，往后调用 dispatch 就会触发 chain 内的中间件链式串联执行
      }
    }
  }
}
// 最终返回的虽然还是 store 的那四个 API，但其中的 dispatch 函数的功能被增强了，这就是所谓的 Store Enhancer
// 
// 
// 
// *********************异步中间件源码及实例解析。****************
// 源码：
 function createThunkMiddleWare(extraArgs) {
   reutrn ({dispatch,getState})=>next=>action=>{
    if(typeof action === 'function'){
      return action(dispatch,getState,extraArgs);
    }
   }
 }

const ThunkMiddleWare = createThunkMiddleWare();//Thunkmiddleware实例。
const store = createStore(
  rootReducer,
  applyMiddleware(ThunkMiddleWare)
); //增强的store。

//解释。因为调用了ThunkMiddleWare的中间件，故基础的dipatch被增强。
//经过第一层调用，变成
let func = next=>action=>{
    if(typeof action === 'function'){
      return action(dispatch,getState,extraArgs);
    }
    return next(action);
   }
//chain数组里面的函数为[func]
//如果好几个func就调用func1(func2(fuc3(store.dispatch)))
//这里就是fuc(store.dispatch)，返回 
FinalDispatch = fuction (action){
           if(typeof action === 'function'){
                return action(dispatch,getState,extraArgs);
              }
                    return next(action);
                  }
//这就是一个终极犹豫数码暴龙兽Dispatch了。
//显然这个dispatch支持传入action是函数(typeof action === 'function')，而不只是对象的情况了。
//所以action creator可以写成返回function的

//*************************实例解析
//同步actionCreator: 返回action.
 function syncAC(name) {
  return {name}
 }
 FinalDispatch(syncAC('Dog'));

//异步actionCreator: 返回function.
 function asyncAC(url name) {
    return dispatch=>{
      fetch(url).then(name=>{
          dispatch({name})
      },err=>{
        //.......
      })
    }
 }

 FinalDispatch(asyncAC('BigDog'));

