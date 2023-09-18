<!-- 文件页面 -->
<template>
  <div class="container">
    <el-card v-for="(item, index) in ItemList" @click="handleSelectOnce(item, index)">
      <div class="card-content">
        <i v-if="item.attribute == 'file'" class="iconfont icon-file-fill"></i>
        <i v-else class="iconfont icon-File"></i>
        <span>{{item.name}}</span>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const ItemList = ref([
  {
    name: 'abc.yx',
    attribute: 'file',
  },
  {
    name: 'ausss',
    attribute: 'dir'
  },
  {
    name: 'ausss',
    attribute: 'dir'
  },
  {
    name: 'abc.yx',
    attribute: 'file'
  },
  {
    name: 'abc.yx',
    attribute: 'file'
  },
  {
    name: 'abc.yx',
    attribute: 'file'
  },
  {
    name: 'abc.yx',
    attribute: 'file'
  },
])

//处理单选
const handleSelectOnce = (item, index) => {
  //获取到选中dom对象
  const selectDOM = document.querySelectorAll('.card-content')
  //将选中的dom对象的背景颜色改变
  for (let i = 0; i <= selectDOM.length - 1; i++) {
    if (i === index) {
      //将选中的dom对象的背景颜色改变
      selectDOM[i].style.backgroundColor = '#E4DCDC'
    }
  }

}
</script>

<style scoped lang="less">
.card {
  height: 90px;
  width: 90px;
  margin: 15px;
  background-color: rgba(228, 220, 220, 0.98);
  overflow: auto;
  list-style: none;
}

.el-card {
  border: none;
  box-shadow: none;

}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF00;
}
</style>
