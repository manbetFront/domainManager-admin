<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
<style lang="stylus">
.el-pagination {
  padding-top: 20px;

  .el-pagination__total {
    position: absolute;
    right: 40px;
  }
}
.point-icon {
  font-size 18px
  &.is-success {
    color #00A854
  }
  &.is-error {
    color rgb(217, 0, 27)
  }
  &.is-gray {
    color gray
  }
}

</style>
