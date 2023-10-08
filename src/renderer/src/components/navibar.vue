<template>

  <div class="toolbar">
    <!-- 页面顶部操作栏（包括返回上一级，返回主页两个按钮） -->
    <div class="button-group">
      <el-icon @click="handleJump(1)"><ArrowLeft /></el-icon>
      <el-divider direction="vertical" />
      <el-icon @click="handleJump(2)"><House /></el-icon>
    </div>
    <!-- 文件层级结构面包屑  -->
    <div class="file-level-breadCrumb">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(pathItem) in pathArr">
          {{pathItem}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

  </div>
</template>

<script setup lang="ts">

import { ArrowLeft, ArrowRight, House } from "@element-plus/icons-vue";
import { useEventStore } from "../store/event";
import { ref, watchEffect } from "vue";
import { ElMessage } from "element-plus";

const eventStore = useEventStore()

//路径存放数组
const pathArr = ref<string[]>(['/'])

watchEffect(() => {
  if(eventStore.eventDataFromDashboard) {
    console.log(eventStore.eventDataFromDashboard)
    handleBreadCrumbUpdate(eventStore.eventDataFromDashboard, 1)
    eventStore.resetData()
  }
})

//页面跳转
const handleJump = (path:number | string) => {
  //判断数组大小是否为1，为1无法进行后续操作，提示用户
  if (pathArr.value.length === 1) {
    console.log('已经是根目录了')
    ElMessage.error('已经是根目录了，操作失败')
    return
  }
  console.log('页面跳转到' + path)
  //数字表示是按钮操作，字符串表示是面包屑操作
  //如果是退回到上一级，那么就是删除最后一个元素
  //如果是跳转到主页，那么就是清空除第一个元素外的所有元素
  switch (path) {
    //退回到上一级
    case 1:
      handleBreadCrumbUpdate("", 2)
      //把pathArr里的所有元素进行拼接，得到新的路径
      let newPath = pathArr.value.join('/')
      //如果是根目录，那么就不用去掉第一个/
      //去掉第一个/
      if (newPath.length > 1) {
        newPath = newPath.substring(1)
      }
      path = newPath
      console.log(path)
      break
    //返回主页
    case 2:
      handleBreadCrumbUpdate("", 3)
      break
    case path:
      handleBreadCrumbUpdate(path, 4)
      break
  }
  console.log("发送的路径为" + path)
  eventStore.sendDataFromNavibar(path)
}

//面包屑操作
//1为打开，2为返回上一级，3为返回主页，4为跳转到指定目录
const handleBreadCrumbUpdate = (path: any, opCode:number) => {
  switch (opCode) {
    case 1:
      pathArr.value.push(path)
      break
    case 2:
      //判断数组长度，如果长度为1，那么就不用删除了，并提示用户
      pathArr.value.pop()
      break
    case 3:
      pathArr.value.splice(1, pathArr.value.length - 1)
      break
    case 4:
      break
  }

}


</script>

<style scoped lang="less">
.toolbar {
  background: #eaeaea;
  border: 1px solid #b2b0b0;
  border-radius: 5px 5px 0 0;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .file-level-breadCrumb {
    margin-left: 35px;
  }

}

.el-icon {
  font-size: 25px;
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
    background: #666;
  }
}
</style>
