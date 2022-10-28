<template>
	<view >
		<view :class="{dpn:isShowSearch}">
			<!-- 导航栏 -->
			<uni-nav-bar fixed="true">
				<block slot="left">
					<image src="../../static/image/search/6.png" mode="widthFix" class="top-img"></image>
				</block>
				<view class="top-search flex-box">
					<image src="../../static/image/search/2.png" mode="widthFix" class="search-icon debug"></image>
					<text class="debug">蔡徐坤</text>
				</view>
				<block slot="right">
					<image src="../../static/image/mine/r.png" mode="widthFix" class="top-img"></image>
				</block>
			</uni-nav-bar>
			<view class="page-content">
				<mescroll-uni :down="downOption" :up="upOption" @down="downCallback" @up="upCallback">
					<!-- 轮播 -->
					<view class="banner">
						<swiper :indicator-dots="true" :autoplay="true" 
						:interval="3000"
						:duration="500" 
						indicator-color="rgba(255,255,255,.5)" 
						indicator-active-color="#ff372b">
							<swiper-item v-for="(item,index) in swiper" :key="index">
								<view class="item">
									<image :src="item.imageUrl" class="img"></image>
									<view class="tag">
										{{item.typeTitle}}
									</view>
								</view>
							</swiper-item>
						</swiper>
					</view>
					<!-- 主入口 -->
					<view class="main-bar flex-box">
						<view class="flex-item" v-for="(item,index) in contentBar" :key="index">
							<image :src="'../../static/image/index/t_'+(index+1)+'.png'" mode="" class="img"></image>
							<view>{{item.name}}</view>
						</view>
					</view>
					<!-- 推荐歌单 -->
					<song-list title="推荐歌单" :list="recommendSongs"></song-list>
					<!-- 新碟新歌 -->
					<view class="song-list">
						<view class="switch-line flex-box">
								<view class="flex-box">
									<view class="switch-item" :class="{on:newType===1}" @click="switchTab(1)">
										新碟
									</view>
									<view class="switch-item" :class="{on:newType===2}" @click="switchTab(2)">
										新歌
									</view>
								</view>
								<template v-if="newType===1">
									<view class="more">更多新碟</view>
								</template>
								<template v-if="newType===2">
									<view class="more">更多新歌</view>
								</template>
						</view>
						<scroll-view class="scroll-view" scroll-x="true">
							<view class="item" v-for="(item,index) in latestAlbum" :key="index">
								<image :src="item.picUrl" mode="" class="img"></image>
								<view class="desc ellipsis">
									{{item.name}}
								</view>
								<view class="desc ellipsis c9">
									{{item.artist.name}}
								</view>
							</view>
						</scroll-view>
					</view>
					<!-- 精选视屏 -->
					<view class="video-list song-list">
						<view class="tit-bar">
							精选视屏
							<view class="fr more">
								更多
							</view>
						</view>
						<view class="video-item" v-for="(item,index) in relatedVideo" :key="index">
							<image :src="item.coverUrl" mode="" class="img"></image>
							<view class="desc ellipsis">
								{{item.title}}
							</view>
						</view>
					</view>
				</mescroll-uni>
			</view>
		</view>
		<search ref="search"></search>
	</view>
</template>

