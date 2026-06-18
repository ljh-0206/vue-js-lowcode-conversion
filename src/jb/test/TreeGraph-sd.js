let name = 'TreeGraph'
let styleClass = `
.tree-page {
    width: 100%;
    height: 100%;
    min-height: 560px;
    position: relative;
}

.tree-toolbar {
    position: absolute;
    right: 18px;
    bottom: 18px;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 12px;
    width: 296px;
    height: 40px;
}

.toolbar-icon-btn {
    width: 48px;
    height: 40px;
    border: 0;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 0 10px rgba(126, 142, 196, 0.16);
    color: #352823;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.12s ease;
}

.toolbar-icon-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 12px rgba(126, 142, 196, 0.24);
}

.toolbar-icon-btn:active {
    transform: translateY(0);
}

.toolbar-svg {
    width: 26px;
    height: 26px;
}

.toolbar-zoom-box {
    position: relative;
    width: 176px;
    height: 40px;
    padding: 0 12px;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 0 10px rgba(126, 142, 196, 0.16);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
}

.toolbar-zoom-box::before,
.toolbar-zoom-box::after {
    content: '';
    position: absolute;
    top: 8px;
    width: 1px;
    height: 24px;
    background: #f2f2f2;
    pointer-events: none;
}

.toolbar-zoom-box::before {
    left: 60px;
}

.toolbar-zoom-box::after {
    right: 60px;
}

.zoom-btn {
    width: 24px;
    height: 24px;
    border: 0;
    background: transparent;
    color: #333333;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    padding: 0;
}

.zoom-btn:hover {
    color: #1e61ff;
}

.zoom-btn:active {
    transform: scale(0.96);
}

.zoom-btn svg {
    width: 20px;
    height: 20px;
}

.zoom-percent {
    width: 48px;
    padding: 0;
    text-align: center;
    color: #333333;
    font-size: 16px;
    font-family: 'Alibaba PuHuiTi 2.0', sans-serif;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0;
}

.tooltip-trigger {
    position: relative;
}

.tooltip-trigger::before {
    content: attr(data-tooltip);
    position: absolute;
    left: 50%;
    bottom: calc(100% + 10px);
    transform: translateX(-50%) translateY(4px);
    background: #2f3136;
    color: #ffffff;
    border-radius: 6px;
    padding: 8px 10px;
    font-size: 14px;
    line-height: 1;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    z-index: 30;
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.tooltip-trigger::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: calc(100% + 4px);
    transform: translateX(-50%) translateY(4px);
    border: 6px solid transparent;
    border-top-color: #2f3136;
    opacity: 0;
    pointer-events: none;
    z-index: 30;
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.tooltip-trigger:hover::before,
.tooltip-trigger:hover::after {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

.treeGraphMind {
    width: 100%;
    height: calc(100% - 100px);
    position: absolute;
}

.tree-page .style-TreeGraph {
    background: #ffffff00;
}

.tree-page .style-TreeGraph jmnode {
    border: 2px solid transparent !important;
    border-radius: 12px;
    min-width: 0;
    padding: 0;
    box-shadow: none;
    color: inherit !important;
    font-weight: 600;
    background: transparent !important;
    background-image: none !important;
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-sizing: border-box;
    overflow: visible;
}

.tree-page .style-TreeGraph jmnode.root {
    min-width: 0;
    border-radius: 14px;
    background: transparent !important;
    box-shadow: none;
}

.tree-page .style-TreeGraph jmnode.selected {
    filter: none !important;
    box-shadow: 0 3px 10px rgba(34, 63, 120, 0.15) !important;
    outline-color: #02807f !important;
    border-color: #02807f !important;
}

.tree-page .style-TreeGraph .tg-node-content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.tree-page .style-TreeGraph .tg-node-title {
    padding: 14px 22px;
    border-radius: 14px;
    background: #97edf9;
    box-shadow: 0 3px 10px rgba(34, 63, 120, 0.15);
    color: #ffffff;
    font-size: 18px;
    line-height: 1.35;
    font-weight: 700;
    text-align: center;
    box-sizing: border-box;
    white-space: normal;
    word-break: break-word;
}

.tree-page .style-TreeGraph .tg-node-title.jd {
    display: flex;
    align-items: center;
}

.tg-node-title-text {
    flex: 1;
    font-size: 18px;
    color: rgba(255, 255, 255, 1);
    font-weight: 600;
}

.tree-page .style-TreeGraph .tg-node-title-border {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 4px solid #ffffff54;
    overflow: hidden;
    display: flex;
    align-items: center;
    margin-left: 12px;
}

.tree-page .style-TreeGraph .tg-node-percentage {
    display: inline-block;
    width: 34px;
    height: 34px;
    text-align: center;
    border-radius: 50%;
    background: #ffffff;
    color: var(--tg-node-accent, #9b2fb3);
    font-size: 10px;
    font-weight: 400;
    line-height: 34px;
}

.tree-page .style-TreeGraph jmnode.root .tg-node-title {
    min-width: 170px;
    background: linear-gradient(90deg, #9b2fb3 0%, #db43a5 100%);
    box-shadow: 0 8px 22px rgba(194, 57, 157, 0.38);
}

.tree-page .style-TreeGraph .tg-node-tags {
    min-width: 246px;
    position: absolute;
    bottom: -35px;
    left: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: max-content;
    max-width: 100%;
    gap: 6px;
}

.tree-page .style-TreeGraph .tg-zsd-tag.tg-zsd-tag {
    background: #02807F;
    color: #ffffff !important;
}

.tree-page .style-TreeGraph .tg-zsd-tag,
.tree-page .style-TreeGraph .tg-node-tag {
    padding: 7px 14px;
    border-radius: 999px;
    background: #d8dbe3;
    color: #666f7d !important;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: 0;
}

.tree-page .style-TreeGraph .tg-node-content--knowledge .tg-node-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    text-align: left;
}

.tree-page .style-TreeGraph .tg-node-zsdzt {
    width: 77px;
    height: 20px;
    border-radius: 14px;
    background: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0 0 6px;
    flex-shrink: 0;
}

.tree-page .style-TreeGraph .tg-node-zsdzt-icon {
    width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.tree-page .style-TreeGraph .tg-node-zsdzt-icon svg {
    width: 16px;
    height: 16px;
    display: block;
}

.tree-page .style-TreeGraph .tg-node-zsdzt-text {
    width: 45px;
    margin-left: 1px;
    font-family: 'Microsoft YaHei', sans-serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    text-align: center;
    color: rgba(20, 202, 180, 1);
    white-space: nowrap;
}

.tree-page .style-TreeGraph .tg-node-content--knowledge .tg-node-title-text {
    min-width: 0;
    flex: 1;
    line-height: 1.35;
    word-break: break-word;
}

.tree-page .style-TreeGraph jmexpander {
    width: 16px;
    height: 16px;
    line-height: 12px;
    border: 1px solid #3d8df5;
    color: #3d8df5;
    background: #ffffff;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 2px 6px rgba(61, 141, 245, 0.22);
    margin-left: 8px;
}

.zsd-panel {
    width: 181px;
    position: absolute;
    padding: 0;
    top: 50%;
    transform: translateY(-50%);
    left: 20px;
    z-index: 100;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0px 0px 0px 0px rgba(108, 105, 255, 0.1), 0px 6px 12px 0px rgba(108, 105, 255, 0.1), 0px 22px 22px 0px rgba(108, 105, 255, 0.09), 0px 50px 30px 0px rgba(108, 105, 255, 0.05), 0px 88px 35px 0px rgba(108, 105, 255, 0.01), 0px 138px 38px 0px rgba(108, 105, 255, 0);
}

.zsd-panel-content {
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(145, 129, 229, 0.3) 0%, rgba(255, 255, 255, 0.5) 33%, rgba(255, 193, 169, 0.5) 66%, rgba(233, 219, 255, 0.72) 100%);
    padding: 30px 20px;
    border-radius: 12px;
}

.zsd-panel .zsd-item {
    margin-bottom: 15px;
    padding: 12px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 15px;
}

.zsd-panel .zsd-item:last-child {
    margin-bottom: 0;
}

.zsd-panel .zsd-item .title {
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    font-weight: 500;
    color: #666666;
}

.zsd-panel .zsd-item .num {
    height: 24px;
    line-height: 24px;
    font-size: 18px;
    font-weight: 700;
    color: #02807f;
}

.kcjgback {
    position: absolute;
    top: 24px;
    left: 35px;
    width: 100px;
    height: 36px;
    border: 1px solid #02807f;
    border-radius: 50px;
    box-sizing: border-box;
    cursor: pointer;
    z-index: 20;
    background: transparent;
    margin-top: -15px;
}

.kcjgback-inner {
    width: 56px;
    height: 19px;
    position: absolute;
    left: 22px;
    top: 8px;
}

.kcjgback-icon {
    width: 18px;
    height: 16px;
    position: absolute;
    left: 0;
    top: 2px;
    object-fit: contain;
}

.kcjgback-text {
    position: absolute;
    left: 28px;
    top: 0;
    width: 28px;
    height: 19px;
    line-height: 19px;
    font-family: 'Microsoft YaHei', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #02807f;
}
`

