sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel) {
        "use strict";

        const paramModel = new JSONModel();
        const chartsModel = new JSONModel();
        const groupsModel = new JSONModel();
        const currModel = new JSONModel();

        function onInit() {
            paramModel.loadData("./localService/mockdata/params.json", "false");
            this.getView().setModel(paramModel, "paramModel");

            chartsModel.loadData("./localService/mockdata/chartOfAccount.json", "false");
            this.getView().setModel(chartsModel, "chartsModel");
        
            groupsModel.loadData("./localService/mockdata/accountGroups.json", "false");
            this.getView().setModel(groupsModel, "groupsModel");

            currModel.loadData("./localService/mockdata/currency.json", "false");
            this.getView().setModel(currModel, "currModel");
        }

        function onValidateStep1(oEvent){
            const name = this.getView().byId("inp1").getValue();
            const description = this.getView().byId("txa1").getValue();
            if( name != '' && name != undefined && description != '' && description != undefined){
                // actualizar paramModel
                paramModel.setProperty("/employeeName", name);
                paramModel.setProperty("/description", description);

                const steps = this.getView().byId("CreateProductWizard").getSteps();
                steps[0].setValidated(true);
            }
            else{
                // paramModel.setProperty("/employeeName", "");
                // paramModel.setProperty("/description", "");
                const steps = this.getView().byId("CreateProductWizard").getSteps();
                steps[0].setValidated(false);
            }
        }

        function onValidateChart(){
            // traer el valor y actualizar modelo de parametros

            // validar si todos los datos están llenos para ir al paso 3
            _validateStep2();
        }

        function handleSelectionChange(){

        }

        function handleSelectionFinish(){
            // traer el valor y actualizar modelo de parametros

            // validar si todos los datos están llenos para ir al paso 3
            _validateStep2();
        }

        function onValidateCurr() {
            // traer el valor y actualizar modelo de parametros

            // validar si todos los datos están llenos para ir al paso 3
            _validateStep2();
        }

        function handleChangeDate() {
            // traer el valor y actualizar modelo de parametros

            // validar si todos los datos están llenos para ir al paso 3
            _validateStep2();
        }

        const Main = Controller.extend("egb.cuentasui5.controller.Main", {});
        Main.prototype.onInit = onInit;
        Main.prototype.onValidateStep1 = onValidateStep1;
        Main.prototype.onValidateChart = onValidateChart;
        Main.prototype.handleSelectionChange = handleSelectionChange;
        Main.prototype.handleSelectionFinish = handleSelectionFinish;
        Main.prototype.onValidateCurr = onValidateCurr;
        Main.prototype.handleChangeDate = handleChangeDate;

        return Main
    });
