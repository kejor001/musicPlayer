<template>
	<view>
		<uni-nav-bar :fixed="true">
			<block slot="left">
				<image src="/static//image/cloud/y_03.png" mode="" class="top-img left"></image>
			</block>
			<view class="top-tab flex-box">
				<view class="debug" v-for="(item,index) in navList" :key="index" :class="{active: curNav == index}" @click="switchTab(index)">
					{{item.name}}
				</view>
			</view>
			<!-- #ifdef APP-PLUS || H5 -->
			<block slot="right">
				<image src="/static//image/mine/r.png" mode="" class="top-img"></image>
			</block>
			<!-- #endif -->
		</uni-nav-bar>
		<view class="page-content">
			<mescroll-uni :fixed="false" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback">
				<!-- 上下轮播 -->
				<view class="date-bar flex-box">
					<view class="date-bar-left">
						云村热评墙<text class="iconfont">&#xe605;</text>
						<swiper class="date-bar-swiper" :autoplay="true" :duration="500" :circular="true" :vertical="true">
							<swiper-item v-for="(item,index) in msgList" :key="index">
								{{item.name}}
							</swiper-item>
						</swiper>
					</view>
					<view>
						<view class="">
							{{this.curDate[1]}}
						</view>
						<view class="date-bar-num">
							{{this.curDate[2]}}
						</view>
					</view>
				</view>
				<view class="list-content flex-box">
					<view class="video-list flex-box">
						<view class="video-item" v-for="(item,index) in splitList.list1" :key="index">
							<view class="video-warp">
								<image :src="item.coverUrl" mode="widthFix" class="img"></image>
								<view class="video-con">
									<view class="desc">
										{{item.title}}
									</view>
									<view class="creater-bar flex-box">
										<view class="name">
											{{item.creator[0].username}}
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="video-list flex-box">
						<view class="video-item" v-for="(item,index) in splitList.list2" :key="index">
							<view class="video-warp">
								<image :src="item.coverUrl" mode="widthFix" class="img"></image>
								<view class="video-con">
									<view class="desc">
										{{item.title}}
									</view>
									<view class="creater-bar flex-box">
										<view class="name">
											{{item.creator[0].username}}
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue'
	import MescrollUni from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-uni.vue'
	import {apiGetRelatedVideo} from "@/apis/index.js"
	export default {
		components:{
			uniNavBar,
			MescrollUni
		},
		data() {
			return {
				navList: [
									{ name: '广场', id: 3452},
									{ name: '动态', id: 3462},
								],
								curNav: 0,                   //当前的导航项目
								downOption: {                     //下拉刷新
									auto: false
								},
								upOption: {                       //上拉加载下一页
									auto: false,
									page: {
										num: 0,                   //起始页
										size: 10,                 //一页条数
									}
								},
								curDate: String(new Date()).split(' '),   //当前时间
								msgList: [
									{ name: '他是我见过最年少有为的人', id: ''},
									{ name: '因为一个人而失眠，这真的好吗', id: ''},
									{ name: '花开花落，没有悲愁怎么是少年？', id: ''},
								],
								allList: [],                              //所有的视频数据
								splitList: {},                            //拆开的视频数据
			}
		},
		methods: {
			//按照索引的奇偶拆分
			splitList1() {
				//第一列和第二列的视频数据
				let i=0,list1=[],list2=[]
				while(i<this.allList.length) {
					list1.push(this.allList[i++]);
					if (i<this.allList.length){
						list2.push(this.allList[i++]);
					}
				}
				this.splitList={
					list1,
					list2 
				}
			},
			downCallback(mescroll) {
				// console.log('dowm');
				mescroll.resetUpScroll();
			},
			upCallback(mescroll) {
				// console.log('up');
					//加载下一页数据
				this.getList(mescroll.num, mescroll.size, res=> {
									//若是第一页 则清空
					if (mescroll.num == 1) {
						this.allList = [];
					}
					//累加数据
					this.allList = this.allList.concat(res);
					this.splitList1();
					//成功的回调，隐藏刷新状态
					mescroll.endSuccess();
				}, ()=>{
					//失败的回调，隐藏下拉刷新状态
					mescroll.endErr();
				})
				
			},
			//切换导航栏
			switchTab(index) {
				this.curNav=index;
				//获取所有的视频数据
				this.getList(1,5,res=>{
					console.log(res);
					this.allList=res;
					this.splitList1();
				})
			},
			getList(pageNum,pageSize,successCallback,errCallback) {
				const params={
					id:this.curNav+1,
					pageNum,
					pageSize
				}
				apiGetRelatedVideo(params).then(res=>{
					//判断有没有传入参数
					successCallback&&successCallback(res.data)
				},err=>{
					errCallback&&errCallback(err);
				})
			}
		},
		onLoad() {
			//第一项0
			this.switchTab(0);
		}
	}
</script>

<style lang="scss">
	.debug {
		font-size: 30rpx;
		text-align: center;
		margin-top: 20rpx;
		font-weight:500;
	}
page{
	background: #f8f8f8;
}
.page-content {
	position: fixed;
	top: 64px;
	left: 0;
	right: 0;
	bottom: 0;
	/* #ifdef H5 */
	top:44px;  // h5 无状态栏
	/* #endif */
}
.top-img {
	width: 50rpx;
	height: 40rpx;
	&.left {
		margin-left: 10rpx;
	}
}
.top-tab{
	width:310rpx;
	/* #ifdef MP-WEIXIN */
	width:250rpx;
	/* #endif */
	margin: 0 auto;
	justify-content: space-between;
	.active{
		position:relative;
		color:#f32628;
		&:after{
			position:absolute;
			content:'';
			left:50%;
			width: 94rpx;
			height: 4rpx;
			bottom: 0rpx;
			transform: translateX(-50%);
			background: #f32628;
			border-radius: 4rpx;
		}
	}
}
.date-bar{
	width: 686rpx;
	height: 160rpx;
	padding: 20rpx 34rpx;
	margin: 20rpx auto;
	border-radius: 14rpx;
	color:#fff;
	background: rgba(0,0,0,.7);
	line-height: 70rpx;
	font-weight: 600;
	justify-content: space-between;
	.date-bar-left{
		font-size: 34rpx;
		font-weight: 600;
	}
	.date-bar-num{
		margin-top:-20rpx;
		font-size: 44rpx;
	}
}
.list-content{
	padding-left:30rpx;
	flex-direction: row; // 主轴方向设置为水平方向
}
.video-list{
	flex-direction: column; // 主轴方向设置为垂直方向
}
.video-item{
	width: 334rpx;
	margin-right:20rpx;
	margin-bottom:20rpx;
	border-radius: 14rpx;
	overflow: hidden;
	color:#353536;
	background: #fff;
	line-height: 36rpx;
	.img{
		display:block;
		width:100%;
		min-height:188rpx;
	}
	.avactor{
		width: 28rpx;
		height:28rpx;
		margin-right: 10rpx;
		border-radius: 28rpx;
		background: #ddd;
	}
	.video-con{
		padding: 16rpx 16rpx 30rpx;
	}
	.avactor-box {
		align-items: center;
	}
	.creater-bar{
		margin-top: 10rpx;
		align-items: center;
		color:#999;
		font-size: 20rpx;
	}
}

.date-bar-swiper{
	width:430rpx;
	height:40rpx;
	line-height: 40rpx;
	color:#d0d2d3;
	font-size: 24rpx;
}
</style>