return {
    template: `<div class="tree-page">
        <div class="zsd-panel">
            <div class="zsd-panel-content">
                <div class="zsd-item" v-for="item in zsdtjList" :key="item.lx">
                    <div class="title">{{ item.name }}</div>
                    <div class="num">{{ item.num }}</div>
                </div>
            </div>
        </div>
        <kctpJsMindComponent ref="treeGraphMind" class="treeGraphMind" :datas="jsMindData.data"
            :configdata="treeGraphConfig" :options="jsMindOptions" :beforeShow="applyCustomLineRenderer"
            @zoom-change="handleMindZoomChange" @node-select="handleMindNodeSelect" @toggle-all="handleMindToggleAll" />
        <div class="tree-toolbar">
            <button class="toolbar-icon-btn tooltip-trigger" :data-tooltip="isCollapsedAll ? '展开节点' : '收起节点'"
                @click="toggleAllNodes">
                <svg viewBox="0 0 20.0957 16.8125" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" width="20.095703" height="16.812500" fill="none"
                    customFrame="#000000">
                    <path id="矢量 149"
                        d="M19.2911 1.60759L0.803794 1.60759C0.63405 1.60759 0.468662 1.55385 0.331336 1.45408C0.19401 1.3543 0.0917946 1.21362 0.0393406 1.05218C-0.0131134 0.890743 -0.0131134 0.716845 0.0393405 0.555408C0.0917945 0.393971 0.19401 0.253285 0.331336 0.153511C0.468662 0.0537376 0.634049 0 0.803794 0L19.2911 0C19.4608 0 19.6262 0.0537376 19.7635 0.153511C19.9008 0.253284 20.0031 0.393971 20.0555 0.555408C20.108 0.716845 20.108 0.890743 20.0555 1.05218C20.0031 1.21362 19.9008 1.3543 19.7635 1.45408C19.6262 1.55385 19.4608 1.60759 19.2911 1.60759L19.2911 1.60759ZM19.2911 16.8124L0.803794 16.8124C0.634115 16.8123 0.46882 16.7585 0.331582 16.6587C0.194345 16.5589 0.0922047 16.4182 0.0397901 16.2569C-0.0126244 16.0955 -0.0126244 15.9216 0.0397901 15.7603C0.0922046 15.5989 0.194345 15.4582 0.331582 15.3584C0.46882 15.2587 0.634115 15.2049 0.803794 15.2048L19.2911 15.2048C19.4607 15.2049 19.626 15.2587 19.7633 15.3584C19.9005 15.4582 20.0026 15.5989 20.0551 15.7603C20.1075 15.9216 20.1075 16.0955 20.0551 16.2569C20.0026 16.4182 19.9005 16.5589 19.7633 16.6587C19.626 16.7585 19.4607 16.8123 19.2911 16.8124L19.2911 16.8124ZM12.8607 9.17631L0.803794 9.17631C0.63405 9.17631 0.468662 9.12257 0.331336 9.0228C0.19401 8.92303 0.0917945 8.78234 0.0393405 8.6209C-0.0131135 8.45947 -0.0131135 8.28557 0.0393405 8.12413C0.0917945 7.9627 0.194009 7.82201 0.331336 7.72224C0.468662 7.62246 0.634049 7.56872 0.803794 7.56872L12.8607 7.56872C13.0304 7.56883 13.1957 7.62262 13.3329 7.7224C13.4702 7.82219 13.5723 7.96284 13.6247 8.12422C13.6771 8.2856 13.6771 8.45943 13.6247 8.62081C13.5723 8.78219 13.4702 8.92285 13.3329 9.02263C13.1957 9.12242 13.0304 9.17621 12.8607 9.17631L12.8607 9.17631ZM16.6687 4.70521L19.924 7.96057C19.9965 8.03281 20.0486 8.12288 20.0751 8.22168C20.1017 8.32049 20.1017 8.42455 20.0751 8.52335C20.0486 8.62216 19.9965 8.71223 19.924 8.78446L16.6687 12.0398C16.5872 12.1213 16.4834 12.1767 16.3704 12.1992C16.2573 12.2217 16.1402 12.2101 16.0338 12.166C15.9273 12.122 15.8363 12.0473 15.7723 11.9515C15.7082 11.8557 15.674 11.7431 15.674 11.6279L15.674 5.11715C15.674 5.00193 15.7082 4.88931 15.7723 4.79352C15.8363 4.69773 15.9273 4.62308 16.0338 4.57899C16.1402 4.53491 16.2573 4.52337 16.3704 4.54583C16.4834 4.5683 16.5872 4.62376 16.6687 4.70521L16.6687 4.70521Z"
                        fill="rgb(35,24,21)" fill-rule="nonzero" />
                </svg>
            </button>
            <div class="toolbar-zoom-box">
                <button class="zoom-btn tooltip-trigger" data-tooltip="缩小" @click="zoomOut" aria-label="缩小">
                    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
                        <path
                            d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
                            stroke="currentColor" stroke-width="1.6" />
                        <path d="M14.4 10L5.6 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </button>
                <span class="zoom-percent">{{ zoomPercent }}%</span>
                <button class="zoom-btn tooltip-trigger" data-tooltip="放大" @click="zoomIn" aria-label="放大">
                    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
                        <path
                            d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
                            stroke="currentColor" stroke-width="1.6" />
                        <path d="M10 5.6L10 14.4M14.4 10L5.6 10" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                    </svg>
                </button>
            </div>
            <button class="toolbar-icon-btn tooltip-trigger" data-tooltip="编辑" @click="onEditClick"
                v-if="yhlx == 'teacher'">
                <svg viewBox="0 0 19.5605 17.4844" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" width="19.560547" height="17.484375" fill="none"
                    customFrame="#000000">
                    <path id="矢量 148"
                        d="M13.3695 0.499308L13.4478 0.573757L16.9107 4.03661C17.1454 4.27117 17.3167 4.56148 17.4085 4.88034C17.5003 5.19919 17.5096 5.53614 17.4355 5.85958C17.3615 6.18302 17.2065 6.48235 16.9851 6.72951L16.9112 6.80788L6.80767 16.9109C6.63899 17.0796 6.44093 17.216 6.22324 17.3135C6.00554 17.411 5.77186 17.468 5.53371 17.4815L5.42253 17.4845L1.46939 17.4845C1.22124 17.4845 0.977134 17.4216 0.759829 17.3018C0.542523 17.182 0.359099 17.0091 0.226662 16.7993C0.0942247 16.5894 0.0170891 16.3495 0.00244886 16.1018L0 16.0151L0 12.0624C-1.28746e-05 11.8238 0.0435732 11.5871 0.128612 11.3642C0.213651 11.1412 0.338711 10.9356 0.497632 10.7576L0.574041 10.6768L10.6771 0.573757C10.9116 0.339202 11.2019 0.168052 11.5207 0.0763486C11.8395 -0.0153551 12.1764 -0.0246091 12.4998 0.0494549C12.8231 0.123519 13.1224 0.278475 13.3695 0.499798L13.3695 0.499308ZM19.0702 15.4856C19.1562 15.4856 19.2406 15.5082 19.3151 15.5512C19.3896 15.5942 19.4514 15.656 19.4944 15.7305C19.5374 15.8049 19.56 15.8894 19.56 15.9754L19.56 16.955C19.56 17.041 19.5374 17.1254 19.4944 17.1999C19.4514 17.2743 19.3896 17.3362 19.3151 17.3792C19.2406 17.4221 19.1562 17.4448 19.0702 17.4448L11.2335 17.4448C11.1475 17.4448 11.063 17.4221 10.9886 17.3792C10.9141 17.3362 10.8523 17.2743 10.8093 17.1999C10.7663 17.1254 10.7437 17.041 10.7437 16.955L10.7437 15.9754C10.7437 15.8894 10.7663 15.8049 10.8093 15.7305C10.8523 15.656 10.9141 15.5942 10.9886 15.5512C11.063 15.5082 11.1475 15.4856 11.2335 15.4856L19.0702 15.4856ZM9.29143 4.72968L1.95918 12.0614L1.95918 15.5243L5.42253 15.5248L12.7548 8.19253L9.29143 4.7287L9.29143 4.72968ZM19.0702 11.5672C19.1562 11.5672 19.2406 11.5899 19.3151 11.6328C19.3896 11.6758 19.4514 11.7377 19.4944 11.8121C19.5374 11.8866 19.56 11.971 19.56 12.057L19.56 13.0366C19.56 13.1226 19.5374 13.2071 19.4944 13.2815C19.4514 13.356 19.3896 13.4178 19.3151 13.4608C19.2406 13.5038 19.1562 13.5264 19.0702 13.5264L15.1518 13.5264C15.0659 13.5264 14.9814 13.5038 14.9069 13.4608C14.8325 13.4178 14.7706 13.356 14.7277 13.2815C14.6847 13.2071 14.662 13.1226 14.662 13.0366L14.662 12.057C14.662 11.971 14.6847 11.8866 14.7277 11.8121C14.7706 11.7377 14.8325 11.6758 14.9069 11.6328C14.9814 11.5899 15.0659 11.5672 15.1518 11.5672L19.0702 11.5672ZM12.0622 1.9589L10.6775 3.34404L14.1404 6.8069L15.5255 5.42225L12.0627 1.9589L12.0622 1.9589Z"
                        fill="rgb(34,36,41)" fill-rule="nonzero" />
                </svg>
            </button>
        </div>
        <NodeDetailModal v-if="yhlx !== 'preview'" ref="nodeDetailModal" :activeNode="nodeDetailActiveNode" :kcid="kcid"
            :kkid="kkid" :sfzyxxms="sfzyxxms" :kcfmUrl="kcfmUrl" :xxjd="xxjd" />
        <Modal class-name="kcjg-modal" v-model="kcjgModal" fullscreen :closable="false" :mask-closable="false"
            :header-hide="true" :footer-hide="true">
            <div class="kcjgback" @click="onKcjgBackClick">
                <div class="kcjgback-inner">
                    <img class="kcjgback-icon" :src="commonsJs.fileUrl + '3BD16CFAC8B2BE93E065020C296463DE'" alt="返回">
                    <span class="kcjgback-text">返回</span>
                </div>
            </div>
            <kcjg v-if="kcjgModal"></kcjg>
        </Modal>
    </div>`,
    name: name,
    inject: ['yhlx'],
    props: {
        sfzyxxms: { type: Boolean, default: false },
        xxjd: { type: Number, default: 0 },
        searchKeyword: { type: String, default: '' },
        searchSignal: { type: Number, default: 0 }
    },
    data() {
        return {
            kkid: '',
            kcid: '',
            kcmc: '',
            kcfmUrl: '',
            editbg: this.commonsJs.fileUrl + '3BAE10E01795B682E065020C296463DE',
            linebg: this.commonsJs.fileUrl + '3C4E3FE9FEF04D7FE065020C296463DE',
            datebg: this.commonsJs.fileUrl + '3BC3D77B55FA2E9AE065020C296463DE',
            progressbg: this.commonsJs.fileUrl + '3BC3DC5B3E873782E065020C296463DE',
            timebg: this.commonsJs.fileUrl + '3BC3DC5B3E893782E065020C296463DE',
            nodeDetailActiveNode: {},
            jsMindData: {
                meta: {
                    name: 'jsMind',
                    author: 'auto-generated',
                    version: '0.2'
                },
                format: 'node_tree',
                data: {}
            },
            nodecolor: [
                { one: '#0390f5', two: '#97edf9', three: '#c6e4ed' },
                { one: '#8370f3', two: '#b7acf7', three: '#d1bdfd' },
                { one: '#d8aa52', two: '#ecb585', three: '#f8d8bd' },
                { one: '#4bc9aa', two: '#7edcc8', three: '#d8edea' },
                { one: '#bf66e7', two: '#f282bc', three: '#f7bfdc' },
                { one: '#0747f2', two: '#1d9eef', three: '#b3d7f8' },
                { one: '#5102f1', two: '#570ef3', three: '#c3a7ff' },
                { one: '#cf3e0e', two: '#db571e', three: '#ffbfa3' },
                { one: '#007699', two: '#047b9a', three: '#a3cfdb' },
                { one: '#6709aa', two: '#900887', three: '#ffafde' }
            ],
            isCollapsedAll: false,
            currentZoom: 1,
            resizeTimer: null,
            mindInitRetryTimer: null,
            pendingSelectNodeId: '',
            pendingSelectMouseupHandler: null,
            searchMatchedNodeIds: [],
            searchCursor: -1,
            searchKeywordCache: '',
            customLineConfig: {
                elbowOffset: 30,
                maxCornerRadius: 10
            },
            jsMindOptions: {
                editable: false,
                mode: 'full',
                support_html: true,
                default_event_handle: {
                    enable_mousewheel_handle: true
                },
                view: {
                    engine: 'canvas',
                    line_width: 2,
                    line_color: '#1E61FF',
                    line_style: 'elbow-round',
                    draggable: true,
                    hide_scrollbars_when_draggable: true,
                    node_overflow: 'wrap',
                    zoom: {
                        min: 0.01,
                        max: 2.5,
                        step: 0.05
                    },
                    enable_device_pixel_ratio: false,
                    expander_style: 'char',
                    hmargin: (window.innerWidth / 2) - 50
                },
                layout: {
                    hspace: 30,
                    vspace: 50,
                    pspace: 13,
                    cousin_space: 0
                }
            },
            treeGraphConfig: {
                blm: 'TreeGraph'
            },
            zsdtjList: [
                { lx: '1', name: '知识关系', num: 0 },
                { lx: '2', name: '知识点', num: 0 },
                { lx: '3', name: '资源', num: 0 },
                { lx: '4', name: '试题', num: 0 },
                { lx: '6', name: '重点', num: 0 },
                { lx: '7', name: '难点', num: 0 },
                { lx: '8', name: '考点', num: 0 }
            ],
            kcjgModal: false
        }
    },
    created() {
        this.commonsJs.loadCssCode(styleClass, name)
        const { kcid = '', kkid = '', bjid = '' } = this.$route.query || {}
        this.kcid = kcid
        this.kkid = kkid
        this.bjid = bjid
        this.getzsd()
        this.getfm()
        this.getData()
    },
    watch: {
        searchSignal() {
            this.handleSearchLocate()
        }
    },
    computed: {
        zoomPercent() {
            return Math.round(this.currentZoom * 100)
        }
    },
    mounted() {
    },
    methods: {
        handlerImg(id) {
            return this.commonsJs.fileUrl + id
        },
        getzsd() {
            this.commonsJs
                .incoRequest_self('/knowledge/findKnowledgeCountX', 'get', {
                    kkid: this.kkid,
                    bjid: this.bjid
                })
                .then((res) => {
                    console.log('findKnowledgeCountX:', res)
                })
            this.commonsJs
                .incoRequest_self('/knowledge/findKnowledgeCount', 'get', {
                    kkid: this.kkid,
                    bjid: this.bjid
                })
                .then((res) => {
                    this.zsdtjList = [
                        { lx: '1', name: '知识关系', num: res.zsgxs },
                        { lx: '2', name: '知识点', num: res.zsds },
                        { lx: '3', name: '资源', num: res.zys },
                        { lx: '4', name: '试题', num: res.sts },
                        { lx: '6', name: '重点', num: res.zds },
                        { lx: '7', name: '难点', num: res.nds },
                        { lx: '8', name: '考点', num: res.kds }
                    ]
                })
        },
        async getfm() {
            const res = await this.commonsJs.incoRequest_self('/courseStarts/findCourseBasicData', 'get', {
                kkid: this.kkid,
                kcid: this.kcid
            })
            const { kcfmUrl = '', kcmc = '' } = res || {}
            this.kcfmUrl = kcfmUrl
            this.kcmc = kcmc
        },
        async getData() {
            try {
                let url = '/kklm/queryTreeList'
                let params = {
                    kkid: this.kkid,
                    kcid: this.kcid,
                    yhdm: _this.info.yhdm
                }
                if (this.yhlx !== 'teacher') {
                    url = '/studentStudy/chapterDirectory'
                    params = {
                        kkid: this.kkid,
                        kcid: this.kcid,
                        yhdm: _this.info.yhdm,
                        queryType: 3
                    }
                }
                const res = await this.commonsJs.incoRequest_self(url, 'get', params)
                const rootNode = {
                    id: '0',
                    lmmc: this.kcmc || '课程知识图谱',
                    type: 1,
                    workId: 'root',
                    lmlx: 0,
                    children: res
                }
                this.jsMindData = this.convertToJsMindFormat(rootNode)
                this.$nextTick(() => {
                    requestAnimationFrame(() => this.initializeMindView())
                })
            } catch (error) {
                console.error(error)
            }
        },
        initializeMindView(retryCount) {
            if (retryCount === undefined) retryCount = 0
            const mindInstance = this.getMindInstance()
            if (!mindInstance) {
                this.scheduleMindInitRetry(retryCount)
                return
            }
            if (this.mindInitRetryTimer) {
                clearTimeout(this.mindInitRetryTimer)
                this.mindInitRetryTimer = null
            }
            if (typeof mindInstance.collapse_all === 'function') {
                mindInstance.collapse_all()
                this.isCollapsedAll = true
            }
            this.fitMindToContainerWidth()
            this.redrawLines()
            this.$nextTick(() => {
                this.handleSearchLocate()
            })
        },
        scheduleMindInitRetry(retryCount) {
            var maxRetryCount = 20
            if (retryCount >= maxRetryCount) return
            if (this.mindInitRetryTimer) {
                clearTimeout(this.mindInitRetryTimer)
            }
            this.mindInitRetryTimer = setTimeout(() => {
                this.initializeMindView(retryCount + 1)
            }, 120)
        },
        handleSearchLocate() {
            var keyword = (this.searchKeyword || '').trim()
            if (!keyword) return
            var targetNode = this.pickNextMatchedNode(keyword)
            if (!targetNode) {
                this.$Message.warning('未找到匹配节点')
                return
            }
            this.revealAndHighlightNode(targetNode)
        },
        pickNextMatchedNode(keyword) {
            var mindInstance = this.getMindInstance()
            if (!mindInstance || !mindInstance.mind || !mindInstance.mind.nodes) return null
            var normalizedKeyword = String(keyword).toLowerCase()
            var shouldRebuild = this.searchKeywordCache !== normalizedKeyword || !this.searchMatchedNodeIds.length
            if (shouldRebuild) {
                var nodes = Object.values(mindInstance.mind.nodes)
                this.searchMatchedNodeIds = nodes
                    .filter(function (node) {
                        if (!node || node.isroot || !node.data) return false
                        var nodeData = node.data.nodedata || node.data || {}
                        var label = String(nodeData.lmmc || node.topic || '')
                        return label.toLowerCase().includes(normalizedKeyword)
                    })
                    .map(function (node) { return node.id })
                this.searchCursor = -1
                this.searchKeywordCache = normalizedKeyword
            }
            if (!this.searchMatchedNodeIds.length) return null
            this.searchCursor = (this.searchCursor + 1) % this.searchMatchedNodeIds.length
            var targetId = this.searchMatchedNodeIds[this.searchCursor]
            return this.getMindNodeById(mindInstance, targetId)
        },
        revealAndHighlightNode(node) {
            var mindInstance = this.getMindInstance()
            if (!mindInstance || !node) return
            this.expandNodeAncestors(mindInstance, node)
            if (typeof mindInstance.select_node === 'function') {
                mindInstance.select_node(node.id)
            }
            this.applySelectedNodeStyle(node)
            this.scrollNodeIntoView(node)
            this.redrawLines()
        },
        expandNodeAncestors(mindInstance, node) {
            if (typeof mindInstance.expand_node !== 'function') return
            var current = node && node.parent ? node.parent : null
            while (current) {
                mindInstance.expand_node(current)
                current = current.parent || null
            }
        },
        scrollNodeIntoView(node) {
            var element = node && node._data && node._data.view ? node._data.view.element : null
            if (!element || typeof element.scrollIntoView !== 'function') return
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            })
        },
        fitMindToContainerWidth() {
            var mindInstance = this.getMindInstance()
            if (!mindInstance || !mindInstance.view) return false
            var view = mindInstance.view
            var setZoom = typeof view.set_zoom === 'function'
                ? function (zoom) { return view.set_zoom(zoom) }
                : (typeof view.setZoom === 'function' ? function (zoom) { return view.setZoom(zoom) } : null)
            if (!setZoom) return false
            var panel = view.e_panel
            var nodes = panel ? panel.querySelector('jmnodes') : null
            if (!panel || !nodes) return false
            var panelWidth = panel.clientWidth
            var panelHeight = panel.clientHeight
            var sizeWidth = view.size && view.size.w ? view.size.w : (nodes.scrollWidth || nodes.clientWidth)
            var sizeHeight = view.size && view.size.h ? view.size.h : panelHeight
            if (!sizeWidth || !panelWidth || !sizeHeight || !panelHeight) return false
            var zoomConfig = this.jsMindOptions && this.jsMindOptions.view
                ? this.jsMindOptions.view.zoom
                : null
            var minZoom = zoomConfig && Number.isFinite(zoomConfig.min) ? zoomConfig.min : 0.5
            var maxZoom = zoomConfig && Number.isFinite(zoomConfig.max) ? zoomConfig.max : 2.1
            var widthFitZoom = panelWidth / sizeWidth
            var heightFitZoom = panelHeight / sizeHeight
            var rawZoom = Math.max(widthFitZoom, heightFitZoom) + 0.01
            var targetZoom = Math.max(minZoom, Math.min(maxZoom, Number(rawZoom.toFixed(2))))
            if (!setZoom(targetZoom)) return false
            this.currentZoom = targetZoom
            return true
        },
        handleMindZoomChange(zoom) {
            var currentZoom = Number(zoom)
            if (!Number.isFinite(currentZoom) || currentZoom <= 0) return
            this.currentZoom = Number(currentZoom.toFixed(2))
        },
        handleMindNodeSelect(payload) {
            var selectedNodeId = payload && payload.nodeId ? payload.nodeId : ''
            if (!selectedNodeId) return
            this.deferNodeSelectAction(selectedNodeId)
        },
        applyCustomLineRenderer(mindInstanceParam) {
            var mindInstance = mindInstanceParam || this.getMindInstance()
            if (!mindInstance || !mindInstance.view || !mindInstance.layout) return false
            var view = mindInstance.view
            var graph = view.graph
            if (!graph || !graph.canvas_ctx) return false
            if (mindInstance.__treeGraphLinePatched) return true
            var originalShowLines = typeof view.show_lines === 'function'
                ? function () { view.show_lines() }
                : null
            var componentVm = this
            view.show_lines = function () {
                if (!view.graph || !view.graph.canvas_ctx) {
                    if (originalShowLines) originalShowLines()
                    return
                }
                graph.clear()
                var ctx = graph.canvas_ctx
                var nodes = mindInstance.mind && mindInstance.mind.nodes ? mindInstance.mind.nodes : {}
                var offset = typeof view.get_view_offset === 'function' ? view.get_view_offset() : { x: 0, y: 0 }
                var lineWidth = componentVm.jsMindOptions && componentVm.jsMindOptions.view
                    ? componentVm.jsMindOptions.view.line_width
                    : 2
                var defaultColor = componentVm.jsMindOptions && componentVm.jsMindOptions.view
                    ? componentVm.jsMindOptions.view.line_color
                    : '#1E61FF'
                Object.keys(nodes).forEach(function (nodeId) {
                    var node = nodes[nodeId]
                    if (!node || node.isroot || !node.parent) return
                    if (!node._data || !node._data.layout || !node._data.view) return
                    if (!node.parent._data || !node.parent._data.layout || !node.parent._data.view) return
                    if (node._data.layout.visible === false) return
                    try {
                        var pin = mindInstance.layout.get_node_point_in(node)
                        var pout = mindInstance.layout.get_node_point_out(node.parent)
                        var lineColor = node.data && node.data['line-color'] ? node.data['line-color'] : defaultColor
                        var rootLineExtraOffset = node.parent && node.parent.isroot ? -20 : 0
                        componentVm.drawRoundedElbowLine(
                            ctx,
                            pout.x + offset.x,
                            pout.y + offset.y,
                            pin.x + offset.x,
                            pin.y + offset.y,
                            lineColor,
                            lineWidth,
                            rootLineExtraOffset
                        )
                    } catch (error) {
                    }
                })
            }
            mindInstance.__treeGraphLinePatched = true
            return true
        },
        deferNodeSelectAction(nodeId) {
            if (!nodeId) return
            this.pendingSelectNodeId = nodeId
            if (this.pendingSelectMouseupHandler) return
            this.pendingSelectMouseupHandler = function () {
                var mindInstance = this.getMindInstance()
                var selectedNode = this.getMindNodeById(mindInstance, this.pendingSelectNodeId)
                this.pendingSelectNodeId = ''
                this.clearPendingSelectHandler()
                if (!selectedNode) return
                this.applySelectedNodeStyle(selectedNode)
                this.handleNodeClick(selectedNode)
            }
            window.addEventListener('mouseup', this.pendingSelectMouseupHandler, { once: true })
        },
        clearPendingSelectHandler() {
            if (!this.pendingSelectMouseupHandler) return
            window.removeEventListener('mouseup', this.pendingSelectMouseupHandler)
            this.pendingSelectMouseupHandler = null
        },
        applySelectedNodeStyle(node) {
            if (!node || !node.data) return
            var titleElement = this.getNodeTitleElement(node)
            if (!titleElement) return
            var backgroundColor = node.data['background-color']
            var foregroundColor = node.data['foreground-color']
            if (backgroundColor) titleElement.style.backgroundColor = backgroundColor
            if (foregroundColor) titleElement.style.color = foregroundColor
        },
        getNodeTitleElement(node) {
            var element = node && node._data && node._data.view ? node._data.view.element : null
            return element ? element.querySelector('.tg-node-title') : null
        },
        getLineConfigValue(key, fallback) {
            var value = Number(this.customLineConfig && this.customLineConfig[key])
            return Number.isFinite(value) ? value : fallback
        },
        getMindInstance() {
            var component = this.$refs.treeGraphMind
            if (!component) return null
            if (typeof component.getMind === 'function') {
                return component.getMind()
            }
            return component.myMind || null
        },
        getMindNodeById(mindInstance, nodeId) {
            if (!mindInstance || !nodeId) return null
            if (typeof mindInstance.get_node === 'function') {
                return mindInstance.get_node(nodeId)
            }
            return mindInstance.mind && mindInstance.mind.nodes
                ? mindInstance.mind.nodes[nodeId] || null
                : null
        },
        redrawLines() {
            this.applyCustomLineRenderer()
            var component = this.$refs.treeGraphMind
            if (component && typeof component.redrawLines === 'function') {
                component.redrawLines()
                return
            }
            var mindInstance = this.getMindInstance()
            if (mindInstance && mindInstance.view && typeof mindInstance.view.show_lines === 'function') {
                mindInstance.view.show_lines()
            }
        },
        toggleAllNodes() {
            var component = this.$refs.treeGraphMind
            if (!component || typeof component.toggleAllNodes !== 'function') return
            component.toggleAllNodes(this.isCollapsedAll)
        },
        handleMindToggleAll(payload) {
            if (!payload || typeof payload.collapsed !== 'boolean') return
            this.isCollapsedAll = payload.collapsed
        },
        zoomIn() {
            var mindInstance = this.getMindInstance()
            if (!mindInstance || !mindInstance.view || typeof mindInstance.view.zoomIn !== 'function') return
            mindInstance.view.zoomIn()
            this.redrawLines()
        },
        zoomOut() {
            var mindInstance = this.getMindInstance()
            if (!mindInstance || !mindInstance.view || typeof mindInstance.view.zoomOut !== 'function') return
            mindInstance.view.zoomOut()
            this.redrawLines()
        },
        onEditClick() {
            this.kcjgModal = true
        },
        onKcjgBackClick() {
            this.kcjgModal = false
        },
        drawRoundedElbowLine(ctx, x1, y1, x2, y2, color, width, extraOffset) {
            if (extraOffset === undefined) extraOffset = 0
            ctx.strokeStyle = color
            ctx.lineWidth = width
            ctx.lineCap = 'round'
            ctx.beginPath()
            if (Math.abs(y2 - y1) < 1 || Math.abs(x2 - x1) < 1) {
                ctx.moveTo(x1, y1)
                ctx.lineTo(x2, y2)
                ctx.stroke()
                return
            }
            var dirX = x2 >= x1 ? 1 : -1
            var dirY = y2 >= y1 ? 1 : -1
            var elbowOffset = this.getLineConfigValue('elbowOffset', 30)
            var maxCornerRadius = this.getLineConfigValue('maxCornerRadius', 2.5)
            var elbowX = x2 - dirX * (elbowOffset + Number(extraOffset || 0))
            var tabRadius = Math.min(maxCornerRadius, Math.abs(y2 - y1) / 2)
            ctx.moveTo(x1, y1)
            ctx.lineTo(elbowX, y1)
            ctx.lineTo(elbowX, y2 - dirY * tabRadius)
            ctx.quadraticCurveTo(elbowX, y2, elbowX + dirX * tabRadius, y2)
            ctx.lineTo(x2, y2)
            ctx.stroke()
        },
        convertToJsMindFormat(treeData) {
            var usedIds = new Set()
            var self = this
            var createSafeId = function (node, depth, rootBranchIndex, childIndex) {
                var candidates = [
                    node && node.id,
                    node && node.workId,
                    node && node.lmid,
                    node && node.kkid,
                    node && node.kcid
                ]
                var baseId = candidates.find(function (item) { return item !== undefined && item !== null && String(item).trim() !== '' })
                if (baseId === undefined || baseId === null || String(baseId).trim() === '') {
                    var topic = (node && node.lmmc ? String(node.lmmc).trim() : '') || 'node'
                    baseId = topic + '-' + depth + '-' + rootBranchIndex + '-' + childIndex
                }
                var safeId = String(baseId)
                if (!usedIds.has(safeId)) {
                    usedIds.add(safeId)
                    return safeId
                }
                var suffix = 1
                while (usedIds.has(safeId + '-' + suffix)) {
                    suffix += 1
                }
                safeId = safeId + '-' + suffix
                usedIds.add(safeId)
                return safeId
            }
            var convertNode = function (node, depth, rootBranchIndex) {
                if (depth === undefined) depth = 0
                if (rootBranchIndex === undefined) rootBranchIndex = 0
                var isLeaf = !node.children || node.children.length === 0
                var palette = self.nodecolor[rootBranchIndex % self.nodecolor.length]
                var colorType = self.getNodeColorType({ depth: depth, isLeaf: isLeaf, lmlx: node.lmlx })
                var nodeColor = self.getNodeColorByType(palette, colorType)
                var childIndex = Number.isInteger(node.__childIndex) ? node.__childIndex : 0
                var currentId = createSafeId(node, depth, rootBranchIndex, childIndex)
                var nodedata = Object.assign({}, node)
                if (nodedata.lmlx != 2) {
                    delete nodedata.children
                }
                var baseNode = {
                    id: currentId,
                    topic: self.buildNodeTopic(node, {
                        isRoot: depth === 0,
                        nodeColor: nodeColor,
                        foregroundColor: '#ffffff'
                    }),
                    expanded: false,
                    nodedata: nodedata,
                    direction: 'right',
                    children: (node.children || []).map(function (child, index) {
                        var nextBranchIndex = depth === 0 ? index : rootBranchIndex
                        return convertNode(Object.assign({}, child, { __childIndex: index }), depth + 1, nextBranchIndex)
                    })
                }
                if (depth === 0) {
                    return Object.assign({}, baseNode, { treekey: 'root' })
                }
                return Object.assign({}, baseNode, {
                    treekey: String.fromCharCode(97 + (rootBranchIndex % 26)),
                    depth: depth,
                    colorType: colorType,
                    'background-color': nodeColor,
                    'foreground-color': '#ffffff',
                    'line-color': palette.two
                })
            }
            return {
                meta: {
                    name: 'jsMind',
                    author: 'auto-generated',
                    version: '0.2'
                },
                format: 'node_tree',
                data: convertNode(treeData)
            }
        },
        getNodeColorType(params) {
            if (params.depth === 1) return 'one'
            if (params.isLeaf && Number(params.lmlx) === 3) return 'three'
            return 'two'
        },
        getNodeColorByType(palette, colorType) {
            if (!palette) return '#97edf9'
            if (colorType === 'one') return palette.one
            if (colorType === 'three') return palette.three
            return palette.two
        },
        buildNodeTopic(node, options) {
            if (options === undefined) options = {}
            var title = node && node.lmmc ? String(node.lmmc) : '未命名节点'
            var escapedTitle = this.escapeHtml(title)
            var isRoot = Boolean(options.isRoot)
            var nodeColor = options.nodeColor || '#97edf9'
            var foregroundColor = options.foregroundColor || '#ffffff'
            var styleAttr = isRoot
                ? ''
                : ' style="--tg-node-accent:' + this.escapeHtml(nodeColor) + ';background:' + this.escapeHtml(nodeColor) + ';color:' + this.escapeHtml(foregroundColor) + ';"'
            if (node && (node.lmlx == 1 || node.lmlx == 0)) {
                var percentage = '<div class="tg-node-title-border">' +
                    '<div class="tg-node-percentage">' + (node.zjjd ? node.zjjd : 0) + '%</div>' +
                    '</div>'
                return '<div class="tg-node-content">' +
                    '<div class="tg-node-title jd"' + styleAttr + '>' +
                    '<div class="tg-node-title-text">' + escapedTitle + '</div>' +
                    (this.yhlx == 'student' && node.lmlx != 0 ? percentage : '') +
                    '</div>' +
                    '</div>'
            }
            if (this.isLeaf(node)) {
                var zsdTags = '<span class="tg-zsd-tag tg-node-tag">知识点</span>'
                var tags = []
                if (Number(node && node.zd) === 1) tags.push('重点')
                if (Number(node && node.nd) === 1) tags.push('难点')
                if (Number(node && node.kd) === 1) tags.push('考点')
                var tagHtml = tags
                    .map(function (label) { return '<span class="tg-node-tag">' + label + '</span>' })
                    .join('')
                var zsdzt = '<div class="tg-node-zsdzt">' +
                    '<span class="tg-node-zsdzt-icon" aria-hidden="true">' +
                    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">' +
                    '<rect width="16" height="16" /><path d="M8.01621 4.18359C7.23141 4.18359 6.46424 4.41631 5.81171 4.85232C5.15917 5.28833 4.65058 5.90805 4.35025 6.63311C4.04992 7.35816 3.97134 8.156 4.12445 8.92571C4.27756 9.69543 4.65547 10.4025 5.21041 10.9574C5.76534 11.5123 6.47237 11.8902 7.24209 12.0434C8.01181 12.1965 8.80964 12.1179 9.5347 11.8175C10.2598 11.5172 10.8795 11.0086 11.3155 10.3561C11.7515 9.70356 11.9842 8.93639 11.9842 8.15159C11.9844 7.45501 11.8011 6.77067 11.4529 6.16738C11.1047 5.5641 10.6037 5.06314 10.0004 4.7149C9.39713 4.36666 8.71279 4.18342 8.01621 4.18359ZM1.01621 10.4836L3.10021 8.39959C3.1264 8.37342 3.1602 8.35621 3.19677 8.35042C3.23334 8.34464 3.2708 8.35058 3.30379 8.36739C3.33678 8.3842 3.3636 8.41102 3.38041 8.44401C3.39723 8.477 3.40316 8.51446 3.39738 8.55103C3.39159 8.5876 3.37438 8.62141 3.34821 8.64759L1.26421 10.7356C1.23802 10.7618 1.20422 10.779 1.16764 10.7848C1.13106 10.7906 1.09359 10.7847 1.06059 10.7678C1.0276 10.751 1.00077 10.7242 0.983957 10.6912C0.967145 10.6582 0.96121 10.6207 0.967003 10.5842C0.972796 10.5476 0.99002 10.5138 1.01621 10.4876Z" fill="rgb(20,202,180)" fill-rule="nonzero" />' +
                    '<path d="M0.0800781 8.9765L1.30008 8.3125L1.16808 9.3845L0.0800781 8.9765Z" fill="rgb(72,170,240)" fill-rule="nonzero" />' +
                    '<path d="M11.6802 3.50021C11.6802 3.57616 11.7027 3.6504 11.7449 3.71355C11.7871 3.7767 11.8471 3.82592 11.9172 3.85498C11.9874 3.88404 12.0646 3.89165 12.1391 3.87683C12.2136 3.86202 12.282 3.82544 12.3357 3.77174C12.3894 3.71804 12.426 3.64961 12.4408 3.57513C12.4556 3.50064 12.448 3.42343 12.4189 3.35326C12.3899 3.28309 12.3407 3.22312 12.2775 3.18093C12.2144 3.13873 12.1401 3.11621 12.0642 3.11621C11.9968 3.11621 11.9306 3.13395 11.8722 3.16766C11.8138 3.20136 11.7653 3.24984 11.7316 3.30821C11.6979 3.36659 11.6802 3.43281 11.6802 3.50021Z" fill="rgb(20,202,180)" fill-rule="nonzero" />' +
                    '<path d="M5 12.5193C5 12.5589 5.01173 12.5976 5.03371 12.6305C5.05568 12.6633 5.08692 12.689 5.12346 12.7041C5.16001 12.7193 5.20022 12.7232 5.23902 12.7155C5.27781 12.7078 5.31345 12.6887 5.34142 12.6608C5.36939 12.6328 5.38844 12.5972 5.39616 12.5584C5.40387 12.5196 5.39991 12.4793 5.38478 12.4428C5.36964 12.4063 5.344 12.375 5.31111 12.353C5.27822 12.3311 5.23956 12.3193 5.2 12.3193C5.16489 12.3193 5.1304 12.3286 5.1 12.3461C5.0696 12.3637 5.04435 12.3889 5.02679 12.4193C5.00924 12.4497 5 12.4842 5 12.5193Z" fill="rgb(72,170,240)" fill-rule="nonzero" />' +
                    '<path d="M4.03999 3.9278L4.91199 3.5918L4.57599 4.4638L3.69999 4.7998L4.03999 3.9278ZM4.03999 4.4638L3.68799 3.6078L4.54399 3.9598L4.89999 4.8158L4.03999 4.4638Z" fill="rgb(255,184,0)" fill-rule="nonzero" />' +
                    '<path d="M13.376 11.5836L14.312 11.2236L13.952 12.1596L13.016 12.5196L13.376 11.5836ZM13.376 12.1596L13 11.2396L13.92 11.6156L14.296 12.5356L13.376 12.1596Z" fill="rgb(20,202,180)" fill-rule="nonzero" />' +
                    '<path d="M12.7599 8.38389L14.8879 6.25589C14.9078 6.23679 14.9324 6.22311 14.9591 6.21615C14.9858 6.2092 15.0139 6.2092 15.0407 6.21615C15.0674 6.22311 15.0919 6.23679 15.1119 6.25589C15.1299 6.27643 15.1426 6.301 15.1491 6.32752C15.1556 6.35404 15.1556 6.38174 15.1491 6.40826C15.1426 6.43478 15.1299 6.45935 15.1119 6.47989L12.9839 8.60789C12.9639 8.62699 12.9394 8.64067 12.9127 8.64763C12.8859 8.65458 12.8578 8.65458 12.8311 8.64763C12.8044 8.64067 12.7798 8.62699 12.7599 8.60789C12.7419 8.58735 12.7291 8.56278 12.7226 8.53626C12.7162 8.50974 12.7162 8.48205 12.7226 8.45552C12.7291 8.429 12.7419 8.40443 12.7599 8.38389Z" fill="rgb(72,170,240)" fill-rule="nonzero" />' +
                    '<path d="M12.4562 9.60805L15.6482 6.41605C15.6681 6.39694 15.6927 6.38327 15.7194 6.37631C15.7461 6.36935 15.7742 6.36935 15.8009 6.37631C15.8277 6.38327 15.8522 6.39694 15.8722 6.41605C15.8902 6.43659 15.9029 6.46116 15.9094 6.48768C15.9159 6.5142 15.9159 6.54189 15.9094 6.56842C15.9029 6.59494 15.8902 6.61951 15.8722 6.64005L12.6802 9.83205C12.6602 9.85115 12.6357 9.86483 12.609 9.87178C12.5822 9.87874 12.5541 9.87874 12.5274 9.87178C12.5007 9.86483 12.4761 9.85115 12.4562 9.83205C12.4382 9.81151 12.4254 9.78694 12.4189 9.76041C12.4124 9.73389 12.4124 9.7062 12.4189 9.67968C12.4254 9.65316 12.4382 9.62859 12.4562 9.60805Z" fill="rgb(255,201,76)" fill-rule="nonzero" />' +
                    '<path d="M10.4111 7.24858L7.65508 10.1086C7.63564 10.129 7.61119 10.1439 7.58419 10.1519C7.55718 10.1599 7.52855 10.1606 7.50115 10.1541C7.47376 10.1475 7.44856 10.1339 7.42807 10.1146L7.42208 10.1086L5.78708 8.40858C5.76673 8.38686 5.75219 8.36036 5.7448 8.33153C5.73741 8.30269 5.73741 8.27246 5.7448 8.24364C5.75219 8.2148 5.76673 8.1883 5.78708 8.16658L6.30008 7.63758C6.31963 7.61716 6.34418 7.6022 6.3713 7.59421C6.39842 7.58622 6.42716 7.58546 6.45467 7.59202C6.48217 7.59857 6.50748 7.61221 6.52808 7.63158L6.53408 7.63758L7.53407 8.67958L9.65907 6.47958C9.67851 6.4592 9.70296 6.44427 9.72997 6.43629C9.75697 6.42831 9.78561 6.42755 9.813 6.43409C9.84039 6.44064 9.86559 6.45425 9.88608 6.47358L9.89207 6.47958L10.4061 7.01258C10.4268 7.03426 10.4416 7.06086 10.4491 7.08986C10.4566 7.11886 10.4566 7.1493 10.4491 7.1783C10.4416 7.2073 10.4268 7.2339 10.4061 7.25558L10.4111 7.24858Z" fill="rgb(255,255,255)" fill-rule="nonzero" />' +
                    '</svg>' +
                    '</span>' +
                    '<span class="tg-node-zsdzt-text">[已完成]</span>' +
                    '</div>'
                var aa = this.getResourceIcon(node.nrlx)
                return '<div class="tg-node-content tg-node-content--knowledge">' +
                    '<div class="tg-node-title"' + styleAttr + '>' +
                    '<span class="tg-node-title-text">' + escapedTitle + '</span>' +
                    (this.yhlx == 'student' && (node.zjjd == 100 || node.sfwc == 1) ? zsdzt : '') +
                    '</div>' +
                    (node.lmlx == 2
                        ? '<div class="tg-node-tags">' + zsdTags + tagHtml + '</div>'
                        : '<div class="tg-node-tags">' + aa + '</div>') +
                    '</div>'
            } else {
                return ''
            }
        },
        isLeaf(data) {
            return data.lmlx == 3 || (data.lmlx == 2 && (!data.children || data.children.length === 0))
        },
        getResourceIcon(nrlx) {
            if (nrlx === undefined || nrlx === null) return ''
            var icons = {
                7: '<span class="tg-node-tag zy-tag-work">作业</span>',
                8: '<span class="tg-node-tag zy-tag-exam">考试</span>',
                9: '<span class="tg-node-tag zy-tag-quiz">测验</span>',
                10: '<span class="tg-node-tag zy-tag-question">知识点试题</span>'
            }
            return icons[nrlx] || ''
        },
        escapeHtml(value) {
            return String(value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
        },
        handleNodeClick(node) {
            if (this.yhlx === 'preview') return
            if (!node || !node.data) return
            var nodeData = node.data.nodedata || node.data
            if (Number(nodeData.lmlx) === 1) {
                if (this.$refs.nodeDetailModal && this.$refs.nodeDetailModal.openCatalogDrawer) {
                    this.$refs.nodeDetailModal.openCatalogDrawer(node, nodeData)
                }
                return
            }
            if (Number(nodeData.lmlx) !== 2) return
            var zsdId = nodeData.zsdid
            this.nodeDetailActiveNode = {
                id: node.id || zsdId,
                data: {
                    n: nodeData.id || nodeData.lmid || zsdId,
                    workId: nodeData.workId || nodeData.lmid || zsdId,
                    ok: Boolean(nodeData.ok),
                    info: Object.assign({}, nodeData, {
                        type: String(nodeData.type || nodeData.lmlx || '4')
                    })
                }
            }
            this.$nextTick(function () {
                if (this.$refs.nodeDetailModal && this.$refs.nodeDetailModal.openDetail) {
                    this.$refs.nodeDetailModal.openDetail()
                }
            })
        }
    },
    beforeDestroy() {
        this.commonsJs.removeCssCode(name)
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer)
            this.resizeTimer = null
        }
        if (this.mindInitRetryTimer) {
            clearTimeout(this.mindInitRetryTimer)
            this.mindInitRetryTimer = null
        }
        this.clearPendingSelectHandler()
    }
}
