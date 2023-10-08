<template>
  <el-container direction="vertical" class="wrapper">
    <el-header>
      <Header/>
    </el-header>
    <el-main>
      <navibar/>
      <router-view/>
    </el-main>
    <el-footer>
      <span style="color: #d4e8ef">非常好项目，爱来自计维</span>
    </el-footer>
  </el-container>


</template>

<script setup lang="ts">


</script>

<style scoped lang="less">
.el-main {
  display: flex;
  flex-direction: column;
}
</style>
