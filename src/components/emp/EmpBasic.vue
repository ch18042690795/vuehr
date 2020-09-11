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
          最新更新时间：{{ date}}
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
            @selection-change=""
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
              prop="site"
              label="分站名称"
              width="180">
            </el-table-column>
            <el-table-column
              width="180"
              align="left"
              prop="sensor"
              label="传感器名称">
            </el-table-column>
         <!--   <el-table-column
              prop="type"
              width="180"
              align="left"
              label="传感器类型">
            </el-table-column>-->
            <el-table-column
              prop="value"
              width="180"
              label="值">
            </el-table-column>
            <el-table-column
              width="180"
              prop="status"
              label="状态">
            </el-table-column>
            <el-table-column
              prop="time"
              width="180"
              label="时间">
            </el-table-column>
          </el-table>
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
          mineName: "唐口",
          platform: 16,
          sensor: 11,
          type: 4,
          comment: "9302轨顺输送机滚筒下风侧",
          value: 0,
          status: 1,
          time: "",
          site: "7301胶带顺槽"

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
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadsafeSimulations();
      },
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
          const tHeader = ['序号','矿名', '分站号', '传感器名称', '传感器类型','描述', '值', '状态','分站名称'];
          const filterVal = ['number','mineName', 'platform', 'sensor', 'type','comment', 'value', 'status', 'site'];
          const list = this.safeSimulations;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '列表excel');
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      loadsafeSimulations(){
        var _this = this;
        this.tableLoading = true;
        this.getRequest("/api/safeMonitor/getSimu?page=" + this.currentPage + "&size=10&mineName="+this.mineName ).then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            if(data.list.length==0){
              alert("未查询到相关数据！")
            }
            _this.date= data.list[0].time;
            console.log(data);
            debugger;
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
