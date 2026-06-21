<template>
    <div class="ring-graph-page">
        <div ref="graphContainer" class="ring-graph-canvas" :style="canvasStyle"></div>
        <div class="graph-toolbar" v-if="toolbarVisible">
            <div class="graph-toolbar-item toolbar-btn" @click="handleResetPosition">初始化位置</div>
            <div class="graph-toolbar-item toolbar-dropdown" @click.stop="exportMenuVisible = !exportMenuVisible">
                <span class="toolbar-btn">导出图谱</span>
                <div class="dropdown-menu" v-show="exportMenuVisible">
                    <div class="dropdown-item" @click="handleExport('xmind')">导出Xmind</div>
                    <div class="dropdown-item" @click="handleExport('xlsx')">导出Excel</div>
                    <div class="dropdown-item" @click="handleExport('csv')">导出CSV</div>
                    <div class="dropdown-item" @click="handleExport('image')">导出图片</div>
                </div>
            </div>
            <div class="graph-toolbar-item toolbar-dropdown" @click.stop="collapseMenuVisible = !collapseMenuVisible">
                <span class="toolbar-btn cj">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" width="24.000000" height="24.000000" fill="none">
                        <rect id="svg 18" width="24.000000" height="24.000000" x="0.000000" y="0.000000" />
                        <path id="矢量 119"
                            d="M22.1004 7.3L13.1004 2.8C12.5004 2.4 11.8004 2.4 11.2004 2.8L2.20039 7.3C2.20039 7.4 2.10039 7.5 2.00039 7.5C1.90039 7.9 2.00039 8.3 2.30039 8.4L5.50039 10L2.80039 11.4C2.50039 11.6 2.30039 11.9 2.30039 12.2C2.30039 12.5 2.50039 12.9 2.80039 13L5.10039 14.2L2.80039 15.4C2.50039 15.6 2.30039 15.9 2.30039 16.2C2.30039 16.5 2.50039 16.9 2.80039 17L11.2004 21.2C11.5004 21.4 11.8004 21.5 12.1004 21.5C12.4004 21.5 12.8004 21.4 13.1004 21.2L21.5004 17C21.8004 16.8 22.0004 16.5 22.0004 16.2C22.0004 15.9 21.8004 15.5 21.5004 15.4L19.2004 14.2L21.5004 13C21.8004 12.8 22.0004 12.5 22.0004 12.2C22.0004 11.9 21.8004 11.5 21.5004 11.4L18.9004 10L22.1004 8.4C22.2004 8.3 22.3004 8.3 22.3004 8.2C22.4004 7.8 22.3004 7.4 22.1004 7.3ZM20.2004 16.2L12.5004 20.1C12.3004 20.2 12.1004 20.2 11.9004 20.1L4.20039 16.2L6.70039 14.9L11.3004 17.2C11.6004 17.4 11.9004 17.5 12.2004 17.5C12.5004 17.5 12.9004 17.4 13.2004 17.2L17.8004 14.9L20.2004 16.2L20.2004 16.2ZM20.2004 12.2L17.7004 13.5L16.2004 14.2L12.4004 16.1C12.2004 16.2 12.0004 16.2 11.8004 16.1L8.00039 14.2L6.50039 13.5L4.00039 12.2L7.00039 10.7L11.3004 12.9C11.9004 13.3 12.6004 13.3 13.2004 12.9L17.5004 10.7L20.2004 12.2Z"
                            fill="rgb(51,51,51)" fill-rule="nonzero" />
                    </svg>
                </span>
                <div class="dropdown-menu" v-show="collapseMenuVisible">
                    <div class="dropdown-item" :class="{ active: collapseLevel === -1 }" @click="handleCollapse(-1)">
                        展开全部
                    </div>
                    <div class="dropdown-item" :class="{ active: collapseLevel === 1 }" @click="handleCollapse(1)">
                        展开1层
                    </div>
                    <div class="dropdown-item" :class="{ active: collapseLevel === 2 }" @click="handleCollapse(2)">
                        展开2层
                    </div>
                    <div class="dropdown-item" :class="{ active: collapseLevel === 3 }" @click="handleCollapse(3)">
                        展开3层
                    </div>
                    <div class="dropdown-item" :class="{ active: collapseLevel === 0 }" @click="handleCollapse(0)">
                        全部收起
                    </div>
                </div>
            </div>
            <div class="graph-toolbar-item zoom-control">
                <span class="zoom-btn" @click="handleZoomOut">
                    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
                        <path
                            d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
                            stroke="currentColor" stroke-width="1.6" />
                        <path d="M14.4 10L5.6 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg></span>
                <span class="zoom-divider"></span>
                <span class="zoom-text" @click="handleZoomReset">{{ Math.round(zoomLevel * 100) }}%</span>
                <span class="zoom-divider"></span>
                <span class="zoom-btn" @click="handleZoomIn"> <svg viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
                        <path
                            d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
                            stroke="currentColor" stroke-width="1.6" />
                        <path d="M10 5.6L10 14.4M14.4 10L5.6 10" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                    </svg></span>
            </div>
        </div>

        <NodeDetailModal v-if="yhlx !== 'preview'" ref="nodeDetailModal" :activeNode="nodeDetailActiveNode" :kcid="kcid"
            :kkid="kkid" :commonsJs="commonsJsForModal" :sfzyxxms="sfzyxxms" :kcfmUrl="kcfmUrl" :editbg="editbg"
            :linebg="linebg" :datebg="datebg" :progressbg="progressbg" :timebg="timebg" :xxjd="xxjd" />
    </div>
</template>

