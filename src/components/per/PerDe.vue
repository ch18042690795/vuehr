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
              prop="name"
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
         <!--   <el-table-column
              prop="well"
              label="井口名"
              width="180">
            </el-table-column>-->
            <el-table-column
              width="180"
              align="left"
              prop="sfName"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="sfNum"
              width="180"
              align="left"
              label="卡号">
            </el-table-column>
            <el-table-column
              prop="sfId"
              width="180"
              label="工号">
            </el-table-column>
            <el-table-column
              width="180"
              prop="sfType"
              label="工种">
            </el-table-column>
            <el-table-column
              prop="sfPosition"
              width="180"
              label="职务">
            </el-table-column>
            <el-table-column
              prop="sfDepartment"
              label="部门">
            </el-table-column>
            <el-table-column
              prop="leaderLevel"
              width="180"
              align="left"
              label="领导类别">
            </el-table-column>
            <el-table-column
              prop="platform"
              width="100"
              label="分站号">
            </el-table-column>
            <el-table-column
              prop="platformName"
              width="220"
              align="left"
              label="分站名称">
            </el-table-column>
            <el-table-column
              prop="platformLacType"
              align="left"
              width="100"
              label="分站位置">
            </el-table-column>
            <el-table-column
              width="100"
              align="left"
              prop="platformArea"
              label="分站所属">
            </el-table-column>
            <el-table-column
              prop="inPlaTime"
              width="100"
              align="left"
              label="进入分站">
            </el-table-column>
            <el-table-column
              prop="outPlaTime"
              label="离开分站">
            </el-table-column>
            <el-table-column
              prop="inWellTime"
              width="85"
              align="left"
              label="入井时刻">
            </el-table-column>
            <el-table-column
              width="85"
              align="left"
              prop="outWellTime"
              label="出井时刻">
            </el-table-column>
            <el-table-column
              width="95"
              align="left"
              prop="sfStatus"
              label="人员状态">
            </el-table-column>
            <el-table-column
              width="95"
              align="left"
              prop="accDistance"
              label="精确定位">
            </el-table-column>
            <el-table-column
              align="left"
              width="70"
              prop="platformType"
              label="分站类型">
            </el-table-column>
            <el-table-column
              align="left"
              prop="platformStatus"
              label="当前分站停留时间">
            </el-table-column>
            <el-table-column
              align="left"
              prop="wellTime"
              label="井下停留">
            </el-table-column>
            <el-table-column
              align="left"
              prop="abnBeginTime"
              label="异常开始">
            </el-table-column>
            <el-table-column
              align="left"
              prop="time"
              label="时间">
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
          grpName: "山东能源",
          childGrpName: "淄矿集团",
          mineName: "唐口煤业",
          well: "null",
          sfName: "张学港",
          sfNum: "295B",
          sfId: "2161",
          sfType: "探放水作业",
          sfPosition: "null",
          sfDepartment: "防冲中心",
          leaderLevel: "区队领导",
          platform: "9",
          platformName: "火药库出口",
          platformDes: "火药库出口",
          platformLacType: 6,
          platformArea: "炸药库区域",
          inPlaTime: "2019-05-31 13:57:15",
          outPlaTime: "2019-05-31 13:57:15",
          inWellTime: "2019-05-31 06:21:06",
          outWellTime: "null",
          sfStatus: 1,
          rtimeType: 1,
          leaderPlatform: "null",
          helpType: 0,
          helpBeginTime: "2019-05-31 14:01:41",
          idCarType: 0,
          accDistance: 0,
          platformType: 2,
          platformStatus: 0,
          wellTime: 7,
          abnBeginTime: "2019-05-31 14:01:41",
          time: "2019-05-31 14:01:41"

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
          const tHeader = ['序号','煤矿名称', '井口名', '姓名', '卡号','工号', '工种', '职务','部门','领导类别','分站号','分站名称','分站位置','分站所属','进入分站','离开分站','入井时刻','出井时刻','人员状态','精确定位','分站类型','当前分站','井下停留',"异常开始","时间"];
          const filterVal = ['number','mineName', 'well', 'sfName', 'sfNum','sfId', 'sfType', 'nativePlace','sfDepartment','leaderLevel','platform','platformName','platformLacType','platformArea','inPlaTime','outPlaTime','inWellTime','outWellTime','sfStatus','accDistance','platformType','platformStatus','wellTime','abnBeginTime','time'];
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
        this.getRequest("/api/person/getWell?page=" + this.currentPage + "&size=10&mineName="+this.mineName ).then(resp=> {
          this.tableLoading = false;

          if (resp && resp.status == 200) {
            var data = resp.data;
            console.log(data);
            debugger;
            if(data.list.length==0){
              alert("未查询到相关数据！")
            }
            _this.date=formatDate(new Date(data.list[0].time),"yyyy-MM-dd hh:mm:ss");
            _this.safeSimulations = data.list;
            _this.totalCount = 1;
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
