
var currentMetaData, currentSampleData; // global variables; 

function init() { 			// Visit '/names' ⟶ default route (app.py)
	var selector = d3.select("#selDataset"); // dropdown selector
	var default_url = '/names';

	d3.json(default_url).then( // Parameter=JSON list of names
		sampleNames => {
			sampleNames.forEach(
				sample => {
					selector
						.append("option") // append options for dropdown selection
						.text(sample)     // add text
						.property("value", sample);
				});
			const firstSample = sampleNames[0]; // 1st Sample
			getSampleData(firstSample)
			console.log(firstSample)
		});	   // Return ⟶ Function Calls buildCharts(firstSample) & buildMetaData(firstSample);

};					// Operations ⟶ Adds sample options to # & Returns 1 ⟶ Calls buildCharts(1) & buildMetaData(1);

function getSampleData(newSample) {	//  Dropdown Change ⟶ New Sample Selected
	d3.json(`/metadata/${newSample}`)
		.then(
			newMetaData => {
				currentMetaData = newMetaData;
				buildMetaData(newMetaData)
				console.log(`calling buildMetaData(${newMetaData})`)
			})

	d3.json(`/samples/${newSample}`)
		.then(
			newSampleData => {
				currentSampleData = newSampleData;
				buildCharts(newSampleData)
				console.log(`calling buildCharts(${newSampleData})`)
			})
}; 					// Return ⟶ function calls ⟶ buildCharts(newSample) & buildMetaData(newSample);

function buildMetaData(newSample) { 	// access key/value pairs from @ metadata route & construct panel  
	
	var metaPanel = d3.selectAll('.panel-body')
	metaPanel.selectAll('p').html('')  // clear metaPanel to prepare for new data; 
	metaPanel.append('p')
		.html(`
			<strong>Sample:</strong> ${newSample.sample},<br>
			<strong>Age:</strong> ${newSample.AGE},<br>
			<strong>Belly Button Type:</strong> ${newSample.BBTYPE},<br>
			<strong>Ethnicity:</strong> ${newSample.ETHNICITY},<br>
			<strong>Gender:</strong> ${newSample.GENDER},<br>
            <strong>Location:</strong> ${newSample.LOCATION},<br>
            <strong>Max Temp:</strong> ${newSample.MMAXTEMP013},<br>
			<strong>Washing Frequency:</strong> ${newSample.WFREQ}.<br>`
			)
	// Object.entries(newSample).forEach(([key, value])=>console.log(key + ':' + value));
};					// Return ⟶ Metadata Panel

function buildCharts(sample) { 		// build bubble chart & pie chart for sample data

	var trace_pie = {
		values: sample.sample_values,	// performed in pd df//.slice(0,10),
		labels: sample.otu_ids,         // performed in pd df//.slice(0,10),
		type: 'pie'

	};
	var data_pie = [trace_pie]; //data must be an array; so converted here; 
	var layout_pie = {
		title: "Operational Taxonomic Unit (OTU)",
	};
	Plotly.newPlot('pie', data_pie, layout_pie); // pie chart

	var trace1 = {
		x: sample.otu_ids, // Operational Taxonomic Units
		y: sample.sample_values,
		text: sample.otu_labels,
		mode: 'markers',
		marker: {
		  size: sample.sample_values,
		  color: sample.otu_ids
		}
	      };
	      
	var data = [trace1];
	      
	var layout = {
		title: 'OTU Marker Size for Sample Selected',
		showlegend: false,

	      };
		  
		  
	Plotly.newPlot('bubble', data, layout);
};					// // Return ⟶ append each chart to html

init();					// Return ⟶ Function Call init()