<script>
    import NodeDetailModal from '../NodeDetailModal.vue'
    import { mapState } from 'vuex'

    const ZOOM_LIMITS = { min: 0.2, max: 2, inStep: 1.2, outStep: 0.8 }

    const COMPLETED_ICON_SVG = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20.000000" height="20.000000" fill="none">
	<rect id="svg 1" width="20.000000" height="20.000000" x="0.000000" y="0.000000" />
	<path id="矢量 83" d="M10.0203 5.23047C9.03926 5.23047 8.0803 5.52137 7.26463 6.06638C6.44896 6.61139 5.81323 7.38604 5.43782 8.29236C5.06241 9.19868 4.96418 10.196 5.15556 11.1581C5.34695 12.1203 5.81934 13.004 6.51301 13.6977C7.20668 14.3914 8.09047 14.8638 9.05261 15.0552C10.0148 15.2465 11.012 15.1483 11.9184 14.7729C12.8247 14.3975 13.5993 13.7618 14.1443 12.9461C14.6894 12.1304 14.9803 11.1715 14.9803 10.1905C14.9805 9.31974 14.7514 8.46431 14.3161 7.7102C13.8808 6.9561 13.2546 6.32991 12.5005 5.89461C11.7464 5.45931 10.891 5.23025 10.0203 5.23047L10.0203 5.23047ZM1.27026 13.1055L3.87526 10.5005C3.90799 10.4678 3.95025 10.4462 3.99596 10.439C4.04167 10.4318 4.0885 10.4392 4.12974 10.4602C4.17098 10.4812 4.2045 10.5148 4.22552 10.556C4.24653 10.5972 4.25395 10.6441 4.24672 10.6898C4.23949 10.7355 4.21798 10.7777 4.18526 10.8105L1.58026 13.4205C1.54753 13.4532 1.50527 13.4747 1.45955 13.482C1.41383 13.4892 1.36699 13.4818 1.32574 13.4608C1.2845 13.4398 1.25096 13.4062 1.22995 13.365C1.20893 13.3237 1.20151 13.2769 1.20875 13.2312C1.216 13.1855 1.23753 13.1432 1.27026 13.1105L1.27026 13.1055Z" fill="rgb(20,202,180)" fill-rule="nonzero" />
	<path id="矢量 84" d="M0.100098 11.2196L1.6251 10.3896L1.4601 11.7296L0.100098 11.2196Z" fill="rgb(72,170,240)" fill-rule="nonzero" />
	<path id="矢量 85" d="M14.6001 4.37453C14.6001 4.46947 14.6282 4.56227 14.681 4.6412C14.7337 4.72014 14.8087 4.78166 14.8964 4.81799C14.9841 4.85432 15.0806 4.86383 15.1737 4.84531C15.2669 4.82679 15.3524 4.78107 15.4195 4.71394C15.4866 4.64681 15.5324 4.56129 15.5509 4.46817C15.5694 4.37506 15.5599 4.27855 15.5236 4.19084C15.4872 4.10313 15.4257 4.02817 15.3468 3.97543C15.2678 3.92268 15.175 3.89453 15.0801 3.89453C14.9958 3.89453 14.9131 3.91671 14.8401 3.95884C14.7671 4.00097 14.7065 4.06156 14.6644 4.13453C14.6223 4.2075 14.6001 4.29027 14.6001 4.37453Z" fill="rgb(20,202,180)" fill-rule="nonzero" />
	<path id="矢量 86" d="M6.25 15.6484C6.25 15.6979 6.26466 15.7462 6.29213 15.7873C6.3196 15.8284 6.35865 15.8605 6.40433 15.8794C6.45001 15.8983 6.50028 15.9033 6.54877 15.8936C6.59727 15.884 6.64181 15.8602 6.67678 15.8252C6.71174 15.7903 6.73555 15.7457 6.7452 15.6972C6.75484 15.6487 6.74989 15.5984 6.73097 15.5528C6.71205 15.5071 6.68001 15.468 6.63889 15.4406C6.59778 15.4131 6.54945 15.3984 6.5 15.3984C6.45612 15.3984 6.413 15.41 6.375 15.4319C6.33699 15.4539 6.30544 15.4854 6.28349 15.5234C6.26155 15.5614 6.25 15.6046 6.25 15.6484Z" fill="rgb(72,170,240)" fill-rule="nonzero" />
	<path id="矢量 87" d="M5.04986 4.91023L6.13986 4.49023L5.71986 5.58023L4.62486 6.00023L5.04986 4.91023ZM5.04986 5.58023L4.60986 4.51023L5.67986 4.95023L6.12486 6.02023L5.04986 5.58023Z" fill="rgb(255,184,0)" fill-rule="nonzero" />
	<path id="矢量 88" d="M16.72 14.4803L17.89 14.0303L17.44 15.2003L16.27 15.6503L16.72 14.4803ZM16.72 15.2003L16.25 14.0503L17.4 14.5203L17.87 15.6703L16.72 15.2003Z" fill="rgb(20,202,180)" fill-rule="nonzero" />
	<path id="矢量 89" d="M15.9501 10.4799L18.6101 7.81986C18.635 7.79599 18.6657 7.77889 18.6991 7.77019C18.7325 7.7615 18.7676 7.7615 18.8011 7.77019C18.8345 7.77889 18.8651 7.79599 18.8901 7.81986C18.9126 7.84554 18.9285 7.87625 18.9367 7.9094C18.9448 7.94256 18.9448 7.97717 18.9367 8.01032C18.9285 8.04348 18.9126 8.07419 18.8901 8.09986L16.2301 10.7599C16.2051 10.7837 16.1745 10.8008 16.1411 10.8095C16.1076 10.8182 16.0725 10.8182 16.0391 10.8095C16.0057 10.8008 15.9751 10.7837 15.9501 10.7599C15.9276 10.7342 15.9116 10.7035 15.9035 10.6703C15.8954 10.6372 15.8954 10.6026 15.9035 10.5694C15.9116 10.5363 15.9276 10.5055 15.9501 10.4799Z" fill="rgb(72,170,240)" fill-rule="nonzero" />
	<path id="矢量 90" d="M15.5702 12.0101L19.5602 8.02006C19.5852 7.99618 19.6158 7.97908 19.6492 7.97039C19.6827 7.96169 19.7178 7.96169 19.7512 7.97039C19.7846 7.97908 19.8153 7.99618 19.8402 8.02006C19.8627 8.04573 19.8787 8.07645 19.8868 8.1096C19.8949 8.14275 19.8949 8.17737 19.8868 8.21052C19.8787 8.24367 19.8627 8.27438 19.8402 8.30006L15.8502 12.2901C15.8253 12.3139 15.7946 12.331 15.7612 12.3397C15.7278 12.3484 15.6927 12.3484 15.6592 12.3397C15.6258 12.331 15.5952 12.3139 15.5702 12.2901C15.5477 12.2644 15.5318 12.2337 15.5237 12.2005C15.5156 12.1674 15.5156 12.1327 15.5237 12.0996C15.5318 12.0664 15.5477 12.0357 15.5702 12.0101Z" fill="rgb(255,201,76)" fill-rule="nonzero" />
	<path id="矢量 91" d="M13.0136 9.06072L9.5686 12.6357C9.5443 12.6612 9.51375 12.6799 9.47999 12.6898C9.44623 12.6998 9.41044 12.7008 9.3762 12.6926C9.34195 12.6844 9.31046 12.6674 9.28485 12.6432L9.27735 12.6357L7.2336 10.5107C7.20817 10.4836 7.18999 10.4504 7.18076 10.4144C7.17152 10.3784 7.17152 10.3406 7.18076 10.3045C7.18999 10.2685 7.20817 10.2354 7.2336 10.2082L7.87485 9.54698C7.89929 9.52144 7.92998 9.50275 7.96388 9.49276C7.99778 9.48277 8.03371 9.48182 8.06809 9.49002C8.10247 9.49821 8.1341 9.51526 8.15985 9.53947L8.16735 9.54698L9.41735 10.8495L12.0736 8.09947C12.0979 8.074 12.1284 8.05534 12.1622 8.04536C12.196 8.03538 12.2318 8.03444 12.266 8.04262C12.3002 8.0508 12.3317 8.06782 12.3573 8.09198L12.3648 8.09947L13.0073 8.76573C13.0332 8.79282 13.0517 8.82607 13.0611 8.86232C13.0705 8.89857 13.0705 8.93663 13.0611 8.97288C13.0517 9.00913 13.0332 9.04238 13.0073 9.06948L13.0136 9.06072Z" fill="rgb(255,255,255)" fill-rule="nonzero" />
