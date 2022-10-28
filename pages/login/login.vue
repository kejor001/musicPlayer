<template>
	<view>
		<view class="login-form">
					<input type="text" class="input-row" v-model="account" maxlength="11" placeholder="请输入账号" />
					<input type="password" class="input-row" v-model="password" maxlength="11" placeholder="请输入密码" />
					<button type="bytton" class="btn login-btn" @click="login">登录</button>
					<view class="bot flex-box">
						<navigator class="sign" hover-class="none">立即注册</navigator>
						<navigator class="forget" hover-class="none">忘记密码?</navigator>
					</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import {apiLogin} from '@/apis/index.js'
	export default {
		data() {
			return {
				account: '',
				password: ''
			};
		},
		methods:{
			...mapMutations(['storeLogin']),
			login() {
				if(!this.account) {
					uni.showModal({
						content:"请输入账号",
						showCancel:false
					})
					return false
				}
				if (!this.password) {
					uni.showModal({
						content:"请输入密码",
						showCancel:false
					})
					return false
				}
				const {account,password} =this;
				uni.showLoading({
					title:"登录中...",
				})
				setTimeout(function () {
					uni.hideLoading();
				}, 2000);
				//调用接口
				const params={
					phone:account,
					password:password
				}
				apiLogin(params).then(res=>{
					console.log(res);
					if(account!='admin'||password!="admin") {
						uni.showModal({
							content:"账号密码错误",
							showCancel:false
						})
						return false
					}
					//保存的信息
					const temp={
						profile:res.profile
					}
					this.storeLogin(temp)
					uni.switchTab({
						url:"/pages/mine/mine"
					})
				})
			}
		}
	}
</script>

<style lang="scss">
.input-row {
	width: 600rpx;
	height: 75rpx;
	margin: 0 auto;
	border: 1px solid #E04B28;
	color: #6c6c6c;
	border-radius: 75rpx;
	padding: 0 50rpx;
	line-height: 75rpx;
	margin-bottom: 45rpx;
	font-size: 26rpx;
}

.login-form {
	padding-top: 220rpx;
}
.login-btn {
	width: 600rpx;
	height: 75rpx;
	margin: 0 auto;
	border: 1px solid #E04B28;
	border-radius: 75rpx;
	padding: 0 50rpx;
	line-height: 75rpx;
	margin-bottom: 45rpx;
	font-size: 26rpx;
	color: #fff;
	background: #E04B28;
}
.bot {
	width: 600rpx;
	padding: 0 17rpx;
	font-size: 26rpx;
	margin: 0 auto;
	justify-content: space-between;
}
.sign {
	color: #E04B28;
}
.auth-row {
	display: flex;
	flex-direction: row;
	justify-content: center;
	position: absolute;
	bottom: 100rpx;
	left: 0;
	width: 100%;
	.auth-image {
		width: 50px;
		height: 50px;
		border: 1px solid #dddddd;
		border-radius: 50px;
		margin: 0 20px;
		background-color: #ffffff;
		overflow:hidden;
	}
	.img {
		width: 30px;
		height: 30px;
		margin: 10px;
	}
	input{
		outline:none;
		border:none;
		list-style: none;
	}
}
.log-btn{
	margin:0;
	padding:0;
	background: #fff!important;
	height:48px;
	&::after{
		background-color:transparent;
		margin:0;
		padding:0;
		border:0;
	}
}
</style>
