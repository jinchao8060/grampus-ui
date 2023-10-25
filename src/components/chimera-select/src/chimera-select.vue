<template>
  <el-select v-model="value" @change="$emit('update:modelValue', $event)" :placeholder="placeholder" clearable>
    <el-option :label="data.dictLabel" v-for="data in dataList" :key="data.dictValue" :value="data.dictValue">{{ data.dictLabel }}</el-option>
  </el-select>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { getDictDataList } from "@/utils/utils";
import { useAppStore } from "@/store";
export default defineComponent({
  name: "ChimeraSelect",
  props: {
    modelValue: [Number, String],
    dictType: String,
    placeholder: String
  },
  setup(props) {
    const store = useAppStore();
    const value = props.modelValue !== null ? computed(() => `${props.modelValue}`) : null;
    return {
      value,
      dataList: getDictDataList(store.state.dicts, props.dictType)
    };
  }
});
</script>
