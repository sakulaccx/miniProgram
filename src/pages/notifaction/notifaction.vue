<template>
  <div class="content">
    
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data () {
    return {
      notifyList: [],
      buyOpt: ['建议购买 >', '建议观望']
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    getNotifactionList () {
      this.$fly.post('/attention/getNotes', {
        openid: this.userInfo.openid
      }).then(res => {
        if (res.code === '0' && res.data && res.data.length > 0) {
          this.notifyList = res.data
        } else {
          this.notifyList = []
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    if (this.userInfo.isRegister) {
      this.getNotifactionList()
    }
  },
  created () {
  // let app = getApp()
  }
}
</script>
<style scoped>
  
</style>
