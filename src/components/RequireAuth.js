import React from 'react';
import {
    useLocation,
    Navigate
} from "react-router-dom";
import { connect } from "react-redux";

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        authLoading: state.auth.loading,
        isTokenLoaded: state.auth.isTokenLoaded
    };
};

const NewComponent = connect(mapStateToProps, null)((props) => {
    let auth = props.token !== null;
    let location = useLocation();

    if (!props.isTokenLoaded)
        return <h1>Loading......</h1>;

    if (!auth) {
        return <Navigate to="/login" state={{ from: location }} />;
    }



    return props.children;
});




export default function RequireAuth(props) {

    return (<NewComponent children={props.children} />);

}




// export default connect(
//     mapStateToProps,
//     null
// )(RequireAuth);