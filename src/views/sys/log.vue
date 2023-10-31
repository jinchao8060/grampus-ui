<template>
  <div class="mod-sys__log-operation">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-select v-model="state.dataForm.successful" placeholder="状态" clearable>
          <el-option label="失败" :value="false"></el-option>
          <el-option label="成功" :value="true"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @sort-change="state.dataListSortChangeHandle" style="width: 100%">
      <el-table-column prop="subject" label="用户名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="description" label="用户操作" header-align="center" align="center"></el-table-column>
      <el-table-column prop="requestUri" label="请求URI" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="requestMethod" label="请求方式" header-align="center" align="center"></el-table-column>
      <el-table-column prop="requestParam" label="URL参数" header-align="center" align="center" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="requestBody" label="请求Body" header-align="center" align="center" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="costTime" label="请求时长" sortable="custom" header-align="center" align="center">
        <template v-slot="scope">
          {{ `${scope.row.costTime}ms` }}
        </template>
      </el-table-column>
      <el-table-column prop="successful" label="状态" sortable="custom" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.successful === false" size="small" type="danger">失败</el-tag>
          <el-tag v-else size="small" type="success">成功</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="requestIp" label="操作IP" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="userAgent" label="用户代理" header-align="center" align="center" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="classMethod" label="错误信息" header-align="center" align="center" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="requestStartTime" label="开始时间" sortable="custom" header-align="center" align="center" width="180">
        <template v-slot="scope">
          {{ formatTimestamp(scope.row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="requestEndTime" label="结束时间" sortable="custom" header-align="center" align="center" width="180">
        <template v-slot="scope">
          {{ formatTimestamp(scope.row.createDate) }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="state.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="state.pageSize" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { reactive, toRefs } from "vue";
import { formatTimestamp } from "../../utils/utils";

const view = reactive({
  getDataListURL: "/system/log/operation/page",
  getDataListIsPage: true,
  exportURL: "/system/log/operation/export",
  dataForm: {
    successful: ""
  }
});

const state = reactive({ ...useView(view), ...toRefs(view) });
</script>
