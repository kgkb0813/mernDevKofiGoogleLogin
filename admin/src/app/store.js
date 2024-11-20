import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import roomReducer from '../features/room/roomSlice';
import bookingReducer from '../features/booking/bookingSlice';
import appStateReducer from '../features/appState/appStateSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    room: roomReducer,
    booking: bookingReducer,
    appState: appStateReducer, // appState reducer 추가
  },
  devTools: { actionsBlacklist: ['@@redux/INIT'] },       /* devTool display issue 해결을 위해 */
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),    /* 불필요한 devTool warning message 삭제를 위해 */
});


/*
  === Redux 진행프로세스 ===========================
    (1) Store 생성(configureStore)
    (2) React-Redux 적용범위 설정 (Provider)
    (3) Reducer설정/Action생성(createSlice)  
    (4) action 호출 (useDispatch) : 변경된 상태정보 Store에 전달
    (5) 변경된 state정보값 호출(useSelector) 및 UI에 반영

*/