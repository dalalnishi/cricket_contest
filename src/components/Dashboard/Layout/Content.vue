<template>
  <transition name="fade" mode="out-in">
    <router-view class="content"></router-view>
  </transition>
</template>
<script>
  export default {}
</script>
<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .1s
  }

  .fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */

  {
    opacity: 0
  }

  .content {
    background-image: url('http://belbroughtoncricketclub.co.uk/wp-content/uploads/2019/02/cropped-cricket-1.jpg');
    background-size: cover;
  }
</style>
