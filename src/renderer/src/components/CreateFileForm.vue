<!-- 新建文件或者文件夹表单 -->
<template>
  <el-dialog title="新建" v-model="props.visible" @close="handleClose">
    <el-form :model="FormItem" :rules="rules" ref="ruleFormRef" label-width="100">
      <el-form-item label="类型" prop="createType">
        <el-select v-model="createType" placeholder="请选择类型" @change="handleChange">
          <el-option label="文件" value="file"></el-option>
          <el-option label="文件夹" value="folder"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="fileName">
        <el-input v-model="FormItem.fileName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <div v-show="createType == 'file'">
        <el-form-item label="后缀" prop="type">
          <el-input v-model="FormItem.type" placeholder="请输入文件后缀名"></el-input>
        </el-form-item>
        <el-form-item label="属性" prop="attribute">
          <el-radio-group v-model="FormItem.attribute">
            <el-radio :label="4" size="large">普通文件</el-radio>
            <el-radio :label="2" size="large">系统文件</el-radio>
          </el-radio-group>

        </el-form-item>
        <el-form-item label="是否只读" prop="readonly">
          <el-switch
            v-model="FormItem.readonly"
            style="margin-left: 24px"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
          />
        </el-form-item>
      </div>


    </el-form>
    <template #footer>
        <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
//文件
import { reactive, ref } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { Check, Close } from '@element-plus/icons-vue'
import { createDir, createFile } from "../api/api";

interface fileItem {
  fileName: string,
  type: string,
  attribute: number,
  readonly: boolean
}

interface propsType {
  visible: boolean,
  curStartId: number
}

//向父组件发送事件
interface EmitType {
  (e: "close",params: boolean): void
}

const emit = defineEmits<EmitType>()

const props = withDefaults(defineProps<propsType>(), {
  visible: () => {
    return false
  },
  curStartId: () => {
    return 3
  }

})

const FormItem = ref<fileItem>({
  fileName: "",
  type: "",
  attribute: 4,
  readonly: false
})
//
const ruleFormRef = ref<FormInstance>()

//表单验证规则
const rules = reactive<FormRules>({
  fileName: [
    { required: true, message: "请输入名称", trigger: "blur" },
  ],
  type: [
    { required: true, message: "请输入后缀", trigger: "blur" },
  ],
  attribute: [
    { required: true, message: "请选择属性", trigger: "blur" },
  ],
  readonly: [
    { required: true, message: "请选择是否只读", trigger: "blur" },
  ]
})


//创建的是文件还是文件夹
const createType = ref('file')

//当选择的是文件夹是自动填充后缀名
const handleChange = (value: string) => {
  if (value == 'folder') {
    FormItem.value.type = ' '
    FormItem.value.attribute = 8
  } else {
    FormItem.value.type = ''
    FormItem.value.attribute = 4
  }
}

//提交表单
const submitForm = async (data: FormInstance | undefined) => {
  if (!data) return
  await data.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      console.log(FormItem.value)
      console.log("当前所在盘块号：" + props.curStartId)
      if (createType.value == 'file') {
        //创建文件
        createFile({
          fileName: FormItem.value.fileName,
          type: FormItem.value.type,
          attribute: FormItem.value.attribute + (FormItem.value.readonly ? 1 : 0),
          curStartId: props.curStartId
        }).then(res => {
          console.log(res)
          if (res.data.code == 200) {
            ElMessage.success('创建成功')
            emit("close", false)
          } else {
            ElMessage.error(res.data.message)
          }
        })
      } else {

        //创建文件夹
        createDir({
          dirName: FormItem.value.fileName,
          startId: props.curStartId
        }).then(res => {
          console.log(res)
          if (res.data.code == 200) {
            ElMessage.success('创建成功')
            emit("close", false)
          } else {
            ElMessage.error(res.data.message)
          }
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}


const handleClose = () => {
  emit("close", false)
}
</script>

<style scoped lang="less">
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