</svg>
`

    const darkenColor = (hex, amount) => {
        const safe = (hex || '#000000').replace('#', '')
        const num = parseInt(safe, 16)
        const r = Math.max(0, (num >> 16) - amount)
        const g = Math.max(0, ((num >> 8) & 0x00FF) - amount)
        const b = Math.max(0, (num & 0x0000FF) - amount)
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
    }

    const encodeSvg = svg => `image://data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
    const encodeSvgData = svg => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

    export default {
        name: 'RingGraph',
        components: {
            NodeDetailModal
        },
        inject: ['yhlx'],
        props: {
            sfzyxxms: { type: Boolean, default: false },
            xxjd: { type: Number, default: 0 },
            searchKeyword: { type: String, default: '' },
            searchSignal: { type: Number, default: 0 },
            openInfo: { type: Boolean, default: false }
        },

        data () {
            return {
                graphReady: false,
                graphInstance: null,
                sourceTreeData: null,
                chartMinHeight: 560,
                zoomLevel: 1,
                exportMenuVisible: false,
                collapseMenuVisible: false,
                collapseLevel: 2,
                searchMatchedNodeIds: [],
                searchCursor: -1,
                searchKeywordCache: '',
                kcfmUrl: '',
                kcmc: '',
                nodeDetailActiveNode: {},
                editbg: this.commonsJs.fileUrl + '3BAE10E01795B682E065020C296463DE',
                linebg: this.commonsJs.fileUrl + '3C4E3FE9FEF04D7FE065020C296463DE',
                datebg: this.commonsJs.fileUrl + '3BC3D77B55FA2E9AE065020C296463DE',
                progressbg: this.commonsJs.fileUrl + '3BC3DC5B3E873782E065020C296463DE',
                timebg: this.commonsJs.fileUrl + '3BC3DC5B3E893782E065020C296463DE',
                windowResizeHandler: null,
                graphRoamHandler: null,
                moduleLabelSideMap: {},
                svgSymbolCache: {},
                completedPillIcon: encodeSvgData(COMPLETED_ICON_SVG),
                // 各主分支使用固定色板，节点与连线都从这里取色
                // one: 一级节点色  two: 二级节点色  three: 三级+节点色  line: 该分支连线色
                branchPalettes: [
                    { one: '#1f8ff3', two: '#46b2ff', three: '#7ac9ff', line: '#1f8ff3' },
                    { one: '#22b9c5', two: '#3fcfd9', three: '#82e6ee', line: '#22b9c5' },
                    { one: '#f08d3f', two: '#f7a35c', three: '#f8c089', line: '#f08d3f' },
                    { one: '#ee5d87', two: '#f36e99', three: '#f79db8', line: '#ee5d87' },
                    { one: '#4c73e6', two: '#6489ef', three: '#90aaf8', line: '#4c73e6' },
                    { one: '#6f60d7', two: '#8a7be3', three: '#ada4ef', line: '#6f60d7' }
                ],
                // 节点大小、字号和基础颜色统一在这里维护
                nodeStyleConfig: {
                    rootColor: '#be2ab7',
                    borderDarken: 20,
                    rootSize: [104, 104],
                    rootFontSize: 18,
                    rootFontWeight: 600,
                    rootLabelColor: '#ffffff',
                    rootLabelBorderColor: '#d22dd0',
                    rootLabelBorderWidth: 3,
                    branchNodeSize: [28, 28],
                    moduleSize: [8, 8],
                    branchNodeFontSize: 12,
                    labelDistance: 12,
                    /**
                     * 连线颜色回退值：当节点 renderMeta 中未设置 lineColor 时使用
                     */
                    lineColorFallback: '#8f99b3',
                    /**
                     * 是否启用自定义连线颜色（跟随各分支色板）
                     * true： 每条连线根据所属分支色板动态着色
                     * false：使用 ECharts 默认连线颜色
                     */
                    lineStyleEnabled: false
                },
                // 展开层级与自动缩放映射：展开层级越多，放大率越高
                collapseZoomMap: {
                    0: 0.8, // 全部收起，低缩放适合近看
                    1: 1.0, // 展开1层
                    2: 1.2, // 展开2层
                    3: 1.4, // 展开3层
                    '-1': 1.6 // 展开全部，高缩放方便细看
                },
                // lmlx==2 节点标题样式统一在这里维护，并通过 enabled 控制是否启用专用样式
                moduleLabelStyleConfig: {
                    enabled: true,
                    leftPosition: 'left',
                    rightPosition: 'right',
                    leftAlign: 'right',
                    rightAlign: 'left',
                    verticalAlign: 'middle',
                    distance: 12,
                    rotate: 0,
                    color: '#1f2430',
                    fontWeight: 500,
                    primaryFontSize: 14,
                    secondaryFontSize: 10
                },
                // lmlx==1 节点（知识点）标题样式专用配置
                knowledgeLabelStyleConfig: {
                    enabled: true,
                    position: 'inside',
                    align: 'center',
                    verticalAlign: 'middle',
                    distance: 0,
                    rotate: 0,
                    color: '#000000',
                    fontWeight: 500,
                    fontSize: 10,
                    textBorderColor: 'transparent',
                    textBorderWidth: 0,
                    textShadowColor: 'transparent',
                    textShadowBlur: 0,
                    lineHeight: 10
                },
                // SVG 模板仅保留结构，运行时再注入色值
                nodeSymbolConfig: {
                    //
                    rootTemplate: [
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">',
                        '<circle cx="60" cy="60" r="50" fill="{{fillColor}}" stroke="{{strokeColor}}" stroke-width="8" />',
                        '</svg>'
                    ].join(''),
                    moduleTemplate: [
                        '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40.000000" height="40.000000" fill="none" customFrame="#000000">',
                        '<path id="多边形 24" d="M33.8564 24C35.396 26.6667 33.4715 30 30.3923 30L9.60769 30C6.52849 30 4.60399 26.6667 6.14359 24L16.5359 6C18.0755 3.33333 21.9245 3.33333 23.4641 6L33.8564 24Z" fill="{{fillColor}}" fill-rule="evenodd" />',
                        '<path id="多边形 24" d="M37.2244 24.4369C37.0703 23.7677 36.8136 23.122 36.4545 22.5L26.0622 4.5C25.7031 3.87799 25.2723 3.33292 24.7698 2.8648C24.3615 2.48442 23.9058 2.15485 23.4029 1.87608C22.9108 1.60336 22.4012 1.39431 21.874 1.24893C21.2722 1.08298 20.6476 1 20 1C19.3524 1 18.7278 1.08298 18.126 1.24893L18.1259 1.24894Q17.3352 1.46701 16.5971 1.87608C16.0942 2.15485 15.6385 2.48441 15.2302 2.86478Q14.4765 3.56697 13.9378 4.5L3.54551 22.5C3.18639 23.122 2.92975 23.7677 2.77559 24.4369L2.77556 24.437Q2.5877 25.2526 2.60278 26.115C2.61263 26.6775 2.68639 27.2233 2.82408 27.7526Q3.05985 28.6588 3.54552 29.5Q4.03119 30.3412 4.69813 30.9985Q5.28235 31.5743 6.00566 32.0089C6.49857 32.3051 7.01182 32.5349 7.54539 32.6983C8.20203 32.8994 8.88947 33 9.60769 33L30.3923 33C31.1106 33 31.798 32.8994 32.4547 32.6983C32.9883 32.5349 33.5015 32.3051 33.9943 32.0089C34.4765 31.7192 34.9123 31.3824 35.3018 30.9986C35.7465 30.5603 36.1307 30.0608 36.4545 29.5C36.7783 28.9392 37.0188 28.3567 37.1759 27.7525C37.3136 27.2233 37.3874 26.6774 37.3972 26.115C37.4073 25.54 37.3497 24.9807 37.2244 24.4369ZM6.14359 24C4.60399 26.6667 6.52849 30 9.60769 30L30.3923 30C33.4715 30 35.396 26.6667 33.8564 24L23.4641 6C21.9245 3.33333 18.0755 3.33333 16.5359 6L6.14359 24Z" fill="{{strokeColor}}" fill-rule="evenodd" />',
                        '</svg>'
                    ].join(''),
                    branchTemplate: [
                        '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="56.000000" height="56.000000" fill="none" customFrame="#000000">',
                        '<rect id="矩形 4389" width="50.000000" height="50.000000" x="3.000000" y="3.000000" rx="12.000000" fill="{{fillColor}}" />',
                        '<rect id="矩形 4389" width="53.000000" height="53.000000" x="1.500000" y="1.500000" rx="13.500000" stroke="{{strokeColor}}" stroke-width="3.000000" />',
                        '</svg>'
                    ].join('')
                }
            }
        },

        computed: {
            ...mapState('admin/user', ['info']),
            commonsJsForModal () {
                if (this.commonsJs && this.commonsJs.default) {
                    return this.commonsJs.default
                }
                return this.commonsJs
            },
            canvasStyle () {
                return {
                    minHeight: this.chartMinHeight + 'px'
                }
            },
            toolbarVisible () {
                return this.graphReady && (this.yhlx === 'preview' || (this.yhlx !== 'student' || this.openInfo))
            }
        },
        watch: {
            searchSignal () {
                this.handleSearchLocate()
            }
        },

        async created () {
            const { kcid = '', kkid = '', bjid = '' } = this.$route.query || {}
            this.kcid = kcid
            this.kkid = kkid
            this.bjid = bjid
            await this.getfm()
            await this.getData()
        },
        async mounted () {
            document.addEventListener('click', this.handleDocumentClick)
            this.windowResizeHandler = () => {
                if (this.graphInstance) {
                    this.graphInstance.resize()
                }
            }
            window.addEventListener('resize', this.windowResizeHandler)
        },
        methods: {
            async getfm () {
                const res = await this.commonsJs.incoRequest_self('/courseStarts/findCourseBasicData', 'get', {
                    kkid: this.kkid,
                    kcid: this.kcid
                })
                const { kcfmUrl = '', kcmc = '' } = res || {}
                this.kcfmUrl = kcfmUrl
                this.kcmc = kcmc
            },
            async getData () {
                try {
                    let url = '/kklm/queryTreeList'
                    let params = {
                        kkid: this.kkid,
                        kcid: this.kcid,
                        // cxlx: 2,
                        yhdm: this.info.yhdm
                    }
                    if (this.yhlx == 'student') {
                        url = '/studentStudy/chapterDirectory';
                        params = {
                            kkid: this.kkid,
                            kcid: this.kcid,
                            yhdm: this.info.yhdm,
                            queryType: 3
                        }
                    }
                    const res = await this.commonsJs.incoRequest_self(url, 'get', params)

                    const treeList = Array.isArray(res)
                        ? res
                        : [];
                    const rootId = '0'
                    const rootNode = {
                        id: rootId,
                        name: this.kcmc || '课程知识图谱',
                        type: 1,
                        data: {
                            info: {
                                id: rootId,
                                name: this.kcmc || '课程知识图谱',
                                lmlx: 1,
                                isRoot: true
                            }
                        },
                        children: this.dgchildren(treeList)
                    }

                    this.sourceTreeData = rootNode
                    this.renderGraph(rootNode)
                } catch (error) {
                    console.error(error)
                }
            },
            renderGraph (rootNode) {
                const container = this.$refs.graphContainer
                if (!container || !rootNode) return

                const styledTree = this.decorateTree(rootNode)
                if (!this.graphInstance) {
                    this.graphInstance = this.commonsJs.echarts.init(container)
                    this.bindGraphRoam()
                }

                this.graphInstance.setOption(this.buildChartOption(styledTree), {
                    notMerge: true,
                    lazyUpdate: false,
                    replaceMerge: ['series']
                })
                this.graphReady = true
                this.$nextTick(() => {
                    this.syncModuleLabelSides()
                })
            },
            buildChartOption (rootNode) {
                return {
                    series: [
                        {
                            type: 'tree',
                            data: [rootNode],
                            layout: 'radial',
                            symbolKeepAspect: true,
                            // 树数据已在 decorateNode 中按 collapseLevel 裁剪，此处不再限制
                            initialTreeDepth: -1,
                            // true：同时启用鼠标拖拽平移和滚轮缩放
                            roam: true,
                            zoom: this.zoomLevel,
                            expandAndCollapse: false,
                            animationDurationUpdate: 240,
                            symbol: (value, params) => this.getNodeSymbol(params),
                            symbolSize: (value, params) => this.getNodeSymbolSize(params),
                            /**
                             * 连线样式配置
                             * 启用 lineStyleEnabled 时：每条连线根据其子节点所属分支色板的 line 色值动态着色
                             * 关闭时：不设置 lineStyle，走 ECharts 内置默认连线样式
                             */
                            ...(this.nodeStyleConfig.lineStyleEnabled
                                ? {
                                    lineStyle: {
                                        color: params => this.getLineColor(params)
                                    }
                                }
                                : {}),
                            label: {
                                color: '#1f2430',
                                fontWeight: 500,
                                rotate: 0,
                                formatter: params => this.nodeLabel(params),
                                rich: {
                                    pill: {
                                        height: 12,
                                        align: 'center',
                                        verticalAlign: 'middle'
                                    },
                                    kcmc: {
                                        fontWeight: 700,
                                        fontSize: 16,
                                        lineHeight: 18
                                    },
                                    zjtext: {
                                        color: 'rgba(51, 51, 51, 1)',
                                        fontWeight: 700,
                                        fontSize: 12,
                                        lineHeight: 16
                                    }
                                }
                            },
                            emphasis: {
                                // relative：高亮当前节点的所有祖先（含根节点）与所有后代，即同一分支全路径
                                focus: 'relative'
                            }
                        }
                    ]
                }
            },
            nodeLabel (params) {
                let name = params && params.data ? params.data.name : ''
                if (this.yhlx == 'student') {
                    let percentage = ''
                    if (params && params.data && params.data.data && params.data.data.info) {
                        const data = params.data.data.info
                        const isCapsuleNode = this.isLeaf(data)
                        if (isCapsuleNode) {
                            // per-node label.formatter 已在 decorateNode 中设置为 '{pill|}'
                            // 此处 series-level formatter 作为保底（通常不会被调用）
                            return `${name}`
                        } else if (data.id == 0) {
                            // percentage = '100%';
                            // return `{kcmc|${name}}\n{kcmc|${percentage}}`
                            return `{kcmc|${name}}`
                        } else if (data.lmlx !== 2) {
                            percentage = `${data.zjjd || 0}%`;
                            return `{zjtext|${name}}\n{zjtext|${percentage}}`
                        } else if (data.lmlx === 2) {
                            return `${name}`
                        }
                    }
                }
                return `${name}`
            },
            isLeaf (data) {
                return data.lmlx == 3 || (data.lmlx == 2 && (!data.children || data.children.length === 0))
            },
            decorateTree (rootNode) {
                const childList = Array.isArray(rootNode.children) ? rootNode.children : []
                const branchCount = childList.length || 1

                return {
                    ...rootNode,
                    renderMeta: {
                        depth: 0,
                        branchIndex: -1,
                        branchSide: 'center',
                        nodeColor: this.nodeStyleConfig.rootColor,
                        // 根节点的连线颜色同样使用 rootColor
                        lineColor: this.nodeStyleConfig.rootColor,
                        symbolType: 'root'
                    },
                    label: {
                        position: 'inside',
                        align: 'center',
                        verticalAlign: 'middle',
                        rotate: 0,
                        fontSize: this.nodeStyleConfig.rootFontSize,
                        fontWeight: this.nodeStyleConfig.rootFontWeight,
                        color: this.nodeStyleConfig.rootLabelColor,
                        textBorderColor: this.nodeStyleConfig.rootLabelBorderColor,
                        textBorderWidth: this.nodeStyleConfig.rootLabelBorderWidth,
                        textShadowColor: 'rgba(210, 45, 208, 0.18)',
                        textShadowBlur: 2
                    },
                    children: childList.map((child, index) => this.decorateNode(child, {
                        depth: 1,
                        branchIndex: index,
                        branchCount
                    }))
                }
            },
            decorateNode (node, context) {
                const safeNode = node || {}
                const children = Array.isArray(safeNode.children) ? safeNode.children : []
                const depth = Number(context.depth) || 0
                const branchIndex = Number(context.branchIndex)
                const palette = this.getBranchPalette(branchIndex)
                const branchSide = this.moduleLabelSideMap[safeNode.id] || this.getBranchSide(branchIndex, context.branchCount)
                const info = safeNode.data && safeNode.data.info ? safeNode.data.info : {}
                const lmlx = Number(info.lmlx || 0)
                const isCapsule = (lmlx === 2 || lmlx === 3) && (info.sfwc == 1 || info.zjjd >= 100) // lmlx=3 或 lmlx=2 且 已完成（sfwc==1 或 zjjd>=100）的节点使用胶囊标签样式
                const nodeColor = this.getNodeColor(depth, palette)
                // collapseLevel 真实裁剪：非 -1 时超过层级不再递归子节点
                const shouldRecurse = this.collapseLevel === -1 || depth < this.collapseLevel

                return {
                    ...safeNode,
                    renderMeta: {
                        depth,
                        branchIndex,
                        branchSide,
                        nodeColor,
                        // 连线颜色取自当前分支色板的 line 值，回退到全局配置的 lineColorFallback
                        lineColor: palette.line || this.nodeStyleConfig.lineColorFallback,
                        symbolType: this.yhlx !== 'student' && (lmlx === 2 || lmlx === 3) ? 'module' : (this.isLeaf(info) ? 'module' : 'branch')
                    },
                    label: isCapsule
                        ? this.getCapsuleNodeLabelConfig(info.name || safeNode.name || '', this.zoomLevel)
                        : this.getNodeLabelConfig(depth, branchSide, lmlx),
                    children: shouldRecurse
                        ? children.map(child => this.decorateNode(child, {
                            depth: depth + 1,
                            branchIndex,
                            branchCount: context.branchCount
                        }))
                        : undefined
                }
            },
            /**
             * 获取分支色板
             * 每个色板包含 one/two/three 三种节点颜色和 line 连线颜色。
             * branchIndex < 0 表示根节点，直接用 rootColor。
             *
             * @param {number} branchIndex 分支索引
             * @returns {{ one: string, two: string, three: string, line: string }}
             */
            getBranchPalette (branchIndex) {
                if (branchIndex < 0) {
                    return {
                        one: this.nodeStyleConfig.rootColor,
                        two: this.nodeStyleConfig.rootColor,
                        three: this.nodeStyleConfig.rootColor,
                        line: this.nodeStyleConfig.rootColor
                    }
                }

                return this.branchPalettes[branchIndex % this.branchPalettes.length]
            },
            getBranchSide (branchIndex, branchCount) {
                if (branchIndex < 0) return 'center'
                const safeCount = Math.max(1, Number(branchCount) || 1)
                const angle = (-Math.PI / 2) + ((Math.PI * 2 * branchIndex) / safeCount)
                return Math.cos(angle) < 0 ? 'left' : 'right'
            },
            getNodeColor (depth, palette) {
                if (depth <= 1) return palette.one
                if (depth === 2) return palette.two
                return palette.three
            },
            /**
             * 将胶囊标签（图标 + 名称 + 已完成）编码为单个 SVG data URI。
             * @param {string} labelName 节点名称
             * @param {number} zoomScale 当前缩放比
             * @returns {{ dataUri: string, width: number }}
             */
            measureTextWidth (text, fontSize, fontWeight = 500) {
                if (!this._textMeasureCanvas) {
                    this._textMeasureCanvas = document.createElement('canvas')
                }
                const ctx = this._textMeasureCanvas.getContext('2d')
                ctx.font = `${fontWeight} ${fontSize}px Microsoft YaHei,sans-serif`
                return ctx.measureText(text).width
            },
            buildCapsuleSvgUri (labelName, zoomScale = 1) {
                const scale = Math.max(0.6, Math.min(2, Number(zoomScale) || 1)) * 0.5
                const GAP = 5
                const ICON_W = 20
                const PAD_H = 10
                const H = 24

                const scaledGap = GAP * scale
                const scaledIconW = ICON_W * scale
                const scaledPadH = PAD_H * scale
                const scaledH = H * scale
                const R = scaledH / 2
                const cy = scaledH / 2
                const textFontSize = 12 * scale
                const statusFontSize = textFontSize

                const textW = this.measureTextWidth(labelName, textFontSize, 500)
                const statusW = Math.max(44 * scale, this.measureTextWidth('[已完成]', statusFontSize, 600))
                const W = scaledPadH + scaledIconW + scaledGap + textW + scaledGap + statusW + scaledPadH

                const iconX = scaledPadH
                const iconY = cy - scaledIconW / 2
                const textX = iconX + scaledIconW + scaledGap
                const statusX = textX + textW + scaledGap

                const svg = [
                    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${scaledH}">`,
                    `<rect x="0" y="0" width="${W}" height="${scaledH}" rx="${R}" ry="${R}" fill="#ffffff" />`,
                    `<image href="${this.completedPillIcon}" x="${iconX}" y="${iconY}" width="${scaledIconW}" height="${scaledIconW}" />`,
                    `<text x="${textX}" y="${cy}" dominant-baseline="middle" font-family="Microsoft YaHei,sans-serif" font-size="${textFontSize}" font-weight="500" fill="#1f2430">${labelName}</text>`,
                    `<text x="${statusX + statusW}" y="${cy}" text-anchor="end" dominant-baseline="middle" font-family="Microsoft YaHei,sans-serif" font-size="${statusFontSize}" font-weight="600" fill="#14cab4">[已完成]</text>`,
                    `</svg>`
                ].join('')

                return {
                    dataUri: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
                    width: W
                }
            },
            /**
             * 为胶囊节点生成 per-node label 配置。
             * 包含独立的 formatter 和 rich.pill，实现 SVG 图像作为标签背景。
             */
            getCapsuleNodeLabelConfig (labelName, zoomScale = 1) {
                const { dataUri, width } = this.buildCapsuleSvgUri(labelName, zoomScale)
                const height = 24 * Math.max(0.6, Math.min(2, Number(zoomScale) || 1)) * 0.5
                return {
                    formatter: '{pill|}',
                    rich: {
                        pill: {
                            backgroundColor: { image: dataUri },
                            width,
                            height,
                            align: 'center',
                            verticalAlign: 'middle'
                        }
                    }
                }
            },
            refreshCapsuleLabelsByZoom () {
                if (!this.graphInstance || !this.sourceTreeData) return
                const styledTree = this.decorateTree(this.sourceTreeData)
                this.graphInstance.setOption({
                    series: [{
                        data: [styledTree],
                        zoom: this.zoomLevel
                    }]
                })
            },
            escapeSvgText (str) {
                return String(str || '')
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
            },
            syncModuleLabelSides () {
                if (!this.graphInstance || !this.sourceTreeData) return

                const seriesModel = this.graphInstance.getModel().getSeriesByIndex(0)
                if (!seriesModel) return

                const data = seriesModel.getData()
                const centerX = this.graphInstance.getWidth() / 2
                const nextSideMap = {}

                data.each(index => {
                    const rawItem = data.getRawDataItem(index)
                    const lmlx = Number(rawItem && rawItem.data && rawItem.data.info ? rawItem.data.info.lmlx : 0)
                    const layout = data.getItemLayout(index)

                    if (lmlx !== 2 || !layout || typeof layout.x !== 'number' || !rawItem || !rawItem.id) return

                    nextSideMap[rawItem.id] = layout.x < centerX ? 'left' : 'right'
                })

                if (!this.hasModuleLabelSideChanges(nextSideMap)) return

                this.moduleLabelSideMap = nextSideMap
                this.renderGraph(this.sourceTreeData)
            },
            hasModuleLabelSideChanges (nextSideMap) {
                const currentKeys = Object.keys(this.moduleLabelSideMap)
                const nextKeys = Object.keys(nextSideMap)

                if (currentKeys.length !== nextKeys.length) return true

                return nextKeys.some(key => this.moduleLabelSideMap[key] !== nextSideMap[key])
            },
            getNodeLabelConfig (depth, branchSide, lmlx) {
                const moduleLabelCfg = this.moduleLabelStyleConfig
                const knowledgeLabelCfg = this.knowledgeLabelStyleConfig
                const isAdaptiveModule = lmlx === 2
                const isKnowledge = lmlx === 1
                const isRoot = depth === 0
                const isLeftSide = branchSide === 'left'

                if (isRoot) {
                    // 根节点样式依然走 nodeStyleConfig
                    return {
                        position: 'inside',
                        align: 'center',
                        verticalAlign: 'middle',
                        distance: 0,
                        rotate: 0,
                        color: this.nodeStyleConfig.rootLabelColor,
                        fontSize: this.nodeStyleConfig.rootFontSize,
                        fontWeight: this.nodeStyleConfig.rootFontWeight,
                        textBorderColor: this.nodeStyleConfig.rootLabelBorderColor,
                        textBorderWidth: this.nodeStyleConfig.rootLabelBorderWidth,
                        textShadowColor: 'rgba(210, 45, 208, 0.18)',
                        textShadowBlur: 2,
                        lineHeight: 18
                    }
                }

                if (isKnowledge) {
                    if (!knowledgeLabelCfg.enabled) {
                        // 关闭时回退到原分支节点样式
                        return {
                            position: 'inside',
                            align: 'center',
                            verticalAlign: 'middle',
                            distance: 0,
                            rotate: 0,
                            color: '#000000',
                            fontSize: this.nodeStyleConfig.branchNodeFontSize,
                            fontWeight: 500,
                            textBorderColor: 'transparent',
                            textBorderWidth: 0,
                            textShadowColor: 'transparent',
                            textShadowBlur: 0,
                            lineHeight: 14
                        }
                    }
                    // 启用专用样式
                    return {
                        position: knowledgeLabelCfg.position,
                        align: knowledgeLabelCfg.align,
                        verticalAlign: knowledgeLabelCfg.verticalAlign,
                        distance: knowledgeLabelCfg.distance,
                        rotate: knowledgeLabelCfg.rotate,
                        color: knowledgeLabelCfg.color,
                        fontSize: knowledgeLabelCfg.fontSize,
                        fontWeight: knowledgeLabelCfg.fontWeight,
                        textBorderColor: knowledgeLabelCfg.textBorderColor,
                        textBorderWidth: knowledgeLabelCfg.textBorderWidth,
                        textShadowColor: knowledgeLabelCfg.textShadowColor,
                        textShadowBlur: knowledgeLabelCfg.textShadowBlur,
                        lineHeight: knowledgeLabelCfg.lineHeight
                    }
                }

                if (isAdaptiveModule) {
                    if (!moduleLabelCfg.enabled) {
                        return {
                            position: 'right',
                            align: 'left',
                            verticalAlign: 'middle',
                            distance: this.nodeStyleConfig.labelDistance,
                            rotate: 0,
                            color: '#000000',
                            fontSize: this.nodeStyleConfig.branchNodeFontSize,
                            fontWeight: 500
                        }
                    }
                    return {
                        // position: isLeftSide ? moduleLabelCfg.leftPosition : moduleLabelCfg.rightPosition,
                        // align: isLeftSide ? moduleLabelCfg.leftAlign : moduleLabelCfg.rightAlign,
                        // verticalAlign: moduleLabelCfg.verticalAlign,
                        // distance: moduleLabelCfg.distance,
                        // rotate: moduleLabelCfg.rotate,
                        color: moduleLabelCfg.color,
                        fontSize: depth <= 1 ? moduleLabelCfg.primaryFontSize : moduleLabelCfg.secondaryFontSize,
                        fontWeight: moduleLabelCfg.fontWeight
                    }
                }

                // 其它分支节点
                return {
                    position: 'right',
                    align: 'left',
                    verticalAlign: 'middle',
                    distance: this.nodeStyleConfig.labelDistance,
                    rotate: 0,
                    color: '#000000',
                    fontSize: this.nodeStyleConfig.branchNodeFontSize,
                    fontWeight: 500
                }
            },
            getNodeSymbol (params) {
                const node = params && params.data ? params.data : null
                const renderMeta = node && node.renderMeta ? node.renderMeta : null
                const symbolType = renderMeta && renderMeta.symbolType ? renderMeta.symbolType : 'branch'
                const nodeColor = renderMeta && renderMeta.nodeColor ? renderMeta.nodeColor : this.nodeStyleConfig.rootColor
                const borderColor = darkenColor(nodeColor, this.nodeStyleConfig.borderDarken)
                const cacheKey = `${symbolType}-${nodeColor}-${borderColor}`

                if (!this.svgSymbolCache[cacheKey]) {
                    // 同一套 SVG 图形只生成一次，避免频繁重复编码
                    this.svgSymbolCache[cacheKey] = this.buildSvgSymbol(symbolType, nodeColor, borderColor)
                }
                return this.svgSymbolCache[cacheKey]
            },
            buildSvgSymbol (symbolType, fillColor, strokeColor) {
                const templateMap = {
                    root: this.nodeSymbolConfig.rootTemplate,
                    module: this.nodeSymbolConfig.moduleTemplate,
                    branch: this.nodeSymbolConfig.branchTemplate
                }
                const template = templateMap[symbolType] || this.nodeSymbolConfig.branchTemplate

                // 模板只管形状，颜色在这里统一替换
                return encodeSvg(template
                    .replace(/{{fillColor}}/g, fillColor)
                    .replace(/{{strokeColor}}/g, strokeColor))
            },
            getNodeSymbolSize (params) {
                const node = params && params.data ? params.data : null
                const renderMeta = node && node.renderMeta ? node.renderMeta : null
                const symbolType = renderMeta && renderMeta.symbolType ? renderMeta.symbolType : 'branch'

                if (symbolType === 'root') return this.nodeStyleConfig.rootSize
                if (symbolType === 'module') return this.nodeStyleConfig.moduleSize
                return this.nodeStyleConfig.branchNodeSize
            },
            /**
             * 获取连线颜色
             * 从 ECharts 回调参数中提取目标节点（子节点）的 renderMeta.lineColor。
             * 连线颜色由子节点所在分支的色板决定，保证同一分支内连线颜色一致。
             * 若未找到则回退到 nodeStyleConfig.lineColorFallback。
             *
             * @param {Object} params ECharts lineStyle.color 回调参数，包含 data 节点数据
             * @returns {string} 连线颜色值（如 '#1f8ff3'）
             */
            getLineColor (params) {
                const node = params && params.data ? params.data : null
                return node && node.renderMeta && node.renderMeta.lineColor
                    ? node.renderMeta.lineColor
                    : this.nodeStyleConfig.lineColorFallback
            },
            handleSearchLocate () {
                const keyword = (this.searchKeyword || '').trim()
                if (!keyword) return

                const targetNodeId = this.pickNextMatchedNodeId(keyword)
                if (!targetNodeId) {
                    this.$Message.warning('未找到匹配节点')
                    return
                }

                if (this.collapseLevel !== -1) {
                    this.collapseLevel = -1
                }

                if (!this.sourceTreeData) return
                this.renderGraph(this.sourceTreeData)
                this.$nextTick(() => {
                    this.focusNodeById(targetNodeId)
                })
            },
            pickNextMatchedNodeId (keyword) {
                const normalizedKeyword = String(keyword).toLowerCase()
                const shouldRebuild = this.searchKeywordCache !== normalizedKeyword || !this.searchMatchedNodeIds.length

                if (shouldRebuild) {
                    const matchedNodeIds = []
                    const walk = (node) => {
                        if (!node) return
                        const nodeId = String(node.id || '')
                        const info = (node.data && node.data.info) || {}
                        const label = String(node.name || info.lmmc || info.name || '')
                        const isRoot = nodeId === '0' || Boolean(info.isRoot)

                        if (!isRoot && label.toLowerCase().includes(normalizedKeyword)) {
                            matchedNodeIds.push(nodeId)
                        }

                        const children = Array.isArray(node.children) ? node.children : []
                        children.forEach(child => walk(child))
                    }

                    walk(this.sourceTreeData)

                    this.searchMatchedNodeIds = matchedNodeIds
                    this.searchCursor = -1
                    this.searchKeywordCache = normalizedKeyword
                }

                if (!this.searchMatchedNodeIds.length) return ''

                this.searchCursor = (this.searchCursor + 1) % this.searchMatchedNodeIds.length
                return this.searchMatchedNodeIds[this.searchCursor]
            },
            focusNodeById (targetNodeId) {
                if (!this.graphInstance || !targetNodeId) return

                const seriesModel = this.graphInstance.getModel().getSeriesByIndex(0)
                if (!seriesModel) return

                const data = seriesModel.getData()
                let targetIndex = -1
                data.each(index => {
                    const rawItem = data.getRawDataItem(index)
                    if (targetIndex !== -1 || !rawItem) return
                    if (String(rawItem.id || '') === String(targetNodeId)) {
                        targetIndex = index
                    }
                })

                if (targetIndex === -1) return

                this.graphInstance.dispatchAction({ type: 'downplay', seriesIndex: 0 })
                this.graphInstance.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: targetIndex })

                const currentZoom = this.getCurrentSeriesZoom()
                if (!currentZoom || currentZoom < 1) {
                    this.zoomLevel = 1
                    this.applySeriesZoom()
                }
            },
            handleDocumentClick () {
                this.exportMenuVisible = false
                this.collapseMenuVisible = false
            },
            bindGraphRoam () {
                if (!this.graphInstance || this.graphRoamHandler) return
                // ECharts 原生 roam 事件：鼠标滚轮缩放或拖拽平移时，自动同步当前 zoom 到组件状态
                this.graphRoamHandler = () => {
                    const currentZoom = this.getCurrentSeriesZoom()
                    if (!currentZoom || Math.abs(currentZoom - this.zoomLevel) < 0.001) return
                    this.zoomLevel = currentZoom
                    this.refreshCapsuleLabelsByZoom()
                }
                this.graphInstance.on('treeroam', this.graphRoamHandler)
                // 绑定节点点击事件，打开 NodeDetailModal
                this.graphInstance.on('click', params => {
                    if (!params || params.componentType !== 'series' || params.seriesType !== 'tree') return
                    const data = params.data || {}
                    if (!data || !data.rawInfo && !data.data) return
                    this.handleNodeClick(data)
                })
            },
            // 节点点击分发：lmlx==1 打开目录抽屉；lmlx==2 打开知识点详情抽屉
            handleNodeClick (nodeData) {
                if (this.yhlx === 'preview') return
                if (this.yhlx === 'student' && !this.openInfo) return
                if (!nodeData) return
                const rawInfo = nodeData.rawInfo || (nodeData.data && nodeData.data.info) || nodeData
                const lmlx = Number(rawInfo.lmlx)
                const nodeId = rawInfo.id || nodeData.id || ''
                if (!nodeId) return;
                if (lmlx === 1) {
                    if (this.$refs.nodeDetailModal && this.$refs.nodeDetailModal.openCatalogDrawer) {
                        this.$refs.nodeDetailModal.openCatalogDrawer({ id: nodeId, data: { nodedata: rawInfo } }, rawInfo)
                    }
                    return
                }

                if (lmlx !== 2) {
                    if (!(this.yhlx === 'student' && lmlx === 3 && [7, 8, 9, 10].includes(Number(rawInfo.nrlx)))) return
                }

                const zsdId = rawInfo.zsdId || rawInfo.workId || rawInfo.lmid || rawInfo.id || nodeId
                console.log(zsdId, 'zsdId')
                this.nodeDetailActiveNode = {
                    id: nodeId || zsdId,
                    data: {
                        n: rawInfo.id || rawInfo.lmid || zsdId,
                        workId: rawInfo.workId || rawInfo.lmid || zsdId,
                        ok: Boolean(rawInfo.ok),
                        info: {
                            ...rawInfo,
                            zsdId,
                            type: String(rawInfo.type || rawInfo.lmlx || '4')
                        }
                    }
                }

                this.$nextTick(() => {
                    if (this.$refs.nodeDetailModal && this.$refs.nodeDetailModal.openDetail) {
                        this.$refs.nodeDetailModal.openDetail()
                    }
                })
            },
            getCurrentSeriesZoom () {
                if (!this.graphInstance) return null
                const option = this.graphInstance.getOption()
                const series = Array.isArray(option && option.series) ? option.series : []
                if (!series.length) return null
                const zoom = Number(series[0].zoom)
                return Number.isFinite(zoom) && zoom > 0 ? zoom : null
            },
            applySeriesZoom () {
                if (!this.graphInstance) return
                this.graphInstance.setOption({
                    series: [{ zoom: this.zoomLevel }]
                })
            },
            handleResetPosition () {
                this.collapseLevel = 2
                this.zoomLevel = 1;
                this.handleCsh()
            },
            handleCsh () {
                if (this.sourceTreeData) {
                    this.destroyGraph()
                    this.$nextTick(() => {
                        this.renderGraph(this.sourceTreeData)
                    })
                }
            },
            handleZoomIn () {
                // 使用 ECharts 原生 zoom 参数实现放大，同步本地状态
                const current = this.getCurrentSeriesZoom()
                const baseZoom = Number.isFinite(current) && current > 0 ? current : this.zoomLevel
                this.zoomLevel = Math.min(ZOOM_LIMITS.max, Number((baseZoom * ZOOM_LIMITS.inStep).toFixed(2)))
                this.applySeriesZoom()
            },
            handleZoomOut () {
                const current = this.getCurrentSeriesZoom()
                const baseZoom = Number.isFinite(current) && current > 0 ? current : this.zoomLevel
                this.zoomLevel = Math.max(ZOOM_LIMITS.min, Number((baseZoom * ZOOM_LIMITS.outStep).toFixed(2)))
                this.applySeriesZoom()
            },
            handleZoomReset () {
                this.zoomLevel = 1
                this.applySeriesZoom()
            },
            handleCollapse (level) {
                // 展开层级越多，放大率越高，映射从 collapseZoomMap 读取
                this.collapseLevel = level
                this.collapseMenuVisible = false
                const key = String(level)
                const zoom = (this.collapseZoomMap && this.collapseZoomMap[key] !== undefined)
                    ? this.collapseZoomMap[key]
                    : 1
                this.zoomLevel = zoom
                // 重新渲染以应用新的 initialTreeDepth 与 zoom
                if (this.sourceTreeData) {
                    this.renderGraph(this.sourceTreeData)
                }
                this.handleCsh()
            },
            handleExport (type) {
                this.exportMenuVisible = false;
                const link = document.createElement('a')
                switch (type) {
                case 'image':
                    link.href = this.graphInstance.getDataURL({
                        type: 'png',
                        pixelRatio: 2,
                        backgroundColor: '#ffffff'
                    })
                    link.download = `${this.kcmc || '课程知识图谱'}.png`
                    link.click()
                    break;
                case 'xmind': ;
                case 'csv': ;
                case 'xlsx':
                    this.$Message.info('正在导出，请稍候...')
                    this.commonsJs.Axios({
                        url: `${this.commonsJs.apiBaseURL}/kklm/exportKcmlData`,
                        method: 'GET',
                        params: {
                            kcid: this.kcid,
                            kkid: this.kkid,
                            cxlx: 2,
                            format: type
                        },
                        headers: {
                            Token: 'Inco-' + localStorage.getItem('token' + '_' + this.commonsJs.setting.xmid),
                            RoleCode: this.info && this.info.jsdm ? this.info.jsdm : ''
                        },
                        responseType: 'blob'
                    })
                        .then(res => {
                            const blob = res && res.data instanceof Blob
                                ? res.data
                                : new Blob([res && res.data ? res.data : ''], {
                                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
                                })
                            const url = window.URL.createObjectURL(blob)
                            link.href = url
                            link.download = `${this.kcmc || '课程知识图谱'}.${type}`
                            link.click()
                            window.URL.revokeObjectURL(url)
                        })
                        .catch(() => {
                            this.$Message.error('导出失败，请重试')
                        })
                    break;
                default:
                    break;
                }
            },
            destroyGraph () {
                if (this.graphRoamHandler && this.graphInstance) {
                    this.graphInstance.off('graphroam', this.graphRoamHandler)
                    this.graphRoamHandler = null
                }
                if (this.graphInstance) {
                    this.graphInstance.dispose()
                    this.graphInstance = null
                }
            },
            dgchildren (list) {
                if (!Array.isArray(list) || !list.length) return []
                const tree = []
                list.forEach(item => {
                    const nodeId = item.id
                    if (!nodeId) return
                    const normalizedLabel = String(item.lmmc || '').trim()
                    const nodeType = Number(item.lmlx) === 3 ? 4 : 2
                    if (this.yhlx !== 'student') {
                        if (Number(item.lmlx) === 3) {
                            const nrlx = Number(item.nrlx)
                            if (nrlx !== 7 && nrlx !== 8 && nrlx !== 9) return
                        }
                    }
                    tree.push({
                        id: nodeId,
                        name: normalizedLabel,
                        // type: nodeType,
                        data: {
                            info: {
                                ...item,
                                name: normalizedLabel
                            }
                        },
                        children: this.dgchildren(item.children)
                    })
                })
                return tree
            }
        },
        beforeDestroy () {
            document.removeEventListener('click', this.handleDocumentClick)
            if (this.windowResizeHandler) {
                window.removeEventListener('resize', this.windowResizeHandler)
            }
            this.destroyGraph();
        }
    }
