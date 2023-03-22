// Get the samples endpoint
const countries_url = "project3/output/countries_final.json";
// Initialize a data variable to hold JSON data here so that it can be used by various functions
let data;
// Fetch the JSON data using then function
d3.json(countries_url).then(function(data_response) {
    // Let the data variable hold the JSON data
    data = data_response;
    // Append options for the dropdown menu
    appendOptions();
    // Call the optionChanged function when the user selects a new option from the dropdown menu (the trigger event)
    d3.select("#selDataset").on("change", function() {
        optionChanged(this.value);
    });
    //Initialise the dashboard
    init();
});
// Function to append options to the dropdown menu and assign each name as option text and to the "value" property for each option
function appendOptions () {
    for (let i = 0; i < data.length; i++) {
        // check if the region already exists
        let existingOption = d3.selectAll("#selDataset option").filter(function() {
            return d3.select(this).text() === data[i].region;
        });
        if (existingOption.empty()) {
            // add new region if it doesn't exist
            let option = d3.select("#selDataset").append("option");
            option.text(data[i].region);
            option.attr("value", data[i].region);
        }
    }
});


// Initialises the page to default
function init() {
    let defaultRegion = "Europe";

   
// Function to draw the bar chart
function drawBarChart(region, data_js) {
    // Filter the data samples to get the sample data for the input ID
    let inputRegion = data_js.filter(country => country.region === region);
    // Sort the inputSample by sample_values in the descending order
    inputRegion.sort((a, b) => b["Human Development Index (HDI)"] - a["Human Development Index (HDI)"]);
    // Slice the top 10 values and reverse the array to accommodate Plotly's defaults
    slicedReversedRegion = inputRegion.slice(0, 10).reverse();
    let country_names = [];
    let HDIs=[];
    for (i=0; i<slicedReversedRegion.length; i++){
        country_names.push(slicedReversedRegion[i].Countries);
        HDIs.push(slicedReversedRegion[i]["Human Development Index (HDI)"]);
    }
    let trace = {
        x: HDIs,
        y: country_names,
        type: "bar",
        title: "Top 10 Countries According to HDI"
    };
    let traceData = [trace];
    let layout = {
        title: "Top 10 Countries by Human Development Index (HDI)"
    };
    Plotly.newPlot("bar", traceData, layout);
}

// Function to append options to the dropdown menu and assign each name as option text and to the "value" property for each option
function appendOptions () {
    for (let i = 0; i < data.length; i++) {
        // check if the subregion already exists
        let existingOption = d3.selectAll("#selDataset option").filter(function() {
            return d3.select(this).text() === data[i].subregion;
        });
        if (existingOption.empty()) {
            // add new subregion if it doesn't exist
            let option = d3.select("#selDataset").append("option");
            option.text(data[i].subregion);
            option.attr("value", data[i].subregion);
        }
    }
};







