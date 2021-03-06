// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.core.Fragment} Fragment
     * @param {typeof sap.m.MessageBox} MessageBox
     */
    function (Controller, JSONModel, Fragment,MessageBox) {
        "use strict";

        const paramModel = new JSONModel();
        const chartsModel = new JSONModel();
        const groupsModel = new JSONModel();
        const currModel = new JSONModel();
        const fieldModel = new JSONModel();

        

        function onInit() {
            this._oNavContainer = this.byId("wizardNavContainer");
            this._oWizardContentPage = this.byId("wizardContentPage");


            paramModel.loadData("./localService/mockdata/params.json", "false");
            this.getView().setModel(paramModel, "paramModel");

            chartsModel.loadData("./localService/mockdata/chartOfAccount.json", "false");
            this.getView().setModel(chartsModel, "chartsModel");

            groupsModel.loadData("./localService/mockdata/accountGroups.json", "false");
            this.getView().setModel(groupsModel, "groupsModel");

            currModel.loadData("./localService/mockdata/currency.json", "false");
            this.getView().setModel(currModel, "currModel");

            fieldModel.loadData("./localService/mockdata/fields.json", "false");
            this.getView().setModel(fieldModel, "fieldModel");
        }

        function onBeforeRendering() {
            this._wizard = this.getView().byId("wizard");
            this._oFirstStep = this._wizard.getSteps()[0];
            this._oSecondStep = this._wizard.getSteps()[1];
            this._oThirdStep = this._wizard.getSteps()[2];
            this._wizard.discardProgress(this._oFirstStep);
            this._wizard.goToStep(this._oFirstStep);
            this._oFirstStep.setValidated(false);
        }

        function onValidateStep1(oEvent) {
            const name = this.getView().byId("inp1").getValue();
            const description = this.getView().byId("txa1").getValue();
            if (name != '' && name != undefined && description != '' && description != undefined) {
                // actualizar paramModel
                paramModel.setProperty("/employeeName", name);
                paramModel.setProperty("/description", description);

                // const steps = this.getView().byId("wizard").getSteps();
                // steps[0].setValidated(true);
                this._oFirstStep.setValidated(true);
            }
            else {
                // paramModel.setProperty("/employeeName", "");
                // paramModel.setProperty("/description", "");
                //const steps = this.getView().byId("CreateProductWizard").getSteps();
                this._oFirstStep.setValidated(false);
            }
        }

        function onValidateChart(oEvent) {
            // traer el valor y actualizar modelo de parametros
            const chart = chartsModel.getProperty("/selectedChart");
            paramModel.setProperty("/chart", chart);

            // validar si todos los datos est??n llenos para ir al paso 3
            _validateStep2(this);
        }

        function handleSelectionChange() {

        }

        function handleSelectionGroups(oEvent) {
            // traer el valor y actualizar modelo de parametros
            let groups = [];
            groupsModel.setProperty("/selectedGroups", []);
            var selectItems = oEvent.getParameter("selectedItems");
            for (var i in selectItems) {
                const??grpStr??=??'{"id":"'+selectItems[i].getKey()??+'","description":"'+selectItems[i].getText()+'"}'
                groups.push(JSON.parse(grpStr));
            }
            groupsModel.setProperty("/selectedGroups", groups);
            paramModel.setProperty("/groups", groups);

            // validar si todos los datos est??n llenos para ir al paso 3
            _validateStep2(this);
        }

        function onValidateCurr() {
            // traer el valor y actualizar modelo de parametros
            const currency = currModel.getProperty("/monedaSeleccionada");
            paramModel.setProperty("/currency", currency);

            // validar si todos los datos est??n llenos para ir al paso 3
            _validateStep2(this);
        }

        function handleChangeDate(oEvent) {
            // traer el valor y actualizar modelo de parametros
            const sValue = oEvent.getParameter("value");
            const bValid = oEvent.getParameter("valid");
            if (bValid) {
                paramModel.setProperty("/date", sValue);
            }
            else {
                paramModel.setProperty("/date", "");
            }

            // validar si todos los datos est??n llenos para ir al paso 3
            _validateStep2(this);
        }

        function _validateStep2(that) {
            const params = paramModel.getData();

            if (params.chart !== "" && params.chart !== undefined &&
                params.groups !== undefined && params.groups.length > 0 &&
                params.currency !== undefined && params.currency !== "" &&
                params.date !== undefined && params.date !== "") {

                that._oSecondStep.setValidated(true);
                that._wizard.goToStep(that._oThirdStep);
            }
            else {
                that._oSecondStep.setValidated(false);
            }
        }

        function onValidateStep3(oEvent) {
            const fields = fieldModel.getProperty("/fields");
            let selectedFields = [];
            const indices = this.getView().byId("tb1").getSelectedIndices();
            fieldModel.setProperty("/selectedFields", []);

            if (indices) {
                for (let i in indices) {
                    let idx = parseInt(i);
                    selectedFields.push(fields[idx].id);
                }
                fieldModel.setProperty("/selectedFields", selectedFields);
            }
        }

        function onShowDescription(oEvent) {
            const oView = this.getView();

            if (!this.byId("descriptionDialog")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "egb.cuentasui5.fragment.descriptionReport",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            }
            else{
                this.byId("descriptionDialog").open();
            }
        }

        function onCloseDescription(oEvent) {
            this.byId("descriptionDialog").close();
        }

        function wizardCompletedHandler() {
            this._oNavContainer.to(this.byId("wizardReviewPage"));
        }

        function handleWizardSubmit(oEvent) {
            // go to Result view
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteResult");
        }

        function handleWizardCancel() {
            MessageBox["warning"]("Confirma cancelaci??n?",{
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function(oAction){
                    if(oAction === MessageBox.Action.YES){
                       this._wizard.goToStep(this._oFirstStep);
                       this._wizard.discardProgress(this._oFirstStep);
                       this._oNavContainer.backToPage(this._oWizardContentPage.getId());
                    }
                }.bind(this)
           })
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
        Main.prototype.onValidateStep3 = onValidateStep3;
        Main.prototype.onShowDescription = onShowDescription;
        Main.prototype.onCloseDescription = onCloseDescription;
        Main.prototype.wizardCompletedHandler = wizardCompletedHandler;
        Main.prototype.handleWizardSubmit = handleWizardSubmit;
        Main.prototype.handleWizardCancel = handleWizardCancel;

        return Main
    });
