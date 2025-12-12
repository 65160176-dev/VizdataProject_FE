<template>
    <apexchart
          type="area"
          height="400"
          :options="chartOptions"
          :series="series"
        ></apexchart>
</template>
<script setup>
import { ref } from "vue";

const series = ref([
  {
    name: "STOCK ABC",
    data: [5, 9, 7, 8, 5, 3, 5, 4],
  },
]);

const chartOptions = ref({
  chart: {
    type: "area",
    height: 400,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  colors: ["#F98085"],
  title: {
    show: false,
  },
  subtitle: {
    show: false,
  },
  labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
  xaxis: {},
  yaxis: {
    opposite: false,
  },
  legend: {
    show: true,
  },
});
</script>

<style>
/* Add your styles here */
</style>
