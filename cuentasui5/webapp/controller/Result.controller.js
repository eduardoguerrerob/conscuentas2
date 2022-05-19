sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.routing.History} History
     */

    function (Controller, History) {
        "use strict";
        return Controller.extend("egb.cuentasui5.controller.Result", {
            onInit: function () {
                // call to OData - backend SAP - request POST
            },
            onNavBack: function(){
                const oHistory = History.getInstance();
                const sPreviousHash = oHistory.getPreviousHash();
                if(sPreviousHash!==undefined){
                    window.history.go(-1);
                }
                else{
                    const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteMain",{},true);
                }
            }
        });
    });