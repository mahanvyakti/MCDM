$(function() {
    var criteria = [];
    var alternatives = [];

    var weights = {};
    var isBeneficial = {};

    // Crtieria values for each  alternatives
    var criteriva_values = {};
    //Set up the event listeners
    $("#criteria-list, #alternatives-list").on('change keyup paste', countAndUpdateLists);
    $("#weights-card-body").on('change keyup paste', ".criteria-weight", countAndUpdateLists);
    $("#beneficial-card-body").on('change keyup paste', ".criteria-beneficial", handleBeneficial);

    $("#criteria-values-card-body").on('change keyup paste', ".criterion-value-for-alternative", countAndUpdateLists);

    // Button onClick Handlers
    $("#editDetails").on("click", enableDetailsEditing);
    $("#buildMatrix").on("click", generateMatrix);
    $("#submitForm").on("click", submitForm);

    function countAndUpdateLists(event) {

        var name = event.target.name;
        var id = event.target.id;
        var list = $(`#${id}`).val();
        console.log(id);
        console.log(list);
        var splittedList = list.split(",");
        var cleanedList = [];

        splittedList.forEach(element => {
            var trimmedElement = element.trim();
            if (trimmedElement !== '')
                cleanedList.push(trimmedElement);
        });
        switch (id) {
            case "criteria-list":
                $("#criteria-count").text(cleanedList.length);
                criteria = cleanedList;
                console.log(criteria);

                weights = {};
                isBeneficial = {};

                var weightsHTML = criteria.length == 0 ? "<p>Please enter criteria first!</p>" : "";
                var beneficialHTML = criteria.length == 0 ? "<p>Please enter criteria first!</p>" : "";

                criteria.forEach((criterion, index) => {
                    weightsHTML += weightsRowHTML(criterion, index);
                    beneficialHTML += beneficialCheckboxHTML(criterion, index);
                    isBeneficial[`${criterion}-${index}`] = "N";
                });

                $("#weights-card-body").html(weightsHTML);
                $("#beneficial-card-body").html(beneficialHTML);
                break;
            case "alternatives-list":
                $("#alternatives-count").text(cleanedList.length);
                alternatives = cleanedList;
                console.log(alternatives)
                break;

        }
        if (id.includes("criterion-weight-for--")) {
            var split = id.split("--");

            var criterionName = split[split.length - 2];
            var criterionIndex = split[split.length - 1];
            weights[`${criterionName}-${criterionIndex}`] = cleanedList[0];
            console.log(weights);
        }
        if (id.includes("criterion-value-for--")) {
            /// ${alternativeName}--${alternativeIndex}--${criterionName}--${criterionIndex}
            var split = id.split("--");
            var length = split.length;

            var criterionIndex = split[length - 1];
            var criterionName = split[length - 2];
            var alternativeIndex = split[length - 3];
            var alternativeName = split[length - 4];

            criteriva_values[`${alternativeName}-${alternativeIndex}-${criterionName}-${criterionIndex}`] = cleanedList[0];
            console.log("criteriva_values");
            console.log(criteriva_values);
        }

    }

    function handleBeneficial(event) {
        var element = event.target;
        var id = event.target.id;
        var index = id.split("-")[0];
        var criterion = id.split("-")[1];
        console.log(id);
        if (this.checked) {
            console.log("Checked");
            isBeneficial[`${criterion}-${index}`] = "Y";

        } else {
            console.log("Not Checked");
            isBeneficial[`${criterion}-${index}`] = "N";
        }
        console.log(isBeneficial)
    }

    function beneficialCheckboxHTML(criterionName, criterionIndex) {
        var html = "";
        html += "<div>"
        html += "<div class=' align-items-center'>";
        html += `<div>`;
        html += `<input type="checkbox" id="${criterionIndex}-${criterionName}" name="beneficial" value="criterionName" class="criteria-beneficial">`
        html += `<label for="${criterionIndex}-${criterionName}" class="p-2">${criterionName}</label>`
        html += `</div>`

        return html;
    }

    function weightsRowHTML(criterionName, criterionIndex) {
        var html = "";

        html += "<div>"
        html += "<div class=' align-items-center'>";
        html += `<p class='mb-2 mr-6'>Weight for ${criterionName}</p>`;
        html += `<input id='criterion-weight-for--${criterionName}--${criterionIndex}' type='text' name='criterion-weight-for-${criterionName}-${criterionIndex}' class='criteria-weight ml-2 form-control m-input' placeholder='Enter weight for ${criterionName}' autocomplete='off'>`;
        html += "</div>";
        html += "<hr/>";
        html += "</div>";

        return html;
    }

    function getCriteriaValuesHTML(alternativeName, alternativeIndex) {
        var html = "";
        html += "<div>";
        html += `<h5>Enter criteria value for alternative ${alternativeName}</h5>`

        criteria.forEach((criterionName, criterionIndex) => {
            html += "<div>"
            html += "<div class=' align-items-center'>";
            html += `<p class='mb-2 mr-6'>Enter value of ${criterionName}</p>`;
            html += `<input id='criterion-value-for--${alternativeName}--${alternativeIndex}--${criterionName}--${criterionIndex}' type='text' name='criterion-value-for-${alternativeName}-${alternativeIndex}-${criterionName}-${criterionIndex}' class='criterion-value-for-alternative ml-2 form-control m-input' placeholder='Enter criterion value of criterion ${criterionName} for ${alternativeName}' autocomplete='off'>`;
            html += "</div>";
            // html += `<div id='inputFormSubCriteria-${mainCriterionName}-${mainCriterionIndex}' class=' mb-3'>`;
            // html += `<small id='subCriteriaHelpBlock-${mainCriterionName}-${mainCriterionIndex}' class='form-text text-muted'>`;
            // html += "Enter all the sub-criteria separated by comma";
            // html += "</small>";
            // html += "</div>";
            html += "</div>";
        });

        html += "<hr/>";
        html += "</div>";

        return html;
    }

    function toggleAllAccordions({ editingCriteriaDetails = true }) {
        if (editingCriteriaDetails) {
            $('#matrixDataAccordian .collapse').collapse('hide');
        } else {
            $('#dataAccordian .collapse').collapse('hide');
        }
    }

    function generateMatrix(event) {
        event.preventDefault();
        toggleAllAccordions({ editingCriteriaDetails: true });

        $(".weightsAccordionButton").attr("disabled", true);
        $(".beneficialAccordionButton").attr("disabled", true);

        $("#editDetails").attr("disabled", false);
        $("#buildMatrix").attr("disabled", true);
        $("#submitForm").attr("disabled", false);


        $(".matrixAccordionButton").attr("disabled", false);

        criteriva_values = {};
        var matrixHTML = "<div>";
        alternatives.forEach((alternativeName, alternativeIndex) =>
            matrixHTML += getCriteriaValuesHTML(alternativeName, alternativeIndex)
        );
        matrixHTML += "</div>";

        $("#criteria-values-card-body").html(matrixHTML);

    }

    function enableDetailsEditing(event) {
        event.preventDefault();
        toggleAllAccordions({ editingCriteriaDetails: true });

        $(".weightsAccordionButton").attr("disabled", false);
        $(".beneficialAccordionButton").attr("disabled", false);

        $("#buildMatrix").attr("disabled", false);
        $("#editDetails").attr("disabled", true);
        $("#submitForm").attr("disabled", true);


        $(".matrixAccordionButton").attr("disabled", true);

    }

    function submitForm(event) {
        $("#criteria").val(criteria);
        $("#alternatives").val(alternatives);
        $("#beneficial").val(Object.entries(isBeneficial));
        $("#weights").val(Object.entries(weights));
        $("#criteria_values").val(Object.entries(criteriva_values));

        $("#submitRequiredDataForm").trigger("click");
    }
})