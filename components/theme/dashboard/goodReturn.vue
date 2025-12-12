<template>
     <div class="col-xl-6 xl-100">
                        <div class="card height-equal">
                            <div class="card-header">
                                <h5>Goods return</h5>
                               
                            </div>
                            <div class="card-body">
                                <div class="user-status table-responsive custom-scrollbar products-table">
                                    <table class="table table-bordernone mb-0">
                                        <thead>
                                        <tr>
                                            <th scope="col">Details</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Price</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(item,index) in data" :key="index">
                                            <td>{{item.description}}</td>
                                            <td class="digits">{{item.quantity}}</td>
                                            <td :class="item.status.class">{{item.status.text}}</td>
                                            <td class="digits">${{item.price}}</td>
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
let data=dashboard.good
</script>