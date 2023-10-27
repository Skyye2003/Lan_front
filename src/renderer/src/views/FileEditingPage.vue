<!-- 页面编辑页面 -->
<template>
  <div class="edit-container">
    <div class="edit-area">
      <div class="text">文件内容：</div>
      <el-input
        type="textarea"
        disabled
        v-model="fileContent"
        :rows="7">

      </el-input>
    </div>

    <div class="edit-area">
      <div class="text">追加内容：</div>
      <el-input
        type="textarea"
        :rows="7"
        v-model="appendContent"
        :disabled="readOnly">

      </el-input>
    </div>

    <div class="footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :disabled="readOnly" @click="submitForm()">提 交</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useRoute, useRouter } from "vue-router";
import { appendFile, openFile } from "../api/api";
import { ref } from "vue";
import { ElMessage } from "element-plus";
//文件已有内容
const fileContent = ref('')
//追加文件内容
const appendContent = ref('')
//文件若为只读，则不可编辑
const readOnly = ref(false)
//路由
const router = useRouter()
const route = useRoute()

//关闭编辑页面返回主页面
const handleClose = () => {
  router.push('/dashboard')
}

//获取文件内容
const _getData = async () => {
  console.log(route.query?.name)
  console.log(route.query?.startId)
  const { data } = await openFile({path: route.query?.name, type: 0})
  console.log(data)
  fileContent.value = data.data.content
  //文件若不可读，则不可编辑
  if (data.data.fileInfo.attribute % 2 == 1) {
    readOnly.value = true
  } else {
    readOnly.value = false
  }
}

//提交表单
const submitForm = () => {
  console.log( "准备提交的内容：" + appendContent.value)
  appendFile({
    fileStartId: route.query?.startId,
    data: appendContent.value
  }).then(res => {
    console.log(res)
    if (res.data.code == 200) {
      ElMessage.success('追加文件内容成功！')
      router.push('/dashboard')
    } else {
      ElMessage.error('追加文件内容失败！原因为' + res.data.data.message)
    }
  })
}

_getData()
</script>

<style scoped lang="less">
.edit-container {
  display: flex;
  flex-direction: column;
  height: 100%;

  .edit-area {
    margin-bottom: 20px;
    .text {
      font-size: 20px;
      color: #d4e8ef;
      margin-bottom: 10px;
    }
  }

  .footer {
    text-align: right;
  }
}
</style>
