// Get the samples endpoint
const countries_url = "output/countries_final.json";

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
    
    // Create an object to hold subregions by region
    // let subregionsByRegion = {};

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

            // Initialize subregions array for the new region
            // subregionsByRegion[data[i].region] = [];
        }

        // Add subregion to its parent region's array
        // subregionsByRegion[data[i].region].push(data[i]["sub-region"]);
    }

//     // Create subregion dropdown menus for each region
//     for (let region in subregionsByRegion) {
//         let subregionSelect = d3.select("#selDataset2" + region.replace(/\s+/g, '-'));
//         subregionSelect.selectAll("option").remove();
//         subregionSelect.append("option").text("All");
//         for (let subregion of subregionsByRegion[region]) {
//             // check if the region already exists
//             let existingOption = d3.selectAll("#selDataset2 option").filter(function() {
//                 return d3.select(this).text() === data[i]["sub-region"];
//             });
//             if (existingOption.empty()) {
//                 let subregionOption = subregionSelect.append("option");
//                 subregionOption.text(subregion);
//                 subregionOption.attr("value", subregion);
//             }
//         }
//         // Set up event listener to trigger when the region select menu changes
//         let regionSelect = d3.select("#selDataset");
//         regionSelect.on("change", function() {
//             updateSubregionOptions(subregionsByRegion);
//         });
//     }
//     console.log(subregionsByRegion)
};

// // Function to update subregion options based on the selected region
// function updateSubregionOptions(subregionsByRegion) {
//     let selectedRegion = d3.select("#selDataset").node().value;
//     for (let region in subregionsByRegion) {
//         let subregionSelect = d3.select("#selDataset2" + region.replace(/\s+/g, '-'));
//         if (region === selectedRegion) {
//             subregionSelect.style("display", "block");
//         } else {
//             subregionSelect.style("display", "none");
//         }
//     }
// }

// This function is called when the user selects a new option from the dropdown menu (the trigger event)
function optionChanged(selectedOption) {

    //Call the drawBarChart function to draw the bar chart for the selected option
    drawScatterPlot(selectedOption, data);

    // Call the drawBubbleChart function to draw the bubble chart for the selected option
    drawRadarChart(selectedOption, data);

}

// Initialises the page with the data for ID = 940
function init() {
    
    let defaultRegion = "Europe";

    //Call the drawScatterPlot function to draw the scatter plot for the default ID
    drawScatterPlot(defaultRegion, data);

    //Call the drawBubbleChart function to draw the bubble chart for the default ID
    drawRadarChart(defaultRegion, data);

}

// Function to draw the scatter plot
function drawScatterPlot(region, data_js) {
    
    // Filter the data samples to get the sample data for the input ID
    let inputRegion = data_js.filter(country => country.region === region);

    inputRegion.sort((a, b) => a.Countries.localeCompare(b.Countries));

    let country_names = [];
    let HDIs=[];
    for (let i=0; i<inputRegion.length; i++){
        country_names.push(inputRegion[i].Countries);
        HDIs.push(inputRegion[i]["Human Development Index (HDI)"]);
    }

    let trace = {
        x: country_names,
        y: HDIs,
        type: "scatter",
        mode: "markers"
    };

    let traceData = [trace];

    let layout = {
        title: `Human Development Index (HDI) of the Countries in ${region}`
    };
    
    Plotly.newPlot("scatter", traceData, layout);
}

// Function to draw the radar chart
function drawRadarChart(region, data_js) {

    // Filter the data samples to get the sample data for the input ID
    let inputRegion = data_js.filter(country => country.region === region);

    // Sort the inputSample by sample_values in the descending order
    inputRegion.sort((a, b) => b["Human Development Index (HDI)"].localeCompare(a["Human Development Index (HDI)"]));
    let top_country = inputRegion[0];
    let second_top_country = inputRegion[1];
    let thrid_top_country = inputRegion[2];
    let fourth_top_country = inputRegion[3];
    let fifth_top_country = inputRegion[4];

    let marksCanvas = document.getElementById("radar");

    // Check if there's an existing chart
    let chartExists = Chart.getChart(marksCanvas);

    // If a chart exists, destroy it
    if (chartExists) {
        chartExists.destroy();
    }
    
    Chart.defaults.font.family = "Lato";
    Chart.defaults.font.size = 22;
    Chart.defaults.color = "black";

    let marksData = {
    labels: ["LPP Index", "Crime Rate", "Healthcare Index"],
    datasets: [
        {
            label: top_country.Countries,
            backgroundColor: "#FFF17644",
            borderColor: "black",
            borderWidth: 1,
            data: [top_country.LPP_index, top_country.crime_index, top_country.healthcare_index]
        },
        {
            label: second_top_country.Countries,
            backgroundColor: "#FFA50044",
            borderColor: "black",
            borderWidth: 1,
            data: [second_top_country.LPP_index, second_top_country.crime_index, second_top_country.healthcare_index]
        },
        {
            label: thrid_top_country.Countries,
            backgroundColor: "#00FF0044",
            borderColor: "black",
            borderWidth: 1,
            data: [thrid_top_country.LPP_index, thrid_top_country.crime_index, thrid_top_country.healthcare_index]
        },
        {
            label: fourth_top_country.Countries,
            backgroundColor: "#0000FF44",
            borderColor: "black",
            borderWidth: 1,
            data: [fourth_top_country.LPP_index, fourth_top_country.crime_index, fourth_top_country.healthcare_index]
        },
        {
            label: fifth_top_country.Countries,
            backgroundColor: "#80008044",
            borderColor: "black",
            borderWidth: 1,
            data: [fifth_top_country.LPP_index, fifth_top_country.crime_index, fifth_top_country.healthcare_index]
        }
    ]
    };

    let chartOptions = {
    plugins: {
        title: {
        display: true,
        align: "center",
        text: "Data for the Top 5 Countries with the Highest HDI"
        },
        legend: {
        align: "center"
        }
    },
    scales: {
        r: {
        pointLabels: {
            font: {
            size: 20
            }
        }
        }
    }
    };

    new Chart(marksCanvas, {
        type: "radar",
        data: marksData,
        options: chartOptions
    });

}
