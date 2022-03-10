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

        function onBeforeRendering(){
           this._wizard =  this.getView().byId("wizard");
           this._oFirstStep = this._wizard.getSteps()[0];
           this._oSecondStep = this._wizard.getSteps()[1];
           this._oThirdStep = this._wizard.getSteps()[2];
           this._wizard.discardProgress(this._oFirstStep);
           this._wizard.goToStep(this._oFirstStep);
           this._oFirstStep.setValidated(false);
        }

        function onValidateStep1(oEvent){
            const name = this.getView().byId("inp1").getValue();
            const description = this.getView().byId("txa1").getValue();
            if( name != '' && name != undefined && description != '' && description != undefined){
                // actualizar paramModel
                paramModel.setProperty("/employeeName", name);
                paramModel.setProperty("/description", description);

                // const steps = this.getView().byId("wizard").getSteps();
                // steps[0].setValidated(true);
                this._oFirstStep.setValidated(true);
            }
            else{
                // paramModel.setProperty("/employeeName", "");
                // paramModel.setProperty("/description", "");
                //const steps = this.getView().byId("CreateProductWizard").getSteps();
                this._oFirstStep.setValidated(false);
            }
        }

        function onValidateChart(oEvent){
            // traer el valor y actualizar modelo de parametros
            const chart = chartsModel.getProperty("/selectedChart");
            paramModel.setProperty("/chart", chart);

            // validar si todos los datos están llenos para ir al paso 3
            _validateStep2(this);
        }

        function handleSelectionChange(){

        }

        function handleSelectionGroups(oEvent){
            // traer el valor y actualizar modelo de parametros
            let groups = [];
            groupsModel.setProperty("/selectedGroups", []);
            var selectItems = oEvent.getParameter("selectedItems");
            for(var i in selectItems){
                groups.push(selectItems[i].getKey());
            }
            groupsModel.setProperty("/selectedGroups", groups);
            paramModel.setProperty("/groups", groups);

            // validar si todos los datos están llenos para ir al paso 3
            _validateStep2(this);
        }

        function onValidateCurr() {
            // traer el valor y actualizar modelo de parametros
            const currency = currModel.getProperty("/monedaSeleccionada");
            paramModel.setProperty("/currency", currency);

            // validar si todos los datos están llenos para ir al paso 3
            _validateStep2(this);
        }

        function handleChangeDate(oEvent) {
            // traer el valor y actualizar modelo de parametros
            const sValue = oEvent.getParameter("value");
            const bValid = oEvent.getParameter("valid");
            if(bValid){
                paramModel.setProperty("/date", sValue);
            }
            else{
                paramModel.setProperty("/date", "");
            }

            // validar si todos los datos están llenos para ir al paso 3
            _validateStep2(this);
        }

        function _validateStep2(that){
            const params = paramModel.getData();

            if(params.chart !== "" && params.chart !== undefined &&  
               params.groups !== undefined && params.groups.length > 0 &&
               params.currency !== undefined && params.currency !== "" &&
               params.date !== undefined && params.date !== "" ){
                
                that._oSecondStep.setValidated(true);
                that._wizard.goToStep(this._oThirdStep);                   
               }
               else{
                that._oSecondStep.setValidated(false);
               }
        }


        const Main = Controller.extend("egb.cuentasui5.controller.Main", {});
        Main.prototype.onBeforeRendering = onBeforeRendering;
        Main.prototype.onInit = onInit;
        Main.prototype.onValidateStep1 = onValidateStep1;
        Main.prototype.onValidateChart = onValidateChart;
        Main.prototype.handleSelectionChange = handleSelectionChange;
        Main.prototype.handleSelectionGroups = handleSelectionGroups;
        Main.prototype.onValidateCurr = onValidateCurr;
        Main.prototype.handleChangeDate = handleChangeDate;


        return Main
    });
