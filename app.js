

// Función para graficar (Bar, gauge, bubble)

function getPlot(id) {

    // obteniendo los datos the json file

    d3.json("samples.json").then((data)=> {
       
        // wfreq es la frecuencia del lavado de manos semanal
        var metadata = data.metadata;
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        var wfreq = result.wfreq;
        // filtramos las muestras por ID
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        // Obtenemos el top 10  de la muestras orden
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        // Obtenelos el top 10 OTU and y lo ponemos en orden. 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        // concatenamos el OTU con el ID de OTU para los lables
        var OTU_id = OTU_top.map(d => "OTU " + d+" ")
        // Hacaemos los lables
        var labels = samples.otu_labels.slice(0, 10);
        // creamos el trace para la grafica
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(255, 141, 84)'},
            type:"bar",
            orientation: "h",
        };

        // Creamos  data variable
        var data = [trace];
        // Creamos el  layout 
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
        // Creamos la grafica de barra
        Plotly.newPlot("bar", data, layout);
       

        // Grfaica de burbuja
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };
        // Layout for the Bubble plot
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
        // Creamos la data variable 
        var data1 = [trace1];
        // Creamos la grafica de burbuja
        Plotly.newPlot("bubble", data1, layout_b); 

  

        // The guage chart

      function buildGauge(wfreq) {

        // metemos el valor del wasing frecuency y lo normalizamos entre 0 y 180
        var level = parseFloat(wfreq) * 20;
        // Cálculo tigonometrico para ver donde queda el putno
        var degrees = 180 - level;
        var radius = 0.5;
        var radians = (degrees * Math.PI) / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
      
        // creamos el triángulo que marca
        var mainPath = "M -.0 -0.05 L .0 0.05 L ";
        var pathX = String(x);
        var space = " ";
        var pathY = String(y);
        var pathEnd = " Z";
        var path = mainPath.concat(pathX, space, pathY, pathEnd);
        var data = [
          {
            type: "scatter",
            x: [0],
            y: [0],
            marker: { size: 12, color: "850000" },
            showlegend: false,
            name: "Freq",
            text: level,
            hoverinfo: "text+name"
          },
      
          {
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90,
            text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            textinfo: "text",
            textposition: "inside",
            marker: {
              colors: [
                "rgba(0, 105, 11, .5)",
                "rgba(10, 120, 22, .5)",
                "rgba(14, 127, 0, .5)",
                "rgba(110, 154, 22, .5)",
                "rgba(170, 202, 42, .5)",
                "rgba(202, 209, 95, .5)",
                "rgba(210, 206, 145, .5)",
                "rgba(232, 226, 202, .5)",
                "rgba(240, 230, 215, .5)",
                "rgba(255, 255, 255, 0)"
              ]
            },
      
            labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            hoverinfo: "label",
            hole: 0.5,
            type: "pie",
            showlegend: false
          }
      
        ];
      
        var layout = {
          shapes: [
            {
              type: "path",
              path: path,
              fillcolor: "850000",
              line: {
                color: "850000"
              }
            }
          ],
      
          title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
          height: 500,
          width: 500,
          xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
          },
      
          yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
          }
        };
        var GAUGE = document.getElementById("gauge");
        Plotly.newPlot(GAUGE, data, layout);
      }
      buildGauge(wfreq);
      });
  }  


// Funcion poara obtener la infromación del Json file
function getInfo(id) {
    // leemos el json y obtenemos los datos en data
    d3.json("samples.json").then((data)=> {
        //  obtenemos los datos de metadata para el panel demográfico
        var metadata = data.metadata;
        //console.log(metadata)
        // filtramos el metadatada ppro id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        //console.log(metadata);
        var frecuencia = result.wfreq
        //console.log(frecuencia);
        // seleccionamos el #sample-metadata 
        var demographicInfo = d3.select("#sample-metadata");
        // limpiemoa lo que hay
        demographicInfo.html("");
        // ponemos la información
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });

    });

}



// creamos la unfion pata cuando cambianmos el evento
function optionChanged(id) {
   
    getPlot(id);
    getInfo(id);
}



// cramos la funcion de inicio
function init() {

    // selecionamos el  dropdown menu 
    var dropdown = d3.select("#selDataset");
    // leemos los  data 
    d3.json("samples.json").then((data)=> {
        //console.log(data)
        // obtenemos el id del data  y lo ponemos el en  dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
        // Llamamos a las funciones de obtencion de datso y grafica del primer elemento
        getPlot(data.names[0]);
        getInfo(data.names[0]);

    });

}



init();