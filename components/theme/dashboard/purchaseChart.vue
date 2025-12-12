<template>
   <div class="col-xl-3 col-md-6 xl-50">
    <div class="card order-graph sales-carousel">
      <div class="card-header">
        <h6>Total purchase</h6>
        <div class="row">
          <div class="col-6">
            <div class="sales-apex-chart">
                <apexchart
                type="line"
                height="120"
                width="160"
                :options="chartOptions"
                :series="series"
              ></apexchart>
             </div>
              
          </div>
          <div class="col-6">
            <div class="value-graph">
              <h3>
                20% <span><i class="fa fa-angle-up font-secondary"></i></span>
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="media">
          <div class="media-body">
            <span>Monthly purchase</span>
            <h2 class="mb-0">2154</h2>
            <p>
              0.13% <span><i class="fa fa-angle-up"></i></span>
            </p>
            <h5 class="f-w-600">Avg Gross purchase</h5>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
            </p>
          </div>
          <div class="bg-secondary b-r-8">
            <div class="small-box">
              <vue-feather type="credit-card"></vue-feather>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const series = ref([
  {
    data: [85, 83, 90, 70, 85, 60, 65, 63, 68, 68, 65, 40, 60, 68, 75, 70, 90],
  },
]);

const chartOptions = ref({
  chart: {
          height: "10%",
          width: 30,
          type: "line",
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          }
        },
        colors: ["#38C9CA"],
        dataLabels: {
          enabled: false
        },
        labels: {
          show: false
        },
        stroke: {
          width: [1],
          curve: "straight"
        },
        title: {
          show: false
        },
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return (
              val +
              " - " +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              ""
            );
          }
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 2
          }
        },
        xaxis: {
          labels: {
            show: false
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          labels: { show: false }
        },
        axisBorder: {
          show: false
        },
        tooltip: {
          y: [
            {
              title: {
                formatter: function(val) {
                  return val + " (mins)";
                }
              }
            }
          ]
        },
        grid: {
          borderColor: "F98085"
        },
        fill: {
          color: "F98085"
        }
});
</script>
<style  scoped>
.ct-series-a .ct-line .ct-point{
    stroke: #38C9CA !important;
}
</style>>