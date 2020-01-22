<template>
    <div class="vue-app">
        <h1>{{title}}</h1>
        <ol v-for="item in list" :key="item.value">
            <li>{{item.value}}</li>
        </ol>
    </div>
</template>

<script>
export default {
    data(){
        return {
            title: 'Vue App',
            list: [
                {value:'list item 1'},
                {value:'list item 2'},
                {value:'list item 3'},
                {value:'list item 4'},
                {value:'list item 5'},
                {value:'list item 6'},
            ]
        }
    }
}
</script>

<style lang="scss" scoped>

    .vue-app {
        border: 1px solid #000;
        padding: 20px;
    }

    h1 {
        color: blue;
    }
    
</style>