<template>
<div>
  <!-- <kinesis-container> -->
    <!-- <kinesis-element :strength="8"> -->
      <card class="card-stats" :show-footer-line="true">
        <div class="row">
          <!-- <kinesis-element :strength="5"> -->
            <div class="col">
              <slot>
                <h6 class="card-title text-uppercase text-muted mb-0" v-if="title">{{title}}</h6>
                <span class="h5 font-weight-bold mb-0" v-if="subTitle">{{subTitle}}</span>
              </slot>
            </div>
          <!-- </kinesis-element> -->
          <!-- <kinesis-element :strength="5"> -->
            <div class="col-auto" v-if="$slots.icon || icon">
              <slot name="icon">
                <div class="icon-sm icon-shape text-white rounded-circle shadow"
                    :class="[`bg-${type}`, iconClasses]">
                  <i :class="icon"></i>
                </div>
              </slot>
            </div>
          <!-- </kinesis-element> -->
        </div>
        <!-- <kinesis-element :strength="5"> -->
          <p class="mt-3 mb-0 text-sm">
            <slot name="footer"></slot>
          </p>
        <!-- </kinesis-element> -->
      </card>
    <!-- </kinesis-element> -->
  <!-- </kinesis-container> -->
</div>
</template>
<script>
  import Card from './Card.vue';
  export default {
    name: 'stats-card',
    components: {
      Card
    },
    props: {
      type: {
        type: String,
        default: 'primary'
      },
      icon: String,
      title: String,
      subTitle: String,
      iconClasses: [String, Array]
    }
  };
</script>
<style>
.card-stats .card-body{
  padding:0.8rem;
}
</style>
