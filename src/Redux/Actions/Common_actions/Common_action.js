import {
    updateIsonline,
    updateModalShow
} from 'Redux/Slices/Common_Slice/Common_slice';


export const handleUpdateModalShow = dispatch => {
    dispatch(updateModalShow())
}


export const handleOnlineOffilne = (isOnline) => dispatch => {
    dispatch(updateIsonline(isOnline))
}