<template>
  <div id="map"></div>
  <div id="buttons_panel">
    <button id="create_button" :disabled="coordinates[0].length < 3" @click="createNewPlot">Create Plot</button>
    <button id="reset_button" :disabled="coordinates[0].length === 0" @click="resetNewPlot">Reset Plot</button>
    <button id="remove_last" :disabled="coordinates[0].length === 0" @click="removeLastPoint">Remove Last Point</button>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {createPlot, getPlots} from "../api/plot";

export default {
    data() {
      return {
        map: {},
        plots: [],
        newPlot: {},
        newGeoJSON: {},
        coordinates: [[ ]],
      }
    },

    methods: {
      handleMapClick(event) {
        this.coordinates[0].push([event.lngLat.lng, event.lngLat.lat]);
        this.map.getSource('newPolygon').setData(this.newGeoJSON);
      },
      resetNewPlot() {
        this.coordinates[0] = [];
        this.map.getSource('newPolygon').setData(this.newGeoJSON);
      },
      removeLastPoint() {
        this.coordinates[0].pop();
        this.map.getSource('newPolygon').setData(this.newGeoJSON);
      },

      async createNewPlot() {
        try {
          const plot = await createPlot({
            data: {
              zoom: this.map.getZoom(),
              coordinates: this.coordinates[0],
            }
          });
          this.plots.push(plot);
          this.addPlotToMap([plot.attributes.coordinates], `polygon${this.plots.length - 1}`);
          this.resetNewPlot();
        } catch (error) {
          console.log(error.message);
        }
      },
      async fetchPlots() {
        try {
          this.plots = await getPlots();
        } catch (error) {
          console.log(error.message);
        }
      },

      addLayer(id, type, source, paint) {
        this.map.addLayer({
          id,
          type,
          source,
          layout: {},
          paint,
        });
      },
      addPlotToMap(coordinates, sourceName) {
        const plot = {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates,
            }
          }
        };
        this.map.addSource(sourceName, plot);
        this.addLayer(`${sourceName}Fill`, 'fill', sourceName, { 'fill-color': '#092dd7', 'fill-opacity': 0.5 });
        this.addLayer(`${sourceName}Outline`, 'line', sourceName, { 'line-color': '#092dbb', 'line-width': 2 });
      }
    },

    beforeMount() {
      this.fetchPlots();
    },

    mounted() {
      mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_TOKEN;

      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [26.728, 58.378],
        zoom: 2,
        projection: { name: "globe" }
      });

      this.map.on('load', () => {
        this.plots.map((plot, key) => {
          this.addPlotToMap([plot.attributes.coordinates], `polygon${key}`);
        });

        this.newGeoJSON = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: this.coordinates,
          },
        };
        this.newPlot = {
          type: 'geojson',
          data: this.newGeoJSON,
        }
        this.map.addSource('newPolygon', this.newPlot);
        this.addLayer('newPolygonFill', 'fill', 'newPolygon', { 'fill-color': '#be65b9', 'fill-opacity': 0.5 });
        this.addLayer('newPolygonOutline', 'line', 'newPolygon', { 'line-color': '#222', 'line-width': 2 });

        this.map.on('click', this.handleMapClick);
      });
    }
  }
</script>

<style scoped>
  #map {
    width: 100vw;
    height: 100vh;
  }

  #buttons_panel {
    position: absolute;
    top: 0;
    right: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  button {
    display: inline-block;
    outline: 0;
    cursor: pointer;
    padding: 5px 16px;
    font-size: 18px;
    font-weight: bold;
    line-height: 20px;
    vertical-align: middle;
    border-radius: 6px;
    color: #ffffff;
    border: 1px solid #1b1f2326;
    box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0 0, rgba(255, 255, 255, 0.25) 0 1px 0 0 inset;
    transition: 0.2s cubic-bezier(0.3, 0, 0.5, 1);
    transition-property: color, background-color, border-color;
    margin-bottom: 25px;
  }
  button:hover {
    border-color: #1b1f2326;
    transition-duration: 0.1s;
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }

  #create_button {
    background-color: #2ea44f;
  }
  #create_button:hover {
    background-color: #2c974b;
  }
  #create_button:disabled {
    background-color: #2ea44f !important;
  }

  #reset_button {
    background-color: #c54325;
  }
  #reset_button:hover {
    background-color: #ad3c21;
  }
  #reset_button:disabled {
    background-color: #c54325 !important;
  }

  #remove_last {
    background-color: #2061e3;
  }
  #remove_last:hover {
    background-color: #1c58ce;
  }
  #remove_last:disabled {
    background-color: #2061e3 !important;
  }
</style>
