<template>
     <div class="col-sm-12">
                        <div class="card">
                            <div class="card-header">
                                <h5>Buy / Sell</h5>
                                
                            </div>
                            <div class="card-body sell-graph">
                                <apexchart
            type="line"
            height="350"
            :options="chartOptions"
            :series="series"
          ></apexchart>
                            </div>
                        </div>
                    </div>
</template>
<script setup>
import { ref } from "vue";

const series = ref([
  {
    name: "",
    data: [30, 5, 80, 10, 100, 10],
  },
  {
    name: "",
    data: [0, 50, 20, 70, 30, 27],
  },
  {
    name: "",
    data: [0, 30, 40, 10, 86, 40],
  },
]);

const chartOptions = ref({
  chart: {
    height: 350,
    type: "line",
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ["#38C9CA", "#A5A5A5", "#F98085"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [2, 2, 2],
    curve: "smooth",
    dashArray: [0, 0, 0],
  },
  title: {
    show: false,
  },
  legend: {
    tooltipHoverFormatter: (val, opts) => {
      return `${val} - ${opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]}`;
    },
  },
  markers: {
    size: 0,
    hover: {
      sizeOffset: 6,
    },
  },
  xaxis: {
    categories: ["1 min", "10 min", "20 min", "30 min", "40 min", "50 min"],
  },
  tooltip: {
    y: [
      {
        title: {
          formatter: (val) => val,
        },
      },
      {
        title: {
          formatter: (val) => val,
        },
      },
      {
        title: {
          formatter: (val) => val,
        },
      },
    ],
  },
  grid: {
    borderColor: "#f1f1f1",
  },
});
</script>

<style>
/* Add your styles here if needed */
</style>
