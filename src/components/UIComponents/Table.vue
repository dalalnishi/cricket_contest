<template>
  <table class="table">
    <thead>
      <slot name="columns">
        <th v-for="(column, id) in columns" :key="id">{{column}}</th>
      </slot>
    </thead>
    <tbody>
    <tr v-for="(item, id) in data" :key="id">
      <!-- <slot :row="item">
        <td v-for="column in columns" :key="column" v-if="hasValue(item, column)">{{itemValue(item, column)}}</td>
      </slot> -->
    </tr>
    </tbody>
  </table>
</template>
<script>
  export default {
    name: 'l-table',
    props: {
      columns: Array,
      data: Array
    },
    methods: {
      hasValue (item, column) {
        return item[column.toLowerCase()] !== 'undefined'
      },
      itemValue (item, column) {
        return item[column.toLowerCase()]
      }
    }
  }
</script>
<style>
</style>