<script>
	import {apiGetBanner,apiGetRecommendSongs,apiGetTopAlbum,apiGetRelatedVideo} from '@/apis/index.js'
	import songList from '../../components/songList.vue'
	import search from '../search/search.vue'
	import MescrollUni from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-uni.vue'
	import uniNavBar from '@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue'
	export default {
		components:{
			songList,
			search,
			MescrollUni,
			uniNavBar
		},
		data() {
			return {
				swiper:[],
				contentBar:[
					{name:'每日推荐'},
					{name:'歌单'},
					{name:'排行榜'},
					{name:'电台'},
					{name:'直播'},
				],
				recommendSongs:[],
				newType:1,     //新碟新歌类别 1 新碟 2新歌
				latestAlbum:[],
				latestTempAlbum:[],//临时变量
				relatedVideo:[],
				isShowSearch:false,
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
			}
		},
		onLoad() {
			this.getBanner();
			this.getRecommendSound();
			this.getLatestAlbum();
			this.getRelatedVideo();
		},
		onPullDownRefresh: () => {
			// console.log('111');
			setTimeout(()=>{
				uni.stopPullDownRefresh();
			},1000)
		},
		methods:{
			//轮播图
			getBanner() {
				apiGetBanner().then(res=>{
					// console.log(res);
					this.swiper=res.banners;
				})
			},
			//推荐歌单
			getRecommendSound() {
				const params={
					limit:6
				}
				apiGetRecommendSongs(params).then(res=>{
					// console.log(res);
					this.recommendSongs=res.result;
					//格式化播放量数据
					const formatCount=data=>{
						let tmp=data;
						if (data>10000) {
							tmp=(parseInt(data/1000000)+'万');
						}
						return tmp;
					}
					this.recommendSongs.forEach(item=>{
						item.playCount=formatCount(item.playCount);
					})
				})
			},
			//新碟新歌 前三首-新碟 后三首-新歌
			getLatestAlbum() {
				apiGetTopAlbum().then(res=>{
					// console.log(res);
					this.latestTempAlbum=res.albums;
					this.latestAlbum=res.albums.slice(0,3);
				})
			},
			switchTab(type) {
				this.newType=type;
				let temp={
					s:type==1 ? 0 : 3,
					e:type==1 ? 3 :6
				}
				this.latestAlbum=this.latestTempAlbum.slice(temp.s,temp.e);
			},
			//精选视屏
			getRelatedVideo() {
				const params={
					id:20
				}
				apiGetRelatedVideo(params).then(res=>{
					console.log(res);
					this.relatedVideo=res.data;
				})
			},
			downCallback(mescroll) {
				// console.log('dowm');
				mescroll.resetUpScroll();
			},
			upCallback(mescroll) {
					//上拉加载回调
					// console.log('up');
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
			},
			getList(pageNum,pageSize,successCallback,errCallback) {
				const params={
					id:20,
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
		}
	}
</script>

<style lang="scss">
	.debug {
		margin-top: 20rpx;
		font-size: 30rpx;
	}
page {
	color: #1a1a1a;
	font-size: 24rpx;
}
.dpn{
	display: none;
}
.top-img {
	width: 50rpx;
	height: 50rpx;
	margin-top: 10rpx;
}
.top-search {
	width: 460rpx;
	/* #ifdef MP-WEIXIN */
	width: 460rpx;
	margin-left:-60rpx;
	/* #endif */
	height: 72rpx;
	margin-right: 24rpx;
	border-radius: 72rpx;
	color: #c6c6c6;
	background: #f7f7f7;
	align-items: center;
	justify-content: center;
	.search-icon {
		width: 28rpx;
		height: 29rpx;
		margin-right: 12rpx;
	}
}
.page-content {
	position: fixed;
	top: 64px;
	left: 0;
	right: 0;
	bottom: 0px;
	/* #ifdef H5 || MP-WEIXIN */
	top: 44px;
	/* #endif */
}
.banner {
	width: 100%;
	height: 268rpx;
	margin: 30rpx auto 44rpx;
	.swiper {
		height: 268rpx;
	}
	.item {
		position: relative;
		display: block;
		width: 686rpx;
		height: 268rpx;
		margin: 0 auto;
		border-radius: 14rpx;
		overflow: hidden;
	}
	.img {
		display: block;
		width: 100%;
		height: 100%;
	}
	.tag {
		position: absolute;
		bottom: 0;
		right: 0;
		height: 34rpx;
		padding: 0 14rpx;
		line-height: 34rpx;
		color: #fff;
		background: #43a5f0;
		z-index: 10;
		border-top-left-radius: 14rpx;
	}
}

.main-bar {
	padding-bottom: 22rpx;
	text-align: center;
	line-height: 70rpx;
	color: #666;
	border-bottom: 1rpx solid #e6e6e6;
	.img {
		display: block;
		width: 92rpx;
		height: 92rpx;
		margin: 0 auto;
	}
	.flex-item {
		position: relative;
		.date {
			position: absolute;
			left: 50%;
			top: 40rpx;
			line-height: 1;
			font-size: 24rpx;
			color: #ff392d;
			transform: translateX(-50%) scale(0.8);
		}
	}
}

.song-list {
	padding-left: 32rpx;
	.tit-bar {
		font-size: 34rpx;
		font-weight: 600;
		line-height: 110rpx;
	}

	.more {
		width: 150rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		margin-top: 30rpx;
		margin-right: 32rpx;
		color: #333;
		font-weight: 400;
		font-size: 24rpx;
		border: 2rpx solid #e6e6e6;
		border-radius: 50rpx;
	}
	.switch-line {
		justify-content: space-between;
		color: #999;
		.flex-box {
			line-height: 110rpx;
			width: 300rpx;
		}
		.switch-item {
			font-weight: 600;
			&:first-child {
				width: 80rpx;
			}
			&:last-child {
				padding-left: 22rpx;
			}
			&.on {
				color: #333;
				font-size: 34rpx;
			}
		}
	}
	.scroll-view {
		width: 100%;
		white-space: nowrap;
	}

	.item {
		position: relative;
		display: inline-block;
		width: 218rpx;
		padding-bottom: 16rpx;
		margin-right: 16rpx;
		line-height: 34rpx;
		&:before {
			content: ' ';
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 40rpx;
			z-index: 2;
			background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.2), transparent);
		}
		&.video {
			width: 450rpx;
		}
		.img {
			display: block;
			width: 100%;
			height: 218rpx;
			margin-bottom: 16rpx;
			background: #eee;
			border-radius: 10rpx;
		}
	}
	.count {
		position: absolute;
		top: 0;
		right: 0;
		padding-left: 25rpx;
		line-height: 34rpx;
		color: #fff;
		font-size: 24rpx;
		z-index: 10;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAqFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8j1z1tAAAAN3RSTlMA9wcC+/3w4A/RoQv0m4s6IBkU7eeRK73kxaZtW+rc1cmxe3UmwbiWQNmqgWZUzUY1ME4dhmGuJ2Z0kQAABVtJREFUeNrtnYtWGkEQRFsEeSmgII8EVBASUFHx1f//ZwmJRwaZYhndjdU5c//gQp8DVTvTK5FIJBKJRCKRSCQSiUQikcj/yWI6vRfzNEYz/U23NhbLlF70jZ7hr+W+pQ6FoxOxyXhP12neiEVyZd3gdiH2uFYfP0tijP2mehk8iy3miui1xRLfFHNaFTv0dAutvpihq1uZmPmp1yRqRuZLVxyol+5cLOB+9nMwZ52G8OOKSLWWVx97TzlhZ01EZDxRL8UHIcf92ZAl/ZZ6+UE+XxsiUjoF8zWinq9NEZH2BZivO+HFJyLyPFAvL4/Cil9ESkcF9XFIO19ARGRRVi9ndaHEDVPvksp38FP/7VgIQSJLTirq5fByX+jAIkvq5+rlnG++tovI/uWheqmwlUZAZMXxlXo5+M41X0DEZXqmXspUpaSuOBJAbrTq8GhLSSzi8jjUv/CWkusimLui/oa4lNxVRHLXYL5ISkmPCKLRYS4lPSIYFOovCEpJXVGRJGCoz59++XwBEci4R1pKIhFMv0VZegeL4FCfDyklGUSWoZ6vlAQiSTw32UpJN/lJMm6o5yolkUgy92WqUjJcxA31RKXkJ0RwqN+7TpwvLpFlqGcpJYNEQkL9MOtSEotcSRIo1DOU3kEigaH+bCoQShEY6vUKlpKcIjDU41IyS5EXSSY81M/q4oNXBIR6VHoTi4BQD0pJahEQ6kHpnZ3IUAIIDPWF96U3u8hGqEelJL/IWqjHpaQFERjqC0er0siECAj12c6Xm4ckRW6a20tJMyKvoR6WknZEcKgf9EXEkggO9b22LREY6pelpC0RHOq7fWMiONRPxlmJdCQLcKjPP1VtieBQX5wbE8GhvtOwJbIM9bCUtCWCQ33xzpgIDvWVXLoiE8macQck4YYxERjqy/vWRFCofzInItKeqIdxiiI9yRwc6msWRXyhfmBSxBfqFzZFNkP9g1UROVkP9TfpiVzIv6VRVodLqyLv/7D0jYps/IW8Nyni+VNfNSjii1kVSU/kVjIHB9+6ORF/FTEUYyKgHBqUjIlMZ+rjcCppipQlY47BOoNyQ0yJoEq7JmJJpH4Om1NLIieVAjzAbUgEPSjJn1YlA5FzyYj7Mn6eaEhkmTvQtRNLIjdNeBHIksjiFp+CyExkJmlT+lmA5wYsiTwP8PVFQyLti20XSs2IVE/zGZ+mwyJnkh79VsKlaxsi40niiUALIug44IF7BtiAyLyb7anZZJGipECjs9s5ZnKR3NPejifLuUUeimDBzeZUMYs0fgQ8SOcVAU/R0X2YLEW66ZXSyTfgSEUeh19+JxGIhJbSX39L1G00PlxKM9zbBSIhpTTHTWogElBKk9xt/5xIfUazAtXtZ8JLaaL9D64IX334L0Tq51w7LNySJqyUJttaA0QSp4pujxAWCS+lb9vydbiZeudSmnHXVrDITZNz+1mgyOKWdR8dEIGlNO2GwBCR5wHxzka36kgopXvUWzRdEapSOiORfot906ybTINL6RnHVHlEUCltYFtussi8++WrQtIQaXQIlreEinhLaYZ1OoEi+Z1L6R+EW9ehCC6lzyjfs4BElqU0zRKwQJHCeinNUB9+VgSX0rxvh/GJ5EagPnwifl+POryV0jT14WdEjq+I6sMPilCV0p8R2Zf6jKs+/KAIKqUH5FO1IXKght+NqCt4F3fvwtu3QL+qP4GybqFwZGKq/jBUTJnldQO78F1VbbxgJIHSHpgqivowhIp/qoiKnh05aZqfqlceiOvDMC51jRlb0bM79RZrfRhKqXb46lExOlVv5O5G19ejB/bQEYlEIpFIJBLJkF8r2nFUwcJuMQAAAABJRU5ErkJggg==)
			no-repeat;
		background-size: 25rpx 25rpx;
		transform: scale(0.8);
	}
}
.video-list {
	padding-left: 0;
	.tit-bar {
		padding-left: 32rpx;
	}
	.video-item {
		width: 686rpx;
		height: 490rpx;
		margin: 0 auto;
		background: #f8f8f8;
		border-radius: 10rpx;
		overflow: hidden;
		margin-bottom: 24rpx;
	}
	.img {
		display: block;
		width: 686rpx;
		height: 390rpx;
		background: #eee;
	}
	.desc {
		padding-left: 40rpx;
		font-size: 30rpx;
		font-weight: 600;
		line-height: 100rpx;
	}
}

/*
	 *平台差异化处理的代码可以放在底部，这样有利于集中管理
	*/
/* #ifdef MP-WEIXIN */
.banner {
	margin-top: 60rpx;
}
/* #endif */
</style>