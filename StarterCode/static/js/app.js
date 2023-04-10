const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
d3.json(url).then(function(data) {
});

function init() {
    let dropdownMenu = d3.select("#selDataset");
    d3.json(url).then((data) => {
        let names = data.names;
        names.forEach((id) => {
            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });
        let sample_one = names[0];
        build_meta_data(sample_one);
        build_Chart(sample_one);
    });
};
//
function build_meta_data(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);
        let valueData = value[0];
        d3.select("#sample-metadata").html("");
        Object.entries(valueData).forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};
// Decalring the function buildchart which will create the required charts on the page
function build_Chart(sample) {
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);
        let valueData = value[0];
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };
        let layout = {
            title: "Top 10 OTUs"
        };
        Plotly.newPlot("bar", [trace], layout)
        
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };
        let layout1 = {
            title: "Bacteria Bubble Chart",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };
        Plotly.newPlot("bubble", [trace1], layout1)
    });

};
// Here we are calling the function 
function optionChanged(value) { 
    build_meta_data(value);
    build_Chart(value);
};
init();