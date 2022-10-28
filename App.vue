<script>
	import {mapMutations} from 'vuex'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.getStorage({
				key:"userInfo",
				success: (res) => {
					// console.log('app',res)
					this.storeLogin(JSON.parse(res.data))
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			...mapMutations(['storeLogin'])
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	// 测试
	@import "./common/css/common.scss";
	@import "./common/css/iconfont.css";
</style>
