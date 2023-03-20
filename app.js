// Place url in a constant variable
const url = "https://api.spacexdata.com/v3/roadster"

//var out = "output.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

/*
// Initialize the dashboard at start up 
function init() {
    var out = "output.json"


    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(out).then((data) => {
        
        // Set a variable for the sample names
        let HDI_Rank = data.HDI_Rank;

        // Add  samples to dropdown menu
        HDI_Rank.forEach((HDI_Rank) => {

            // Log the value of id for each iteration of the loop
            console.log(HDI_Rank);

            dropdownMenu.append("option")
            .text(HDI_Rank)
            .property("value",HDI_Rank);
        });

        // Set the first sample from the list
        let output_1 = HDI_Rank[0];

        // Log the value of sample_one
        console.log(output_one);

        // Build the initial plots
        buildMetadata(output_one);
        buildBarChart(output_one);
    
    });
};

// Function that populates metadata info
function buildMetadata(output) {

    // Use D3 to retrieve all of the data
    d3.json(out).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == output);

        // Log the array of metadata objects after the have been filtered
        console.log(value)

        // Get the first index from the array
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Function that builds the bar chart
function buildBarChart(output) {

    // Use D3 to retrieve all of the data
    d3.json(out).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.output;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == output);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let HDI = valueData.HDI;
        let Life_expt = valueData.Life_expt;
        let schooling = valueData.schooling;

        // Log the data to the console
        //console.log(HDI), Life_expt, schooling);

        // Set top ten items to display in descending order
        let yticks = HDI_Rank.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = Countries.slice(0,10).reverse();
        let labels = Top_Ten_Countries.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 Countries with Highest HDI Ranking"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};


// Function that updates dashboard when sample is changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    buildMetadata(value);
    buildBarChart(value);
};

// Call the initialize function
init();
*/