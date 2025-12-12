<template>
    <div class="col-xl-6 xl-100">
                        <div class="card">
                            <div class="card-header">
                                <h5>Latest Orders</h5>
                            </div>
                            <div class="card-body">
                                <div class="user-status table-responsive latest-order-table">
                                    <table class="table table-bordernone">
                                        <thead>
                                        <tr>
                                            <th scope="col">Order ID</th>
                                            <th scope="col">Order Total</th>
                                            <th scope="col">Payment Method</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(item,index) in data" :key="index">
                                            <td>{{item.id}}</td>
                                            <td class="digits">{{item.amount}}</td>
                                            <td :class="item.class">{{item.method}}</td>
                                            <td class="digits">{{item.status}}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <a href="order.html" class="btn btn-primary">View All Orders</a>
                                </div>
                             
                            </div>
                        </div>
                    </div>
</template>
<script setup>
import dashboard from "~/data/dashboard.json"
let data=dashboard.order
</script>