// Get the samples endpoint
const countries_url = "../../Data/output/countries_final.json";

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
};

// This function is called when the user selects a new option from the dropdown menu (the trigger event)
function optionChanged(selectedOption) {

    //Call the drawBarChart function to draw the horizontal bar chart for the selected option
    drawBarChart(selectedOption, data);

    // //Call the drawBubbleChart function to draw the bubble chart for the selected option
    // drawBubbleChart(selectedOption, data);

    // //Call the showMetadata function to show the metadata for the selected option
    // showMetadata(selectedOption, data);
}

// Initialises the page with the data for ID = 940
function init() {
    
    let defaultRegion = "Europe";

    //Call the drawBarChart function to draw the horizontal bar chart for the default ID
    drawBarChart(defaultRegion, data);

    // //Call the drawBubbleChart function to draw the bubble chart for the default ID
    // drawBubbleChart(defaultRegion, data);

    // //Call the showMetadata function to show the metadata for the default ID
    // showMetadata(defaultRegion, data);
}

// Function to draw the horizontal bar chart
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
        orientation: "h",
        title: "Top 10 Countries According to HDI"
    };

    let traceData = [trace];

    let layout = {
        title: "Top 10 Countries by Human Development Index (HDI)"
    };
    
    Plotly.newPlot("bar", traceData, layout);

}

// Function to draw the bubble chart
function drawBubbleChart(ID, data_js) {

    // Filter the data samples to get the sample data for the input ID
    let inputSample = data_js.samples.filter(sample => sample.id === ID);
    
    let trace = {
        x: inputSample[0].otu_ids,
        y: inputSample[0].sample_values,
        text: inputSample[0].otu_labels,
        mode: "markers",
        marker: {
            size: inputSample[0].sample_values,
            color: inputSample[0].otu_ids
        }
    };

    let traceData = [trace];

    let layout = {
        hovermode: "closest",
        xaxis: {title: "OTU ID"},
    };

    Plotly.newPlot("bubble", traceData, layout);

}

// // Function to show the metadata
// function showMetadata(ID, data_js) {
    
//     // Filter the data samples to get the metadata for the input ID
//     let inputDemographic = data_js.metadata.filter(individual => individual.id == ID);

//     // Select the div with "sample-metadata" as its id
//     let demographicInfo = d3.select("#sample-metadata");

//     // Clear out any pre-existing metadata
//     demographicInfo.html("");

//     // Use Object.entries to iterate over the key-value pairs of the first object in the inputDemographic array
//     // and then append an h5 element to the sample-metadata div for each key-value pair, with the key and value concatenated into a string.
//     Object.entries(inputDemographic[0]).forEach(([key, value]) => {
//         demographicInfo.append("h5").text(`${key}: ${value}`);
//     });

// }