<template>
     <div class="col-xl-6 xl-100">
                        <div class="card">
                            <div class="card-header">
                                <h5>Market Value</h5>
                            </div>
                            <div class="card-body">
                                
                                    <apexchart
          type="bar"
          height="300"
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
    name: "Net Profit",
    data: [44, 55, 57, 56, 61, 58, 63, 60],
  },
  {
    name: "Revenue",
    data: [76, 85, 101, 98, 87, 105, 91, 114],
  },
]);

const chartOptions = ref({
  chart: {
    type: "bar",
    height: 300,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: false,
    width: 1,
    colors: ["#A7A7A7", "#F98C91"],
  },
  xaxis: {
    categories: ["100", "200", "300", "400", "500", "600", "700", "800"],
  },
  yaxis: {
    title: {
      text: "",
    },
  },
  fill: {
    opacity: 2,
    colors: ["#F98C91", "#A7A7A7"],
  },
  legend: {
    show: false,
  },
  plotOptions: {
    bar: {
     
      columnWidth: "32%",
      distributed: false,
    },
  },
  tooltip: {
    y: {
      formatter: (val) => `$ ${val} thousands`,
    },
  },
});
</script>

