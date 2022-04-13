$(document).ready(function() {
var experts = [];
var mainCriteria = [];
var subCriteria = {};
var subCriteriaCount = 0;


$(".sub-criteria-list, #experts-list, #main-criteria-list").on('change keyup paste', countAndUpdateLists);
$("#sub-criteria-card-body").on('change keyup paste', ".sub-criteria-list", countAndUpdateLists);

function countAndUpdateLists(event){
    
    var name = event.target.name;
    var id = event.target.id;
    var list = $(`#${id}`).val();
    console.log(id);
    console.log(list);
    var splittedList = list.split(",");
    var cleanedList = [];

    splittedList.forEach(element => {
        var trimmedElement = element.trim();
        if(trimmedElement !== '')
            cleanedList.push(trimmedElement);
        }
    );
    console.log(id);
    console.log(name);
    console.log(cleanedList);

    switch(id){
        case "experts-list":
            $("#experts-count").text(cleanedList.length);
            experts = cleanedList;
            break;
    
        case "main-criteria-list":
            $("#main-criteria-count").text(cleanedList.length);
            mainCriteria = cleanedList;
            var subCrtieriaFormHTML = "";
            mainCriteria.forEach((criterion, index)=>{
                subCrtieriaFormHTML += getSubCriteriaRowHTML(criterion, index);
                subCriteria[index] = [];
            });
            $("#sub-criteria-card-body").html(subCrtieriaFormHTML);
            break;
        }
        if(id.includes("sub-criteria-list-for--")){
            var split = id.split("--");
            
            var mainCriterionIndex = split[split.length-1];
            subCriteria[mainCriterionIndex] = cleanedList;
            var count = 0;
            
            Object.entries(subCriteria).forEach(([key, value])=>{
                count+= value.length;
            });
            
            console.log(subCriteria);
            subCriteriaCount = count;
            $("#sub-criteria-count").text(subCriteriaCount);}
            
        
}

function getSubCriteriaRowHTML( mainCriterionName, mainCriterionIndex){
    var html = "";

    html += "<div>"
    html += "<div class=' align-items-center'>";
    html += `<p class='mb-2 mr-6'>Sub-Criteria for ${mainCriterionName}</p>`;
    html += `<input id='sub-criteria-list-for--${mainCriterionName}--${mainCriterionIndex}' type='text' name='sub-criterion-names-for-${mainCriterionName}-${mainCriterionIndex}' class='sub-criteria-list ml-2 form-control m-input' placeholder='Enter sub-criteria for ${mainCriterionName}' autocomplete='off'>`;
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


});