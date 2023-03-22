// Get the url endpoints
const countries_url = "http://localhost:5000/api/v1/countries";
const cities_url = "http://localhost:5000/api/v1/cities"

// Initialize a data variable to hold JSON data here so that it can be used by various functions
let data;

// Fetch the JSON countries data using then function
d3.json(countries_url).then(function(data_response) {
    
    // Let the data variable hold the JSON data
    data = data_response;

    // Append options for the dropdown menu
    appendOptions();

    // Call the optionChanged function when the user selects a new option from the dropdown menu (the trigger event)
    d3.select("#selRegion").on("change", function() {
        optionChanged(this.value);
    });

    // Initialise the dashboard
    init();

});

// Function to append options to the dropdown menu and assign each region as option text and to the "value" property for each option
function appendOptions() {
    let regions = [];

    // Append options for the region dropdown menu
    data.forEach(function(d) {
        if (!regions.includes(d.region)) {
            let option = d3.select("#selRegion").append("option");
            option.text(d.region);
            option.attr("value", d.region);
            regions.push(d.region);
        }
    });

    // Append options for the sub-region dropdown menu based on the selected region
    // let subRegions = [];
    // let selectedRegion = d3.select("#selRegion").property("value");
    // data.filter(d => d.region === selectedRegion).forEach(function(d) {
    //   if (!subRegions.includes(d["sub-region"])) {
    //     let option = d3.select("#selSubRegion").append("option");
    //     option.text(d["sub-region"]);
    //     option.attr("value", d["sub-region"]);
    //     subRegions.push(d["sub-region"]);
    //   }
    // }); 
}

// function sub_regionChanged() {
//     // Add event listener to update sub-region options when region changes
//     d3.select("#selRegion").on(function() {
//         // Remove existing options
//         d3.selectAll("#selSubRegion option").remove();
//         // Append new options based on selected region
//         let subRegions = [];
//         let selectedRegion = d3.select("#selRegion").property("value");
//         data.filter(d => d.region === selectedRegion).forEach(function(d) {
//             if (!subRegions.includes(d["sub-region"])) {
//                 let option = d3.select("#selSubRegion").append("option");
//                 option.text(d["sub-region"]);
//                 option.attr("value", d["sub-region"]);
//                 subRegions.push(d["sub-region"]);
//             }
//         });
//     });
// }

// This function is called when the user selects a new option from the dropdown menu (the trigger event)
function optionChanged(selectedOption) {

    //Call the drawBarChart function to draw the horizontal bar chart for the selected option
    drawScatterPlot(selectedOption, data);

    // Call the drawRadarChart function to draw the radar chart for the selected option
    drawRadarChart(selectedOption, data);

}

// Initialises the page with the data for Europe
function init() {
    
    let defaultRegion = "Europe";
    // let defaultSubRegion = "All";
    
    //Call the drawScatterPlot function to draw the scatter plot for the default region
    drawScatterPlot(defaultRegion, data);

    //Call the drawRadarChart function to draw the radar chart for the default region
    drawRadarChart(defaultRegion, data);

    // // Set the default values for the dropdown menus
    // d3.select("#selRegion").property("value", defaultRegion);
    // d3.select("#selSubRegion").property("value", defaultSubRegion);
    
    // // Call the updateData function to update the data based on the default selections
    // updateData(defaultRegion, defaultSubRegion, "country");
    // d3.select("#selRegion").on("change", function () {
    //     updateData(this.value, d3.select("#selSubRegion").property("value"), getDisplayMode());
    // });
    
    // d3.select("#selSubRegion").on("change", function () {
    //     updateData(d3.select("#selRegion").property("value"), this.value, getDisplayMode());
    // });
    
    // d3.select("#btnCountry").on("click", function () {
    //     updateData(d3.select("#selRegion").property("value"), d3.select("#selSubRegion").property("value"), "country");
    // });
    
    // d3.select("#btnCity").on("click", function () {
    //     updateData(d3.select("#selRegion").property("value"), d3.select("#selSubRegion").property("value"), "city");
    // });

}

function getDisplayMode() {
    if (d3.select("#btnCountry").classed("active")) {
        return "country";
    } else {
        return "city";
    }
}
// Function to draw the scatter plot
function drawScatterPlot(region, data_js, displayMode) {
    
    // Filter the data to get only the countries for the input region
    let inputRegion = data_js.filter(country => country.region === region);

    // Sort the countries by country name in alphabetical order
    inputRegion.sort((a, b) => a.Countries.localeCompare(b.Countries));

    // Put the country names and their corresponding HDIs into arrays
    let country_names = [];
    let HDIs=[];
    for (let i=0; i<inputRegion.length; i++){
        country_names.push(inputRegion[i].Countries);
        HDIs.push(inputRegion[i]["HDI_index"]);
    }

    let trace = {
        x: country_names,
        y: HDIs,
        type: "scatter",
        mode: "markers",
        hovertext: country_names
    };

    let traceData = [trace];

    let layout = {
        title: `Human Development Index (HDI) of the Countries in ${region}`
    };
    
    Plotly.newPlot("scatter", traceData, layout);
}

function updateData(selectedRegion, selectedSubRegion, displayMode) {
    // Fetch new data based on the selected region, sub-region, and display mode (country or city)
    // You will need to modify this part to fetch the correct data for cities as well
    let filteredData = data.filter(item => (item.region === selectedRegion) && (selectedSubRegion === "All" || item["sub-region"] === selectedSubRegion));

    // Update the charts with the new data
    drawScatterPlot(selectedRegion, filteredData, displayMode);
    drawRadarChart(selectedRegion, filteredData, displayMode);
}

// Function to draw the radar chart
function drawRadarChart(region, data_js, displayMode) {

    // Filter the data to get only the countries for the input region
    let inputRegion = data_js.filter(country => country.region === region);

    // Sort the countries in inputRegion by "HDI Index 2021" in the descending order
    inputRegion.sort((a, b) => b["HDI_index_2021"] - a["HDI_index_2021"]);

    // Select the top 5 countries with the highest HDI
    let top_country = inputRegion[0];
    let second_top_country = inputRegion[1];
    let thrid_top_country = inputRegion[2];
    let fourth_top_country = inputRegion[3];
    let fifth_top_country = inputRegion[4];

    // Link to the "radar" id on the html file
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

    // Create the labels and datasets for the top 5 countries
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
