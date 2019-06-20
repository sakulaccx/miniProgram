<script>
export default {
  created () {
    console.log('App started!!!')
  }
}
</script>
<style lang="wxss">

page{
  height: 100%;
  overflow: hidden;
  overflow-x: hidden;
}
.content{
  height: 100%;
  overflow: hidden;
  background: rgb(245, 245, 245);
}
.btn{
  width: 90%;
  margin: 40rpx auto;
  height: 80rpx;
  border-radius: 20rpx;
  border: 1px solid #ccc;
  line-height: 80rpx;
  text-align: center;
}
.clearfix:after {
  content: " ";
  display: block;
  clear: both;
  height: 0;
}
.clearfix {
  zoom: 1;
}
</style>