</script>

<style>
.ring-graph-page {
    width: 100%;
    height: 100%;
    min-height: 560px;
    position: relative;
    overflow: hidden;
}

.ring-graph-page::before,
.ring-graph-page::after {
    content: '';
    position: absolute;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    filter: blur(86px);
    pointer-events: none;
    z-index: 0;
}

.ring-graph-page::before {
    top: -150px;
    left: 48%;
    transform: translateX(-50%);
    background: rgba(235, 164, 145, 0.45);
}

.ring-graph-page::after {
    top: 52%;
    left: -120px;
    background: rgba(109, 170, 232, 0.36);
}

.ring-graph-canvas {
    width: 100%;
    height: 100%;
    min-height: 560px;
    position: relative;
    z-index: 1;
}

.graph-toolbar {
    position: absolute;
    bottom: 16px;
    right: 30px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px;
    border-radius: 10px;
    user-select: none;
}

.graph-toolbar .graph-toolbar-item {
    background-color: #fff;
    padding: 0 12px;
    border-radius: 8px;
    cursor: pointer;
    color: #333333;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.graph-toolbar .graph-toolbar-item .cj svg {
    width: 20px;
    height: 20px;
    vertical-align: text-bottom;
}

.toolbar-dropdown {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 6px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    padding: 6px 0;
    min-width: 110px;
    z-index: 20;
}

.dropdown-item {
    padding: 7px 16px;
    font-size: 13px;
    color: #333333;
    cursor: pointer;
    transition: background 0.12s;
    white-space: nowrap;
}

.dropdown-item:hover {
    background: #f0f5ff;
    color: #2d8cf0;
}

.dropdown-item.active {
    background: #e6f0ff;
    color: #2d8cf0;
    font-weight: 500;
}

.zoom-control {
    display: flex;
    align-items: center;
    border-radius: 6px;
    border: 1px solid #e5e5e5;
    overflow: hidden;
}

.zoom-btn {
    width: 30px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 15px;
    color: #555;
    transition: all 0.12s;
}

.zoom-btn:hover {
    background: #f0f5ff;
    color: #2d8cf0;
}

.zoom-divider {
    width: 1px;
    height: 18px;
    background: #e5e5e5;
}

.zoom-text {
    width: 50px;
    padding: 0 10px;
    font-size: 12px;
    color: #333333;
    cursor: pointer;
    min-width: 42px;
    text-align: center;
    transition: color 0.12s;
}

.zoom-text:hover {
    color: #2d8cf0;
}
</style>
