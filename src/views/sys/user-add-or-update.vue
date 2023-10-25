<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="userNo" label="用户号">
        <el-input v-model="dataForm.userNo" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="dataForm.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword" label="确认密码" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.confirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item prop="gender" label="性别">
        <chimera-radio-group v-model="dataForm.gender" dict-type="gender"></chimera-radio-group>
      </el-form-item>
      <el-form-item prop="deptName" label="所属部门">
        <chimera-dept-tree v-model="dataForm.deptId" placeholder="选择部门" v-model:deptName="dataForm.deptName"></chimera-dept-tree>
      </el-form-item>
      <el-form-item prop="roleIdList" label="角色配置" class="role-list">
        <el-select v-model="dataForm.roleIdList" multiple placeholder="角色配置">
          <el-option v-for="role in roleList" :key="role.id" :label="role.roleName" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">停用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { isEmail, isMobile } from "@/utils/utils";
import { IObject } from "@/types/interface";
import { ElMessage } from "element-plus";
const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const roleList = ref<any[]>([]);
const dataFormRef = ref();

const dataForm = reactive({
  id: "",
  userNo: "",
  name: "",
  deptId: "",
  deptName: "",
  password: "",
  confirmPassword: "",
  gender: 0,
  roleIdList: [] as IObject[],
  status: 1
});

const validatePassword = (rule: any, value: string, callback: (e?: Error) => any): any => {
  if (!dataForm.id && !/\S/.test(value)) {
    return callback(new Error("必填项不能为空"));
  }
  callback();
};
const validateConfirmPassword = (rule: any, value: string, callback: (e?: Error) => any): any => {
  if (!dataForm.id && !/\S/.test(value)) {
    return callback(new Error("必填项不能为空"));
  }
  if (dataForm.password !== value) {
    return callback(new Error("确认密码与密码输入不一致"));
  }
  callback();
};
// const validateEmail = (rule: any, value: string, callback: (e?: Error) => any): any => {
//   if (value && !isEmail(value)) {
//     return callback(new Error("邮箱格式错误"));
//   }
//   callback();
// };
// const validateMobile = (rule: any, value: string, callback: (e?: Error) => any): any => {
//   if (value && !isMobile(value)) {
//     return callback(new Error("手机格式错误"));
//   }
//   callback();
// };
const rules = ref({
  userNo: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  // deptName: [{ required: true, message: "必填项不能为空", trigger: "change" }],
  deptName: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: "blur" }],
  name: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
  // email: [{ validator: validateEmail, trigger: "blur" }],
  // mobile: [{ validator: validateMobile, trigger: "blur" }]
});

const init = (id?: number) => {
  visible.value = true;
  dataForm.id = "";
  dataForm.deptId = "";

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  Promise.all([getRoleList()]).then(() => {
    if (id) {
      getInfo(id);
    }
  });
};

// 获取角色列表
const getRoleList = () => {
  return baseService.get("/system/role/list").then((res) => {
    roleList.value = res.data;
  });
};

// 获取信息
const getInfo = (id: number) => {
  baseService.get(`/system/user/${id}`).then((res) => {
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    (!dataForm.id ? baseService.post : baseService.put)("/system/user", {
      ...dataForm,
      roleIdList: [...dataForm.roleIdList]
    }).then((res) => {
      ElMessage.success({
        message: "成功",
        duration: 500,
        onClose: () => {
          visible.value = false;
          emit("refreshDataList");
        }
      });
    });
  });
};

defineExpose({
  init
});
</script>

<style lang="less" scoped>
.mod-sys__user {
  .role-list {
    .el-select {
      width: 100%;
    }
  }
}
</style>
