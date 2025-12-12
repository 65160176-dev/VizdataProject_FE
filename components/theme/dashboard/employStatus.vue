<template>
     <div class="col-xl-6 xl-100">
                        <div class="card height-equal">
                            <div class="card-header">
                                <h5>Empolyee Status</h5>
                                
                            </div>
                            <div class="card-body">
                                <div class="user-status table-responsive custom-scrollbar products-table">
                                    <table class="table table-bordernone mb-0">
                                        <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Designation</th>
                                            <th scope="col">Skill Level</th>
                                            <th scope="col">Experience</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(item,index) in data" :key="index">
                                            <td class="bd-t-none u-s-tb">
                                                <div class="align-middle image-sm-size"><img class="img-radius align-top m-r-15 rounded-circle blur-up lazyloaded" :src="'/multikart-admin/' + item.image" alt="" data-original-title="" title="">
                                                    <div class="d-inline-block">
                                                        <h6>{{item.name}} <span class="text-muted digits">({{item.online_status}})</span></h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{{item.role}}</td>
                                            <td>
                                                <div class="progress-showcase">
                                                    <div class="progress" style="height: 8px;">
                                                        <div class="progress-bar " :class="item.progress.class" role="progressbar" :style="{width: item.progress.percentage + '%'}" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="digits">{{item.experience}}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
</template>
<script setup>
import dashboard from "~/data/dashboard.json"
let data=dashboard.data
</script>