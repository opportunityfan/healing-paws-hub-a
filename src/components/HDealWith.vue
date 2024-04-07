<!--<script lang="js">-->
<!--import axios from "axios";-->
<!--import {string} from "three/examples/jsm/nodes/shadernode/ShaderNode";-->

<!--export default {-->
<!--  props: {-->
<!--    to: {-->
<!--      type: string,-->
<!--      defaultValue: ''-->
<!--    }-->
<!--  },-->
<!--  data(){-->
<!--    return{-->
<!--      textdata:{},-->
<!--    }-->
<!--  },-->
<!--  methods:{-->
<!--    async getdata() {-->
<!--      const res = await axios.get('http://150.158.110.63:8080/case'),{-->
<!--        params:{-->
<!--          id : to,-->
<!--        }-->
<!--      }-->
<!--      this.textdata=res.data.data;-->
<!--    }-->
<!--  },-->
<!--  mounted:{-->
<!--    getdata();-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <div>-->
<!--    {{textdata.name}}-->
<!--  </div>-->
<!--</template>-->

<!--<style scoped lang="stylus">-->

<!--</style>-->