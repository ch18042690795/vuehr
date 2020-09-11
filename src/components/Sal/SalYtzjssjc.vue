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
              prop="monitorAreaName"
              label="监测区名称"
              width="180">
            </el-table-column>
            <el-table-column
              width="180"
              align="left"
              prop="mmsysname"
              label="监视系统名称">
            </el-table-column>
            <el-table-column
              prop="sensorid"
              width="180"
              label="传感器编号">
            </el-table-column>
            <el-table-column
              width="180"
              prop="sensortype"
              label="传感器类型">
            </el-table-column>
            <el-table-column
              prop="monitortype"
              width="180"
              label="监测方向">
            </el-table-column>
            <el-table-column
              prop="units"
              label="计量单位">
            </el-table-column>
            <el-table-column
              prop="sensorplase"
              width="180"
              align="left"
              label="传感器位置">
            </el-table-column>
            <!--<el-table-column
              prop="sensorX"
              width="100"
              label="传感器位置x">
            </el-table-column>
            <el-table-column
              prop="sensorY"
              width="220"
              align="left"
              label="传感器位置y">
            </el-table-column>
            <el-table-column
              prop="sensorZ"
              align="left"
              width="100"
              label="传感器位置z">
            </el-table-column>
            <el-table-column
              width="100"
              align="left"
              prop="place1"
              label="方位1">
            </el-table-column>
            <el-table-column
              prop="place2"
              width="100"
              align="left"
              label="方位2">
            </el-table-column>
            <el-table-column
              prop="angle1"
              label="倾角1">
            </el-table-column>
            <el-table-column
              width="85"
              align="left"
              prop="angle2"
              label="倾角2">
            </el-table-column>
            <el-table-column
              width="85"
              align="left"
              label="深度1"
              prop="depth1">
            </el-table-column>
            <el-table-column
              width="95"
              align="left"
              label="深度2"
              prop="depth2">
            </el-table-column>-->
            <el-table-column
              width="95"
              align="left"
              label="巷道名称"
              prop="roadwayname">
            </el-table-column>
            <el-table-column
              align="left"
              width="70"
              label="应力监测值"
              prop="stressData">
            </el-table-column>
            <el-table-column
              align="left"
              prop="collectTime"
              label="采集时间">
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
          mineId: "00000000003",
          monitorAreaName: "4307工作面",
          mmsysname: "KJ216",
          sensorid: "04214ZP2",
          sensortype: 2,
          monitortype: "Z",
          units: "MPa",
          sensorplase: "9支架",
          sensorX: null,
          sensorY: null,
          sensorZ: null,
          place1: null,
          place2: null,
          angle1: null,
          angle2: null,
          depth1: null,
          depth2: null,
          roadwayname: "4307工作面",
          collectTime: "2019-05-29 20:21:55",
          stressData: "28.4",
          time: null,
          insertTime: null
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
          _this.date = new Date().toLocaleString();
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
          const tHeader = ['序号','煤矿名称', '监测区名称', '传感器编号', '传感器类型','监测方向', '计量单位', '传感器位置','传感器位置x','传感器位置y','传感器位置z','方位1','方位2','倾角1','倾角2','深度1','深度2','巷道名称','应力监测值','采集时间'];
          const filterVal = ['number','mineName', 'monitorAreaName', 'sensorid', 'sensortype','monitortype', 'units', 'sensorplase', 'sensorX','sensorY','sensorZ','place1','place2','angle1','angle2','depth1','depth2','roadwayname','stressData','collectTime'];
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
        this.getRequest("/api/stress/getStress?page=" + this.currentPage + "&size=10&mineName="+this.mineName +"&type=1").then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            console.log(data);
            debugger;
            if(data.list.length==0){
              alert("未查询到相关数据！")
            }
            _this.date=data.list[0].collectTime;
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
