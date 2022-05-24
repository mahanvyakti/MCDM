$(function() {
    var experts = [];
    var mainCriteria = [];
    var subCriteria = {};

    var subCriteriaImportanceHTMLMap = {};
    var mainCriteriaImportance = {};
    var subCriteriaImportance = {};

    var mainCriteriaSj = {};
    var subCriteriaSj = {};

    var subCriteriaCount = 0;

    var sortedMainCriteriaImportance = [];
    var sortedSubCriteriaImportance = [];

    var mainCriteriaMeanSj = [];
    var subCriteriaMeanSj = [];

    //Set up the event listeners
    $(".sub-criteria-list, #experts-list, #main-criteria-list").on('change keyup paste', countAndUpdateLists);
    $("#sub-criteria-card-body").on('change keyup paste', ".sub-criteria-list", countAndUpdateLists);

    $("#main-criteria-importance-card-body").on('change keyup paste', ".importance-rating-for-main-criterion", countAndUpdateLists);
    $("#sub-criteria-importance-card-body").on('change keyup paste', ".importance-rating-for-sub-criteria", countAndUpdateLists);
    // $("#sub-criteria-importance-card-body").on('change keyup paste', ".sub-criteria-sj-values", countAndUpdateLists);

    $("#main-criteria-sj-values-card-body").on('change keyup paste', ".sj-value-for-main-criterion", countAndUpdateLists);
    $("#sub-criteria-sj-values-card-body").on('change keyup paste', ".sj-value-for-sub-criteria", countAndUpdateLists);

    // Button onClick Handlers
    $("#sortImportance").on("click", sortCriteriaByImporance);
    $("#editCriteriaDetails").on("click", enableCriteriaEditing);
    $("#submitForm").on("click", submitForm);

    function countAndUpdateLists(event) {

        var name = event.target.name;
        var id = event.target.id;
        var list = $(`[id='${id}']`).val();
        console.log(`id`);
        console.log(id);
        console.log(`list`);
        console.log(list);
        var splittedList = list.split(",");
        var cleanedList = [];

        splittedList.forEach(element => {
            var trimmedElement = element.trim();
            if (trimmedElement !== '')
                cleanedList.push(trimmedElement);
        });

        switch (id) {
            case "experts-list":
                $("#experts-count").text(cleanedList.length);
                experts = cleanedList;
                var mainCriteriaImportanceHTML = experts.length == 0 ? "<p>Please enter expert names first!</p>" : (mainCriteria.length == 0 ? "<p>Please enter main criteria first!</p>" : "");
                var subCriteriaImportanceHTML = experts.length == 0 ? "<p>Please enter expert names first!</p>" : (subCriteriaCount == 0 ? "<p>Please enter sub-criteria first!</p>" : "");
                $("#sub-criteria-importance-card-body").html(subCriteriaImportanceHTML);

                mainCriteriaImportance = {};
                mainCriteriaSj = {};
                subCriteriaImportance = {};
                subCriteriaSj = {};

                subCriteriaImportanceHTMLMap = {};

                mainCriteria.forEach((criterion, index) => {
                    if (experts.length !== 0) {
                        mainCriteriaImportanceHTML += getMainCriterionImportanceHTML(criterion, index);
                        if (subCriteriaCount != 0) {
                            subCriteriaImportanceHTMLMap[index] = getSubCriteriaImportanceHTML(criterion, index, subCriteria[index]);
                        }
                    }
                });
                $("#main-criteria-importance-card-body").html(mainCriteriaImportanceHTML);
                if (subCriteriaCount != 0) {
                    setSubCriteriaImportanceHTML();
                }

                break;

            case "main-criteria-list":
                $("#main-criteria-count").text(cleanedList.length);

                // Update the actual list of main criteria
                mainCriteria = cleanedList;

                var subCrtieriaFormHTML = mainCriteria.length == 0 ? "<p>Please enter main criteria first!</p>" : "";
                var mainCriteriaImportanceHTML = experts.length == 0 ? "<p>Please enter names of experts first!</p>" : "";

                subCriteria = {};
                mainCriteriaImportance = {};
                subCriteriaImportance = {};
                subCriteriaImportanceHTMLMap = {};
                mainCriteriaSj = {};
                subCriteriaSj = {};

                var subCriteriaImportanceHTML = experts.length == 0 ? "<p>Please enter expert names first!</p>" : (subCriteriaCount == 0 ? "<p>Please enter sub-criteria first!</p>" : "");
                $("#sub-criteria-importance-card-body").html(subCriteriaImportanceHTML);
                mainCriteria.forEach((criterion, index) => {
                    subCrtieriaFormHTML += getSubCriteriaRowHTML(criterion, index);
                    subCriteriaImportanceHTMLMap[index] = [];
                    subCriteria[index] = [];

                    if (experts.length !== 0) {
                        mainCriteriaImportanceHTML += getMainCriterionImportanceHTML(criterion, index);
                    }
                    // if(subCriteriaCount != 0){
                    //     subCriteriaImportanceHTMLMap[mainCriterionIndex] = getSubCriteriaImportanceHTML(mainCriterionName, mainCriterionIndex, subCriteria[mainCriterionIndex]);
                    // }
                });
                console.log("-----------SubCriteria-------------");
                console.log(subCriteria);
                console.log("-----------------------------------");
                setSubCriteriaCount();
                if (subCriteriaCount != 0) {
                    setSubCriteriaImportanceHTML();
                }

                $("#sub-criteria-card-body").html(subCrtieriaFormHTML);
                $("#main-criteria-importance-card-body").html(mainCriteriaImportanceHTML);
                break;
        }
        if (id.includes("sub-criteria-list-for--")) {
            //The input element for sub-criteria has its id in the format of 
            // "sub-criteria-list-for--${mainCriterionName}--${mainCriterionIndex}"
            // Hence, splitting the id with "--" as the delimitter to get index and name of corresponding main criterion
            var split = id.split("--");

            var mainCriterionIndex = split[split.length - 1];
            var mainCriterionName = split[split.length - 2];
            subCriteria[mainCriterionIndex] = cleanedList;

            // subCriteriaImportanceHTMLMap[mainCriterionIndex] = getSubCriteriaImportanceHTML(mainCriterionName, mainCriterionIndex, cleanedList);

            mainCriteria.forEach((criterion, index) => {
                if (experts.length !== 0) {
                    if (subCriteriaCount != 0) {
                        subCriteriaImportanceHTMLMap[index] = getSubCriteriaImportanceHTML(criterion, index, subCriteria[index]);
                    }
                }
            });
            setSubCriteriaImportanceHTML();
            setSubCriteriaCount();

            $("#sub-criteria-count").text(subCriteriaCount);
        }
        if (id.includes("importance-rating-for-main-criterion--")) {
            var split = id.split("--");

            var mainCriterionName = split[split.length - 3];
            var mainCriterionIndex = split[split.length - 2];
            var expert = split[split.length - 1];

            mainCriteriaImportance[`${expert}-${mainCriterionName}-${mainCriterionIndex}`] = cleanedList[0];
            console.log(mainCriteriaImportance);
        }
        if (id.includes("importance-rating-for-sub-criteria-of--")) {
            var split = id.split("--");

            var mainCriterionName = split[split.length - 3];
            var mainCriterionIndex = split[split.length - 2];
            var expert = split[split.length - 1];

            subCriteriaImportance[`${expert}-${mainCriterionName}-${mainCriterionIndex}`] = cleanedList;
            //TODO: Validate the length of the cleaedList during form validation.
            // ==>> Length of the cleanedList must match with the number of sub-criteria for the given mainCriterion 
            console.log("subCriteriaImportance");
            console.log(subCriteriaImportance);
        }
        if (id.includes("sj-value-for-main-criterion--")) {
            var split = id.split("--");

            var mainCriterionName = split[split.length - 3];
            var mainCriterionIndex = split[split.length - 2];
            var expert = split[split.length - 1];

            mainCriteriaSj[`${mainCriterionName}-${mainCriterionIndex}-${expert}`] = cleanedList[0];
            console.log(mainCriteriaSj);
        }
        if (id.includes("sj-value-for-sub-criterion--")) {
            var [rest, mcName, mcIndex, scName, scIndex, expert] = id.split("--");

            subCriteriaSj[`${mcName}-${mcIndex}-${scName}-${scIndex}-${expert}`] = cleanedList[0];
            console.log(subCriteriaSj);
        }


    }

    function setSubCriteriaCount() {
        var count = 0;
        Object.entries(subCriteria).forEach(([_, value]) => count += value.length);
        subCriteriaCount = count;
        console.log(`Set subcriteria count to ${subCriteriaCount}`);
    }

    function getSubCriteriaRowHTML(mainCriterionName, mainCriterionIndex) {
        var html = "";

        html += "<div>"
        html += "<div class=' align-items-center'>";
        html += `<p class='mb-2 mr-6'>Sub-Criteria for ${mainCriterionName}</p>`;
        html += `<input id='sub-criteria-list-for--${mainCriterionName}--${mainCriterionIndex}' type="text"  name='sub-criterion-names-for-${mainCriterionName}-${mainCriterionIndex}' class='sub-criteria-list ml-2 form-control m-input' placeholder='Enter sub-criteria for ${mainCriterionName}' autocomplete='off'>`;
        html += "</div>";
        html += `<div id='inputFormSubCriteria-${mainCriterionName}-${mainCriterionIndex}' class=' mb-3'>`;
        html += `<small id='subCriteriaHelpBlock-${mainCriterionName}-${mainCriterionIndex}' class='form-text text-muted'>`;
        html += "Enter all the sub-criteria separated by comma";
        html += "</small>";
        html += "</div>";
        html += "<hr/>";
        html += "</div>";

        return html;
    }

    function getMainCriterionImportanceHTML(mainCriterionName, mainCriterionIndex) {
        var html = "";
        html += "<div>";
        html += `<h5>Importance ratings for main criterion ${mainCriterionName}</h5>`

        experts.forEach(expert => {
            html += "<div>"
            html += "<div class=' align-items-center'>";
            html += `<p class='mb-2 mr-6'>By ${expert}</p>`;
            html += `<input id='importance-rating-for-main-criterion--${mainCriterionName}--${mainCriterionIndex}--${expert}' type="text"   name='importance-rating-for-main-criterion-${mainCriterionName}-${mainCriterionIndex}' class='importance-rating-for-main-criterion ml-2 form-control m-input' placeholder='Enter importance rating for main criterion ${mainCriterionName} by expert ${expert}' autocomplete='off'>`;
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


    function getSubCriteriaImportanceHTML(mainCriterionName, mainCriterionIndex, subCriteriaList) {
        var html = "";
        html += "<div>";
        if (subCriteriaList.length == 0) {
            html += `<p>Enter sub-criteria of main criterion ${mainCriterionName} first</p>`;
        } else {
            var decoratedSubCriteriaList = "[";
            var scLength = subCriteriaList.length;
            subCriteriaList.forEach((subC, index) => decoratedSubCriteriaList += `${subC}${index == scLength-1 ?'':', '}`);
            decoratedSubCriteriaList += "]"

            html += `<p><strong>Importance rating for sub-criteria of main criterion ${mainCriterionName}</strong></h5>`
            experts.forEach(expert => {
                html += "<div>"
                html += "<div class=' align-items-center'>";
                html += `<p class='mb-2 mr-6'>By ${expert}</p>`;
                html += `<input id='importance-rating-for-sub-criteria-of--${mainCriterionName}--${mainCriterionIndex}--${expert}' type="text" name='importance-rating-for-sub-criteria-of-${mainCriterionName}-${mainCriterionIndex}' class='importance-rating-for-sub-criteria ml-2 form-control m-input' placeholder='Enter importance ratings for sub criteria of main criterion ${mainCriterionName} by expert ${expert}' autocomplete='off'>`;
                html += "</div>";
                html += `<div id='inputFormSubCriteriaImportance-${mainCriterionName}-${mainCriterionIndex}-${expert}' class=' mb-3'>`;
                html += `<small id='subCriteriaImportanceHelpBlock-${mainCriterionName}-${mainCriterionIndex}-${expert}' class='form-text text-muted'>`;
                html += `Enter all the sub-criteria separated by comma corresponding to ${decoratedSubCriteriaList}`;
                html += "</small>";
                html += "</div>";
                html += "</div>";
            });
        }
        html += "<hr/>";
        html += "</div>";

        return html;
    }

    function setSubCriteriaImportanceHTML() {
        var html = "";
        html += "<div>";
        Object.entries(subCriteriaImportanceHTMLMap).forEach(([index, subCriImpHTML]) => {
            //Set HTML of sub-criteria importance for each main criterion
            html += subCriImpHTML;

        });
        html += "</div>";
        $("#sub-criteria-importance-card-body").html(html);

    }

    function toggleAllAccordions({ editingCriteriaDetails = true }) {
        if (editingCriteriaDetails) {
            $('#sjDataAccordian .collapse').collapse('hide');
        } else {
            $('#dataAccordian .collapse').collapse('hide');
        }
    }

    function enableCriteriaEditing(event) {
        event.preventDefault();
        toggleAllAccordions({ editingCriteriaDetails: true });

        $(".dataAccordionButton").attr("disabled", false);
        $(".sjDataAccordionButton").attr("disabled", true);

        $("#experts-list").attr("disabled", false);
        $("#sortImportance").attr("disabled", false);
        $("#submitForm").attr("disabled", true);

        $("#editCriteriaDetails").attr("disabled", true);

    }

    function getMainCriterionSjHTML(mainCriterionName, mainCriterionIndex) {
        var html = "";
        html += "<div>";
        html += `<h5>Comparative Significance (S<sub>j</sub>) values  for main criterion ${mainCriterionName}</h5>`

        experts.forEach(expert => {
            html += "<div>"
            html += "<div class=' align-items-center'>";
            html += `<p class='mb-2 mr-6'>By ${expert}</p>`;
            html += `<input id='sj-value-for-main-criterion--${mainCriterionName}--${mainCriterionIndex}--${expert}'  type="text" name='sj-value-for-main-criterion-${mainCriterionName}-${mainCriterionIndex}' class='sj-value-for-main-criterion ml-2 form-control m-input' placeholder='Enter Comparative Significance (Sj) value for main criterion ${mainCriterionName} by expert ${expert}' autocomplete='off'>`;
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

    function setMainCriteriaSjHTML(sortedMainCriteriaSumPairList) {
        var mainCriteriaSjHTML = "";

        sortedMainCriteriaSumPairList.forEach((crit_sum_pair, idx) => {
            var splitCritIdx = crit_sum_pair[0].split("-");
            var criterion = splitCritIdx[0];
            var index = parseInt(splitCritIdx[1]);

            if (idx === 0) {
                mainCriteriaSjHTML += "<div>";
                mainCriteriaSjHTML += `<h5>Mean comparative Significance (S<sub>j</sub>) value  for main criterion ${criterion}</h5>`
                mainCriteriaSjHTML += `<input id='sj-value-for-main-criterion--${criterion}--${index}--all' type="text" name='sj-value-for-main-criterion-${criterion}-${index}' class='sj-value-for-main-criterion ml-2 form-control m-input' placeholder='0' value="0" disabled autocomplete='off'>`;
                mainCriteriaSjHTML += "<hr/>";
                mainCriteriaSjHTML += "</div>";
            } else {
                mainCriteriaSjHTML += getMainCriterionSjHTML(criterion, index);
            }

        });

        console.log(mainCriteriaSjHTML);
        $("#main-criteria-sj-values-card-body").html(mainCriteriaSjHTML);

    }


    function getSubCriterionSjHTML(mcName, mcIndex, scName, scIndex) {
        var html = "";
        html += "<div>";

        experts.forEach(expert => {
            html += "<div>"
            html += "<div class=' align-items-center'>";
            html += `<p class='mb-2 mr-6'>S<sub>j</sub> value for ${scName} by ${expert}</p>`;
            html += `<input id='sj-value-for-sub-criterion--${mcName}--${mcIndex}--${scName}--${scIndex}--${expert}' type="text"  name='sj-value-for-sub-criteria-${mcName}-${mcIndex}-${scName}-${scIndex}-by-${expert}' class='sj-value-for-sub-criteria ml-2 form-control m-input' placeholder='Enter Sj values for remaining sub criteria of main criterion ${mcName} by expert ${expert}' autocomplete='off'>`;
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

    function setSubCriteriaSjHTML(sortedSubCriteriaSumPairList) {
        var subCriteriaSjHTML = "";

        sortedSubCriteriaSumPairList.forEach((outerSumPairList, mainCriterionIndex) => {

            subCriteriaSjHTML += `<h5>Comparative Significance (S<sub>j</sub>) value for subcriteria of main criterion ${mainCriteria[mainCriterionIndex]}</h5>`

            var subCriteriaOrder = [];
            outerSumPairList.forEach((sumPair, subCriterionIndex) => { if (subCriterionIndex !== 0) subCriteriaOrder.push(sumPair[0].split("-")[2]) });
            var subCriteriaOrderString = subCriteriaOrder.join(" ");

            outerSumPairList.forEach((sumPair, subCriterionIndex) => {
                var [mcName, mcIndex, scName, scIndex] = sumPair[0].split("-");
                console.log(mcName, mcIndex, scName, scIndex);


                if (subCriterionIndex === 0) {
                    //mcName-mcIndex-scName-scIndex
                    mcIndex = parseInt(mcIndex);
                    scIndex = parseInt(scIndex);

                    subCriteriaSjHTML += "<div>";
                    subCriteriaSjHTML += `<h6>Mean comparative Significance (S<sub>j</sub>) value  for subcriterion ${scName} </h6>`
                    subCriteriaSjHTML += `<input id='sj-value-for-sub-criterion--${mcName}--${mcIndex}--${scName}--${scIndex}--all' type="text"  name='sj-value-for-sub-criteria-${mcName}-${mcIndex}-${scName}-${scIndex}-by-all' class='sj-value-for-sub-criteria ml-2 form-control m-input' placeholder='0' value="0" disabled autocomplete='off'>`;
                    subCriteriaSjHTML += "<hr class'mx-1'/>";
                    subCriteriaSjHTML += "</div>";
                    subCriteriaSj[`${mcName}-${mcIndex}-${scName}-${scIndex}-all`] = 0;
                } else {
                    subCriteriaSjHTML += `<h6>Enter comparative Significance (S<sub>j</sub>) values for remaining sub-criteria</h6>`
                    subCriteriaSjHTML += `<p>[${subCriteriaOrderString}]</p>`
                    subCriteriaSjHTML += getSubCriterionSjHTML(mcName, mcIndex, scName, scIndex);
                }

            });
        });

        $("#sub-criteria-sj-values-card-body").html(subCriteriaSjHTML);

    }

    function sortMainCriteria() {
        var mainCriteriaImportanceSumList = Array(mainCriteria.length).fill(0);
        var mainCriteriaSumPairList = Array(mainCriteria.length).fill([]);

        Object.entries(mainCriteriaImportance).forEach(([exp_crit_idx, importance]) => {
            var [expert, criterion, index] = exp_crit_idx.split("-");
            mainCriteriaImportanceSumList[index] += parseInt(importance);
        });

        mainCriteria.forEach((mainCriterion, index) => mainCriteriaSumPairList[index] = [`${mainCriterion}-${index}`, mainCriteriaImportanceSumList[index]]);
        console.log("mainCriteriaSumPairList");
        console.log(mainCriteriaSumPairList);

        const sortedMainCriteriaSumPairList = mainCriteriaSumPairList.sort((a, b) => {
            if (a[1] > b[1]) {
                return -1;
            }
            if (a[1] < b[1]) {
                return 1;
            }
            return 0;
        });

        console.log("sortedMainCriteriaSumPairList");
        console.log(sortedMainCriteriaSumPairList);
        console.log("mainCriteriaSumPairList");
        console.log(mainCriteriaSumPairList);
        return sortedMainCriteriaSumPairList;
    }

    function aggregatedsubCriteriaImportance(subCriteriaImportance) {
        // var aggregatedSubCriteriaSumPairList = new Array(mainCriteria.length).fill([]);
        var aggregatedSubCriteriaSumPairList = [];

        console.log("Initial");
        console.log(aggregatedSubCriteriaSumPairList);
        console.log("subCriteria");
        console.log(subCriteria);
        //Initialization
        Object.entries(subCriteria).forEach(([mainCriterionIndex, subCriteriaList]) => {
            console.log(`\nWorking on ${mainCriterionIndex}=${mainCriteria[mainCriterionIndex]}`);

            var outerSumPairList = [];
            subCriteriaList.forEach((subCriterion, subCriterionIndex) => {
                console.log(`\tGot ${subCriterion}-${subCriterionIndex}`);
                // aggregatedSubCriteriaSumPairList[mainCriterionIndex].push([`${mainCriteria[mainCriterionIndex]}-${mainCriterionIndex}-${subCriterion}-${subCriterionIndex}`, "0"]);
                outerSumPairList.push([`${mainCriteria[mainCriterionIndex]}-${mainCriterionIndex}-${subCriterion}-${subCriterionIndex}`, "0.0"]);
                console.log("\tconsole.log(aggregatedSubCriteriaSumPairList);");
                console.log(`\t ${aggregatedSubCriteriaSumPairList}`);
            });
            aggregatedSubCriteriaSumPairList.push(outerSumPairList);
            console.log("\n\tBahercha console.log(aggregatedSubCriteriaSumPairList);");
            console.log(`\t ${aggregatedSubCriteriaSumPairList}`);
        });

        console.log("Initialized aggregatedSubCriteriaSumPairList");
        console.log(aggregatedSubCriteriaSumPairList);

        Object.entries(subCriteriaImportance).forEach(([exp_mainCrit_idx, subCriteriaImportanceValues]) => {
            var [expert, mainCriterion, mainCriterionIndex] = exp_mainCrit_idx.split("-");
            subCriteriaImportanceValues.forEach((subCriterionImportance, subCriterionIndex) => {
                var subCriterionImportanceSumPair = aggregatedSubCriteriaSumPairList[mainCriterionIndex][subCriterionIndex];
                aggregatedSubCriteriaSumPairList[mainCriterionIndex][subCriterionIndex][1] = String(parseFloat(subCriterionImportance) + parseFloat(subCriterionImportanceSumPair[1]));
            });
        });

        aggregatedSubCriteriaSumPairList.forEach((outerSumPairList, idx) => {
            outerSumPairList.forEach(sumPair => sumPair[1] = parseFloat(sumPair[1]));
        });

        console.log("Final aggregatedSubCriteriaSumPairList");
        console.log(aggregatedSubCriteriaSumPairList);

        return aggregatedSubCriteriaSumPairList;
    }

    function sortSubCriteria(subCriteriaAggregatedImportance) {
        const result = [];
        subCriteriaAggregatedImportance.forEach(outerSumPairList => {
            const sortedOuterSumPairList = outerSumPairList.sort((a, b) => {
                if (a[1] > b[1]) {
                    return -1;
                }
                if (a[1] < b[1]) {
                    return 1;
                }
                return 0;
            });
            result.push(sortedOuterSumPairList);
        });
        console.log("Sorted subCriteriaAggregatedImportance");
        console.log(subCriteriaAggregatedImportance);
        console.log("Sorted Result");
        console.log(result);
        return result;
    }

    function sortCriteriaByImporance(event) {
        event.preventDefault();

        //TODO: Validate the formfields
        toggleAllAccordions({ editingCriteriaDetails: false });
        $(".dataAccordionButton").attr("disabled", true);
        $(".sjDataAccordionButton").attr("disabled", false);

        $("#experts-list").attr("disabled", true);

        $("#sortImportance").attr("disabled", true);
        $("#submitForm").attr("disabled", false);
        $("#editCriteriaDetails").attr("disabled", false);

        var sortedMainCriteriaSumPairList = sortMainCriteria();
        sortedMainCriteriaImportance = sortedMainCriteriaSumPairList;
        setMainCriteriaSjHTML(sortedMainCriteriaSumPairList);

        var subCriteriaAggregatedImportance = aggregatedsubCriteriaImportance(subCriteriaImportance);
        var sortedSubCriteriaSumPairList = sortSubCriteria(subCriteriaAggregatedImportance);
        sortedSubCriteriaImportance = sortedSubCriteriaSumPairList;
        setSubCriteriaSjHTML(sortedSubCriteriaSumPairList);

    }

    function getSubToMainDict() {
        var subToMain = {};
        Object.entries(subCriteria).forEach(([mainCriterion, subCriteriaList]) =>
            subCriteriaList.forEach(subCriterion => subToMain[subCriterion] = mainCriteria[mainCriterion])
        );
        return subToMain;
    }

    function getSortedMainMeanSj() {
        // var mainMeanSJ = {};
        var mainMeanSjList = [];
        var sortedMainMeanSjList = [];
        var expertsCount = experts.length;
        mainCriteria.forEach(mainCriterion => mainMeanSjList.push([mainCriterion, 0]));

        Object.entries(mainCriteriaSj).forEach(([mcName_mcIndex_expert, mainSj]) => {
            var [mcName, mcIndex, expert] = mcName_mcIndex_expert.split("-");
            mainMeanSjList[mcIndex][1] = mainMeanSjList[mcIndex][1] + parseFloat(parseFloat(mainSj) / expertsCount);
        });

        sortedMainCriteriaImportance.forEach(crit_imp_pair => {
            var [mcName, mcIndex] = crit_imp_pair[0].split("-");
            sortedMainMeanSjList.push(mainMeanSjList[mcIndex]);
        });
        return sortedMainMeanSjList;
    }

    function getSortedSubMeanSj() {
        var subMeanSJ = {};
        var subMeanSjList = [];
        var sortedSubMeanSjList = [];
        var expertsCount = experts.length;
        // mainCriteria.forEach(mainCriterion=>mainMeanSjList.push([mainCriterion, 0]));

        Object.entries(subCriteriaSj).forEach(([mcName_mcIndex_scName_scIndex_expert, subSj]) => {
            var [mcName, mcIndex, scName, scIndex, expert] = mcName_mcIndex_scName_scIndex_expert.split("-");
            if (subMeanSJ[`${mcName}-${mcIndex}-${scName}-${scIndex}`] === undefined) {
                subMeanSJ[`${mcName}-${mcIndex}-${scName}-${scIndex}`] = 0;
            }
            subMeanSJ[`${mcName}-${mcIndex}-${scName}-${scIndex}`] = subMeanSJ[`${mcName}-${mcIndex}-${scName}-${scIndex}`] + parseFloat((parseFloat(subSj)) / (expertsCount));
        });

        sortedSubCriteriaImportance.forEach(outerSumPairList => {
            outerSumPairList.forEach(sumPair => {
                var [mcName, mcIndex, subCriterion, scIndex] = sumPair[0].split("-");
                sortedSubMeanSjList.push([subCriterion, subMeanSJ[sumPair[0]]]);
            })
        });

        // for (var mcName_mcIndex_scName_scIndex in subMeanSJ) {
        //     var [mcName, mcIndex, subCriterion, scIndex] = mcName_mcIndex_scName_scIndex.split("-");

        //     if (subMeanSJ.hasOwnProperty(mcName_mcIndex_scName_scIndex)) {
        //         subMeanSjList.push( [ subCriterion, subMeanSJ[mcName_mcIndex_scName_scIndex] ] );
        //     }
        // }
        return sortedSubMeanSjList;
    }

    function calculate_kj_qj(sj_ordered_list) {
        var kj_ordered_list = []
        var qj_ordered_list = []
        var qj_prev = 1
        var qj_sum = 1;

        sj_ordered_list.forEach(criterion_sj_pair => {
            var criterion = criterion_sj_pair[0]
            var sj = criterion_sj_pair[1]

            var kj = sj + 1;
            var qj = qj_prev / kj;
            qj_prev = qj;

            kj_ordered_list.push([criterion, kj]);
            qj_ordered_list.push([criterion, qj]);
            qj_sum += qj;
        });

        return [kj_ordered_list, qj_ordered_list, qj_sum];
    }

    function calculate_weights(sj_dict) {
        var [kj_dict, qj_dict, qj_sum] = calculate_kj_qj(sj_dict);
        var wj_ordered_list = [];
        var wj_dict = {};

        qj_dict.forEach(criterion_qj_pair => {
            var criterion = criterion_qj_pair[0];
            var qj = criterion_qj_pair[1];
            wj_ordered_list.push([criterion, (qj / qj_sum)])
            wj_dict[criterion] = (qj / qj_sum)
        });

        return [kj_dict, qj_dict, wj_ordered_list, wj_dict];
    }

    function calculate_global_weights(wj_main_dict, wj_sub, sub_to_main) {
        var global_weights = []
        wj_sub.forEach(criterion_sj_pair => {
            var sub_criterion = criterion_sj_pair[0];
            var wj_sub = criterion_sj_pair[1];
            var global_wt = wj_main_dict[sub_to_main[sub_criterion]] * wj_sub;

            global_weights.push([sub_criterion, global_wt])
        });

        return global_weights;
    }

    function sort_sub_criteria(global_weights) {
        global_weights.sort((a, b) => {
            if (a[1] > b[1]) {
                return -1;
            }
            if (a[1] < b[1]) {
                return 1;
            }
            return 0;
        });
        return global_weights;
    }

    function submitForm(event) {
        // event.preventDefault();
        var subToMain = getSubToMainDict();
        console.log("subToMain");
        console.log(subToMain);

        var mainMeanSj = getSortedMainMeanSj();
        mainCriteriaMeanSj = mainMeanSj;
        console.log("getSortedMeanSj");
        console.log(mainMeanSj);

        var subMeanSj = getSortedSubMeanSj();
        subCriteriaMeanSj = subMeanSj;
        console.log("subMeanSj");
        console.log(subMeanSj);

        $("#sub_to_main").val(Object.entries(subToMain));
        $("#main_sj").val(mainMeanSj);
        $("#sub_sj").val(subMeanSj);
        $("#submitRequiredDataForm").trigger("click");

        // var [kj_main, qj_main, wj_main, wj_main_dict] = calculate_weights(mainMeanSj)
        // console.log("wj_main");
        // console.log(wj_main);
        // console.log("wj_main_dict");
        // console.log(wj_main_dict);

        // var [kj_sub, qj_sub, wj_sub, wj_sub_dict] =  calculate_weights(subMeanSj)
        // console.log("wj_sub");
        // console.log(wj_sub);

        // var global_weights = calculate_global_weights(wj_main_dict, wj_sub, subToMain);
        // console.log("global_weights");
        // console.log(global_weights);

        // var sorted_global_weights = sort_sub_criteria(global_weights);
        // console.log("sorted_global_weights");
        // console.log(sorted_global_weights);

        // $("#requiredDataForm").clickFn();

        // $.ajax({
        //     type: 'POST',
        //     url: '/resultSWARA',
        //     contentType: 'application/json',
        //     dataType: 'json',
        //     processData: false,
        //     data: JSON.stringify({
        //         'main_sj' : mainMeanSj,
        //         'sub_sj':subMeanSj,
        //         'sub_to_main':subToMain
        //     }),
        //     success:function(response){ document.write(response);}
        // });
    }
});