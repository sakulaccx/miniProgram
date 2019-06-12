<template>
  <div class="content">
    <div class="loading-wrap" v-if="isLoading">
      <van-loading color="#3068F6"/>
    </div>
    <div class="list-wrap">
      <div class="list-item">
        <div class="item-info"></div>
        <div class="mark-line"></div>
        <div class="sys-suggest"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      isLoading: true,
      flightList: []
    }
  },
  methods: {
    ...mapMutations({
      setDate: 'SET_DEPART_DATE'
    }),
    showLoading () {
    },
    hideLoading () {
    }
  },
  mounted () {
    setTimeout(() => {
      this.isLoading = false
    }, 1000)
  },
  created () {
  // let app = getApp()
  }
}
</script>

<style scoped>
.content{
  height: 100%;
  overflow: hidden;
  background: rgb(245, 245, 245);
}
.loading-wrap{
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
</style>
