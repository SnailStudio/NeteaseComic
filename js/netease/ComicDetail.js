/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 漫画详情展示
 */
import React, {Component} from 'react'
import {View, ScrollView, Image, findNodeHandle} from 'react-native'
import CommonStyle from '../common/CommonStyle'
import ServerApi from "../constant/ServerApi"
import NetUtil from "../util/NetUtil"
import DetailHeader from '../common/DetailHeader'
import DetailChapters from '../common/DetailChapters'
import DetailInfo from './DetailInfo'
import {BlurView} from 'react-native-blur'
import Config from '../constant/Config'
import NavigationService from '../navigator/NavigationService'
import StatusManager from "../util/StatusManager"
import Status from "../util/Status"
import {BaseComponent} from "../common/BaseComponent"
class ComicDetail extends Component<Props> {

    constructor(props) {
        super(props)
        this.state = {
            follow: false,
            data: null,
            loadMore: false,
            refresh: false,
            viewRef: null
        }
        this.statusManager = new StatusManager()
    }

    /**
     * 重试回调
     */
    retry(){
        this.getDetail()
    }

    componentDidMount() {
        console.log(this.props.navigation.getParam('link', ''))
        this.getDetail()
    }

    /**
     * 获取详情
     */
    getDetail() {
        let params = {
            link: this.props.navigation.getParam('link', '')
        }
        this.props.request(ServerApi.netease.getDetail,params,this.statusManager,(result) => {
            this.setState({
                data: result,
                loadMore: result.loadMore
            })
        }, (error) => {
            console.log(error)
        })
    }

    /**
     * 获取更多详情
     */
    getDetailMore() {
        let params = {
            link: this.props.navigation.getParam('link', '')
        }
        this.setState({
            loadMore: false,
            refresh: true
        })
        NetUtil.post(ServerApi.netease.getDetailMore, params, (result) => {
            if (result.length !== 0) {
                Array.prototype.push.apply(this.state.data.data, result)
                this.setState({
                    ['data.data']: this.state.data.data,
                    refresh: false
                })
            } else {
                this.setState({
                    refresh: false
                })
            }
        }, (error) => {
            console.log(error)
        })
    }

    /**
     * 图片加载完成回调
     */
    imageLoaded() {
        this.setState({viewRef: findNodeHandle(this.cover)});
    }

    /**
     * 正常显示渲染
     * @returns {*}
     */
    renderNormal(){
        return(
            <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
                <View style={CommonStyle.styles.container}>
                    {this.state.data ?
                        <Image
                            ref={(img) => {
                                this.cover = img
                            }}
                            source={{uri: this.state.data.cover}}
                            style={CommonStyle.styles.detailAbsolute}
                            onLoadEnd={this.imageLoaded.bind(this)}
                        /> : null }
                    {this.state.viewRef ?
                        <BlurView
                            style={CommonStyle.styles.detailAbsolute}
                            viewRef={this.state.viewRef}
                            blurType="dark"
                            blurAmount={2}
                        /> : null}
                    {/*渲染头部*/}
                    <DetailHeader follow={this.state.follow} onBack={() => {
                        this.props.navigation.goBack()
                    }} onFollow={() => {
                        this.setState({
                            follow: true
                        })
                    }}/>
                    {/*渲染漫画信息*/}
                    {this.state.data ? <DetailInfo data={this.state.data}/> : null}
                    {/*渲染可看漫画章节*/}
                    {this.state.data ?
                        <DetailChapters data={this.state.data}
                                        refresh={this.state.refresh}
                                        state={this.state}
                                        loadMore={this.state.loadMore} onClick={(item) => {
                            NavigationService.navigate('ComicContent',{link:item.link, platform:Config.platformNetease})
                        }} onMore={() => {
                            this.getDetailMore()
                        }}/> : null}

                </View>

            </ScrollView>

        )
    }

    render() {
        return (
            <View style={CommonStyle.styles.container}>
                {this.statusManager.Status === Status.Normal ?  this.renderNormal() :null}
                {this.props.displayStatus(this.statusManager)}
            </View>

        )
    }


}

export default BaseComponent(ComicDetail)