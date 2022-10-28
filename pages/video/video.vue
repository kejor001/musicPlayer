<template>
	<view class="video">
		<view class="topbar">
			<scroll-view scroll-x="true" class="scroll-view" :show-scrollbar="false">
				<view class="rel">
					<view class="item" v-for="(item,index) in navList" :key="index" :class="{active:curNav===item.id}" @click="switchNav(item.id,index)">
						<view class="desc">
							{{item.name}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- //视屏列表 -->
		<mescroll-uni :down="downOption" :up="upOption" @down="downCallback" @up="upCallback">
			<view class="video-list">
				<view class="video-item" v-for="(item,index) in relatedVideo" :key="index">
					<view class="video-wrap">
						<image :src="item.coverUrl" mode="" class="img"></image>
						<view class="desc ellipsis">
							{{item.title}}
						</view>
						<view class="creater-bar flex-box">
							<view class="name">
								{{item.creator[0].userName}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import {apiGetNavList,apiGetRelatedVideo} from '../../apis/index.js'
	import MescrollUni from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-uni.vue'
	export default {
		components:{
			MescrollUni
		},
		data() {
			return {
				navList:[],
				curNav:'', //当前选中的导航
				downOption:{
					auto:false
				},
				upOption:{
					auto:false,
					page:{
						num:0,
						size:10,
					}
				},
				relatedVideo:[],  //视屏列表
			}
		},
		onLoad() {
			this.getNavList();
		},
		methods:{
			getNavList() {
				apiGetNavList().then(res=>{
					console.log(res);
					this.navList=res.tags;
					//默认选中第一项
					this.curNav=this.navList[0].id;
					this.switchNav(this.curNav,0);
				})
			},
			//点击切换选中导航
			switchNav(itemId,index) {
				this.curNav=itemId;
				this.getList(1,5,res=>{
					console.log(res);
					this.relatedVideo=res;
				});
			},
			//视屏列表
			getList(pageNum,pageSize,successCallback,errCallback) {
				const params={
					id:this.curNav,
					pageNum,
					pageSize
				}
				apiGetRelatedVideo(params).then(res=>{
					successCallback&&successCallback(res.data)
				},err=>{
					errCallback&&errCallback(err);
				})
			},
			downCallback(mescroll){
					//下拉刷新回调
					// console.log('dowm');
					mescroll.resetUpScroll();
			},
			upCallback(mescroll){
				//上拉加载回调
				console.log('up');
				this.getList(mescroll.num,mescroll.size,res=>{
					if(mescroll.num==1) {
						this.relatedVideo=[]
					}
					//累加数据
					this.relatedVideo=this.relatedVideo.concat(res);
					mescroll.endSuccess();
				},()=>{
					mescroll.endErr();
				});
			}
		}
	}
</script>

<style lang="scss">
	.topbar {
			.h86 {
				height: 86rpx;
			}
		}
	
		.scroll-view {
			position: fixed;
			top: 0;
			width: 100%;
			height: 86rpx;
			white-space: nowrap;
			text-align: center;
			line-height: 86rpx;
			color: #333;
			font-weight: 600;
			border-bottom: 1rpx solid #e6e6e6;
			z-index: 10;
			background: #fff;
			.item {
				position: relative;
				display: inline-block;
				min-width: 126rpx;
				height: 86rpx;
				line-height: 86rpx;
				padding: 0 20rpx;
				&.active{
					color:#f32628;
				}
			}
		}
	
		.slide {
			position: absolute;
			width: 60rpx;
			height: 4rpx;
			left: 0;
			bottom: 0rpx;
			background: #f32628;
			transition: transform 0.3s;
			z-index: 2;
			/* #ifdef MP-WEIXIN */
			bottom: 2rpx;
			/* #endif */
		}
	
		.video-list {
			color: #333;
			background: #f8f8f8;
			.tit-bar {
				padding-left: 32rpx;
			}
			.video-item {
				padding-top: 32rpx;
				background: #fff;
				border-bottom: 24rpx solid #f8f8f8;
			}
	
			.video-wrap {
				width: 686rpx;
				margin: 0 auto;
			}
	
			.img {
				display: block;
				width: 686rpx;
				height: 390rpx;
				border-radius: 10rpx;
				background: #eee;
			}
	
			.desc {
				font-size: 30rpx;
				font-weight: 600;
				line-height: 84rpx;
				border-bottom: 1rpx solid #e6e6e6;
			}
		}
	
		.creater-bar {
			height: 100rpx;
			justify-content: space-between;
			align-items: center;
			.avactor-box {
				align-items: center;
			}
			.avactor {
				width: 66rpx;
				height: 66rpx;
				margin-right: 10rpx;
				border-radius: 66rpx;
				background: #eee;
			}
	
			.name {
				line-height: 100rpx;
			}
		}
</style>
