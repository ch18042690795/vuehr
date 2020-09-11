<template>
  <div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="display: inline">
          <el-input
            placeholder="通过煤矿名搜索"
            clearable
            @change="keywordsChange"
            style="width: 300px;margin: 0px;padding: 0px;"
            size="mini"
            :disabled="advanceSearchViewVisible"
            @keyup.enter.native="searchEmp"
            prefix-icon="el-icon-search"
            v-model="mineName">
          </el-input>
          <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchEmp">搜索
          </el-button>
        </div>

        <div style="margin-left: 5px;margin-right: 20px;display: inline">
          最新更新时间：{{date}}
          <el-button type="success" size="mini" @click="exportToExcel()"><i class="fa fa-lg fa-level-down"
                                                                            style="margin-right: 5px"></i>导出数据
          </el-button>
        </div>

      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <el-table
            :data="safeSimulations"
            v-loading="tableLoading"
            border
            stripe
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 100%">
            <el-table-column
              type="selection"
              align="left"
              width="30">
            </el-table-column>
            <el-table-column
              prop="number"
              align="left"
              fixed
              label="序号"
              width="100">
              <template scope="scope">
                <span>{{scope.$index+1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="mineName"
              width="180"
              align="left"
              label="煤矿名称">
            </el-table-column>
            <el-table-column
              prop="mmSysName"
              label="监测系统名称"
              width="180">
            </el-table-column>
            <el-table-column
              width="180"
              align="left"
              prop="recordMoment"
              label="矿震记录时刻">
            </el-table-column>
            <el-table-column
              prop="quakeX"
              width="180"
              align="left"
              label="震源x">
            </el-table-column>
            <el-table-column
              prop="quakeY"
              width="180"
              label="震源y">
            </el-table-column>
            <el-table-column
              width="180"
              prop="quakeZ"
              label="震源z">
            </el-table-column>
            <el-table-column
              prop="frequency"
              width="180"
              label="频率">
            </el-table-column>
            <el-table-column
              prop="energy"
              label="能量（单位焦耳）">
            </el-table-column>
            <el-table-column
              prop="magnitude"
              width="180"
              align="left"
              label="震级">
            </el-table-column>
            <el-table-column
              prop="quakePlace"
              width="100"
              label="矿震时间发生位置">
            </el-table-column>
            <el-table-column
              prop="systemType"
              width="220"
              align="left"
              label="记录通道数">
            </el-table-column>
            <el-table-column
              prop="systemVersion"
              align="left"
              width="100"
              label="测量量类型">
            </el-table-column>
            <el-table-column
              width="100"
              align="left"
              prop="samplingLength"
              label="采样长度">
            </el-table-column>
            <el-table-column
              prop="samplingFreq"
              width="100"
              align="left"
              label="采样频率">
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 2px">
            <div style="display: flex;justify-content: space-between;margin: 2px">
              <el-pagination
                background
                :page-size="10"
                :current-page="currentPage"
                @current-change="currentChange"
                layout="prev, pager, next"
                :total="totalCount">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import Blob from '../../excel/Blob'
  import Export2Excel from '../../excel/Export2Excel.js'
  import {formatDate} from '../date/date'

  export default {

    data() {
      return {

        safeSimulations: [],
        mineName: '',
        date:"",
        fileUploadBtnText: '导入数据',
        multipleSelection: [],
        depTextColor: '#c0c4cc',
        totalCount: -1,
        currentPage: 1,
        safeSimulation: {
          mineId: "00000000008",
          mmSysName: "ARAMIS微震",
          recordMoment: "2019-05-30T05:02:22.000+0000",
          quakeX: 36618925,
          quakeY: 4292953,
          quakeZ: 645,
          frequency: 0,
          energy: 3.14,
          magnitude: -0.7,
          quakePlace: "311307工作面",
          systemType: 2,
          systemVersion: "V1.0",
          channelNum: 32,
          monitorType: 1,
          samplingLength: 5000,
          samplingFreq: 6000,
          insertTime: ""

        },
      };
    },
    mounted: function () {
      this.loadsafeSimulations();
      let _this = this;
      if(this.timer){
        clearInterval(this.timer);
      }else{
        this.timer = setInterval(()=>{
          _this.date = date.format("YYYY-MM-DD HH:mm:ss");
          this.loadsafeSimulations();
        },60000);
      }
    },

    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
      }
    },

    methods: {


      keywordsChange(val){
        if (val == '') {
          this.loadsafeSimulations();
        }
      },
      searchEmp(){
        this.loadsafeSimulations();
      },
      exportToExcel() {
        //excel数据导出
        require.ensure([], () => {
          const {
            export_json_to_excel
          } = require('../../excel/Export2Excel');
          const tHeader = ['序号','煤矿名称', '煤矿监测系统名称', '矿震记录时刻', '震源位置x','震源位置y', '震源位置z', '频率','能 量 （单位焦耳）','震级','矿震事件发生位置','系统类型','系统版本号','记录通道数','测量量类型','采样长度','釆样频率'];
          const filterVal = ['number','mineName', 'mmSysName', 'recordMoment', 'quakeX','quakeY', 'quakeZ', 'frequency', 'energy','magnitude','sensorZ','quakePlace','systemType','systemVersion','channelNum','monitorType','samplingLength','samplingFreq'];
          const list = this.safeSimulations;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '列表excel');
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadsafeSimulations();
      },
      loadsafeSimulations(){
        var _this = this;
        this.tableLoading = true;

        this.getRequest("/api/earthquake/getEarthquakeData?page=" + this.currentPage + "&size=10&mineName="+this.mineName).then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            console.log(data);
            debugger;
            if(data.list.length==0){
              alert("未查询到相关数据！")
            }
            _this.date=formatDate(new Date(data.list[0].insertTime),"yyyy-MM-dd hh:mm:ss");
            _this.safeSimulations = data.list;
            _this.totalCount = data.count;
//            _this.emptyEmpData();
          }
        })
      },
    }
  };
</script>
<style>
  .el-dialog__body {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .slide-fade-enter-active {
    transition: all .8s ease;
  }

  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
