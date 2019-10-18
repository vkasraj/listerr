import React, { useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import RoutesRenderer from "../config/router/route.renderer";
import BaseLoader from "../components/Base/BaseLoader";

import { routes } from "../config/router/route.config";
import { authenticate } from "../store/actions/index.action";

const Root = ({ $authenticate, _isAuthenticating }) => {
    const $$authenticate = useCallback($authenticate);

    useEffect(() => {
        $$authenticate();
    }, [$$authenticate]);

    if (_isAuthenticating) {
        return <BaseLoader />;
    }

    return <RoutesRenderer config={routes} default="/" />;
};

const mapState = ({ http: { request } }) => ({
    _isAuthenticating: request.authenticate ? true : false
});

const mapDispatch = {
    $authenticate: authenticate
};

export default withRouter(
    connect(
        mapState,
        mapDispatch
    )(Root)
);
