<template>
     <div class="col-sm-12">
                        <div class="card">
                            <div class="card-header">
                                <h5>Sales Status</h5>
                               
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-xl-3 col-sm-6 xl-50">
                                        <div class="order-graph">
                                            <h6>Orders By Location</h6>
                                            <div class="chart-block chart-vertical-center">
                                                <apexchart type="donut" :options="chartOptions" height="220" :series="series"></apexchart>
                                            </div>
                                            <div class="order-graph-bottom">
                                                <div class="media" v-for="(item,index) in data" :key="index">
                                                    <div :class="item.orderColorClass"></div>
                                                    <div class="media-body">
                                                        <h6 class="mb-0">{{item.country}} <span class="pull-right">{{item.amount}}</span></h6>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-sm-6 xl-50">
                                        <div class="order-graph sm-order-space">
                                            <h6>Sales By Location</h6>
                                            <div class="peity-chart-dashboard text-center">
                                                <apexchart type="pie" height="220" :options="chartOptionsOne" :series="seriesOne"></apexchart>
                                            </div>
                                            <div class="order-graph-bottom sales-location">
                                                <div class="media" v-for="(item,index) in items" :key="index">
                                                    <div :class="item.orderShapeClass"></div>
                                                    <div class="media-body">
                                                        <h6 class="mb-0 me-0">{{item.country}} <span class="pull-right">{{item.percentage}}</span></h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 xl-100">
                                        <div class="order-graph xl-space">
                                            <h6>Revenue for last month</h6>
                                            <RevenueChart/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

</template>
<script setup>
import dashboard from "@/data/dashboard.json"
import RevenueChart from "@/components/theme/dashboard/revenueChart.vue"
import { ref } from "vue";
let data=dashboard.orders
let items=dashboard.seles
const series = ref([300, 50, 100]);
const seriesOne = ref([25, 25, 50, 50]);
    const chartOptions = ref({
      chart: {
        type: "donut",
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "50%",
          },
        },
      },
      colors: ["#F98085", "#39CCCD", "#A5A5A5"],
      responsive: [
        {
          breakpoint: 400,
          options: {
            chart: {
              width: 180,
            },
            legend: {
              show: false,
            },
          },
        },
      ],
      legend: {
        show: false,
      },
    });
const chartOptionsOne = ref({
  chart: {
    width: 380,
    type: "pie",
    toolbar: {
      show: false,
    },
  },
  colors: ["#F98085", "#39CCCD", "#A5A5A5", "#FBBC58"],
  labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
});
</script>