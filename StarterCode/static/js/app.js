

// function the populates the metadata
function demoInfo(sample) {
    //console.log(sample);

    d3.json("samples.json").then((data) => {
        let metaData = data.metadata;
        //console.log(metaData);

        //filter based on the value of the sameple 
        let result = metaData.filter(sampleResults => sampleResults.id == sample);
        //console.log(result);

        // access index 0 from the array
        let resultData = result[0];
        //console.log(resultData);

        //clear meta data
        d3.select("#sample-metadata").html("");


        // use object.entries to get value keypairs
        Object.entries(resultData).forEach(([key, value]) => {
            //add to the sample data / demographics
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        })

    });
}


// function that builds the bar chart
function buildBarChart(sample) {
    //let data = d3.json("samples.json");

    d3.json("samples.json").then((data) => {
        let sampleData = data.samples;
        //console.log(metaData);

        //filter based on the value of the sameple 
        let result = sampleData.filter(sampleResults => sampleResults.id == sample);
        //console.log(result);

        // access index 0 from the array
        let resultData = result[0];
        //console.log(resultData);

        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        //console.log(otu_ids);
        //console.log(otu_labels);
        //console.log(sample_values);

        // build bar chart 
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        //console.log(yticks);
        let xValues = sample_values.slice(0, 10);
        let textLabels = otu_labels.slice(0, 10);

        let barChart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        }

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };
        Plotly.newPlot("bar", [barChart], layout);

    });


}


// function that builds the bubble chart
function buildBubbleChart(item){
    d3.json("samples.json").then((data) => {
        let sampleData = data.samples;
        //console.log(metaData);

        //filter based on the value of the sameple 
        let result = sampleData.filter(sampleResults => sampleResults.id == item);
        //console.log(result);

        // access index 0 from the array
        let resultData = result[0];
        //console.log(resultData);

        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        //console.log(otu_ids);
        //console.log(otu_labels);
        //console.log(sample_values);

        // build bar chart 
        //let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        //console.log(yticks);
        //let xValues = sample_values.slice(0, 10);
        //let textLabels = otu_labels.slice(0, 10);

        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }

        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };
        Plotly.newPlot("bubble", [bubbleChart], layout);

    });
}


// function that initializes the dashboard
function initialize() {
    let data = d3.json("samples.json");
    //console.log(data);

    // access the drop down filter in html
    var select = d3.select("#selDataset");

    // use d3.json in order to get the data
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names;
        //console.log(sampleNames);

        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);
        });


        // pass in respective sample
        let sample1 = sampleNames[0];

        // call function to build meta data
        demoInfo(sample1);
        // call function to build bar chart
        buildBarChart(sample1);
        buildBubbleChart(sample1);


    });

};

function optionChanged(item) {
    //call update to metadata
    demoInfo(item);
    //console.log(item)
    buildBarChart(item);
    buildBubbleChart(item);
}



// function that updates the dashboard


// call the initialize function
initialize();