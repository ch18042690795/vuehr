<template>
  <div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="margin-left: 10px;margin-right: 20px;display: inline">
          安全监测
        </div>

      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <el-table
            :data="safeSimulationsSafe"
            v-loading="tableLoading"
            border
            stripe
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 50%">
            
            <el-table-column
              prop="mine"
              width="180"
              align="left"
              label="煤矿名称">
            </el-table-column>
            
            <el-table-column
              prop="time"
              width="220"
              label="上传时间">
            </el-table-column>
            <el-table-column
              prop="status"
              width="110"
              label="状态">
              <template scope="scope">
                <span v-if="scope.row.status==='正常'" style="color: green">正常</span>
                <span v-else style="color: red">异常</span>
              </template>
            </el-table-column>

          </el-table>
          
        </div>
      </el-main>
    </el-container>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="margin-left: 10px;margin-right: 20px;display: inline">
          人员定位
        </div>

      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <el-table
            :data="safeSimulationsEmp"
            v-loading="tableLoading"
            border
            stripe
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 50%">
            
            <el-table-column
              prop="mine"
              width="180"
              align="left"
              label="煤矿名称">
            </el-table-column>
            
            <el-table-column
              prop="time"
              width="220"
              label="上传时间">
            </el-table-column>
            <el-table-column
              prop="status"
              width="110"
              label="状态">
              <template scope="scope">
                <span v-if="scope.row.status==='正常'" style="color: green">正常</span>
                <span v-else style="color: red">异常</span>
              </template>
            </el-table-column>

          </el-table>
          
        </div>
      </el-main>
    </el-container>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="margin-left: 10px;margin-right: 20px;display: inline">
          水文监测
        </div>

      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <el-table
            :data="safeSimulationsHyd"
            v-loading="tableLoading"
            border
            stripe
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 50%">
            
            <el-table-column
              prop="mine"
              width="180"
              align="left"
              label="煤矿名称">
            </el-table-column>
            
            <el-table-column
              prop="time"
              width="220"
              label="上传时间">
            </el-table-column>
            <el-table-column
              prop="status"
              width="110"
              label="状态">
              <template scope="scope">
                <span v-if="scope.row.status==='正常'" style="color: green">正常</span>
                <span v-else style="color: red">异常</span>
              </template>
            </el-table-column>

          </el-table>
          
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
        safeSimulationsEmp: [],
        safeSimulationsSafe: [],
        safeSimulationsHyd: [],
        system: "",
        fileUploadBtnText: '导入数据',
        multipleSelection: [],
        depTextColor: '#c0c4cc',
        safeSimulation: {
          mine:"许厂",
          time: "",
          status: ""

        },
        safeSimulationEmp: {
          mine:"许厂",
          time: "",
          status: ""

        },
        safeSimulationSafe: {
          mine:"许厂",
          time: "",
          status: ""

        },
        safeSimulationHyd: {
          mine:"许厂",
          time: "",
          status: ""

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

      
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      loadsafeSimulations(){
        var _this = this;
        this.tableLoading = true;

        this.getRequest("/api/fileupload/getFileuploadSystemData?system="+this.system).then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            console.log(data);
            var dataEmp = [];
            var dataSafe= [];
            var dataHyd= [];
            for (var i = 0; i < data.list.length; i++){
              var times = data.list[i].time;
              var systemTemp = data.list[i].system;
              var datee = new Date(times).toJSON();
              var dateee = new Date(datee).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')  
              data.list[i].time= dateee;
              
              if(data.list[i].system == "人员定位"){
                dataEmp.push(data.list[i]);
              } else if(data.list[i].system == "安全监控"){
                dataSafe.push(data.list[i]);
              } else if (data.list[i].system == "水文监测"){
                dataHyd.push(data.list[i]);
              } 
              
            }
            _this.safeSimulations = data.list;
            _this.safeSimulationsEmp = dataEmp;
            _this.safeSimulationsSafe = dataSafe;
            _this.safeSimulationsHyd = dataHyd;
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
