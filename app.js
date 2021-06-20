function getData(sample) {
    d3.json("samples.json").then((data) => {
      console.log(data)

      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var filteredMetadata = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = filteredMetadata[0];
      // select with id of `#sample-metadata`
      var selectPanel = d3.select("#sample-metadata");
      //clear any existing metadata
      selectPanel.html("");
      Object.entries(result).forEach(([key, value]) => {
        selectPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });

    });
  }
  //dropdown menu
  function init() {
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample);
      });
  
      // Use the first sample the list to buildplots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      getData
    (firstSample);
    });
  }

  function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var filteredMetadata = samples.filter(sampleObj => sampleObj.id == sample);
      var result = filteredMetadata[0];

      //labels for chart
      var otu_ids = result.otu_ids;
      //hover text for charts
      var otu_labels = result.otu_labels;
      //values for chart
      var sample_values = result.sample_values;

      //build bar graph
      var barChart= [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
          marker: {
            color: otu_ids,
            colorscale: "RdBu"
          }
        }
      ];
  
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 170 }
      };
  
      Plotly.newPlot("bar", barChart, barLayout);
  
      // Build a Bubble Chart
      var bubbleChart = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Picnic"
          }
        }
      ];

      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        margin: { t: 50},
        hovermode: "closest",
      };
  
      Plotly.newPlot("bubble", bubbleChart, bubbleLayout);
  
      var yticks = otu_ids.slice(0, 5).map(otuID => `OTU ${otuID}`).reverse();

    });
  }
  
  function optionChanged(newSelect) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSelect);
    getData
  (newSelect);
  }
  
  init();
  