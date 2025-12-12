<template>
     <div class="col-xl-3 col-md-6 xl-50">
                        <div class="card order-graph sales-carousel">
                            <div class="card-header">
                                <h6>Total Sales</h6>
                                <div class="row">
                                    <div class="col-6">
                                      <div class="sales-apex-chart">
  <apexchart
                type="line"
                 height="120"
                width="160"
                class="flot-chart-placeholder"
                :options="chartOptions"
                :series="series"
              ></apexchart>
                                      </div>
                                      
                                    </div>
                                    <div class="col-6">
                                        <div class="value-graph">
                                            <h3>42% <span><i class="fa fa-angle-up font-primary"></i></span></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="media">
                                    <div class="media-body">
                                        <span>Sales Last Month</span>
                                        <h2 class="mb-0">9054</h2>
                                        <p>0.25% <span><i class="fa fa-angle-up"></i></span></p>
                                        <h5 class="f-w-600">Gross sales of August</h5>
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting</p>
                                    </div>
                                    <div class="bg-primary b-r-8">
                                        <div class="small-box">
                                            <vue-feather type="briefcase"></vue-feather>
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
    data: [20, 5, 50, 10, 70, 15],
  },
]);

const chartOptions = ref({
  chart: {
          height: '100%', 
          width: '148px',
          type: "line",
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          }
        },
        colors:[ "#F98C91"],
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
          },
        },
        yaxis: {
          labels: { show: false,
           }
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
          borderColor: "",
        }
});
</script>
