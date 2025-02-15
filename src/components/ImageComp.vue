<template>
  <div :id="interactId" :data-attachId="imgId" :data-img-w="width" :data-img-h="height" :data-x="x" :data-y="y" :style="[
    { transform: `translate(${x}px,${y}px)` },
    { width: `${width}px` },
    { height: `${height}px` },
  ]" class="draggable resize-drag image-dd" style="position: absolute; top: 0; left: 0">
    <img :src="displayImage" />
    <!-- <div class="align-items-center d-flex image-dd-remove justify-content-center" style="
        cursor: pointer;
        position: absolute;
        top: -10px;
        right: -10px;
        border: unset;
        border-radius: 50%;
      " @click="removeImg"> -->
      <button
        class="image-dd-remove rounded-full bg-red-600 cursor-pointer border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button" style="
        cursor: pointer;
        position: absolute;
        top: -10px;
        right: -10px;
        border: unset;
        border-radius: 50%;" @click="removeImg"
      > <IconX />
        <!-- <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-4 h-4"
          viewBox="0 0 16 16">
          <path
            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
        </svg> -->
      </button>
    <!-- </div> -->
  </div>
</template>

<script>
import { readAsDataURL } from "@/utils/async-reader";
import interact from "interactjs";
import IconX from '@/components/icons/IconX.vue'

export default {
  name: "img-component",
  props: {
    index: { type: Number },
    pageId: { type: Number },
    attachment: { type: Object },
  },
  components: {
    IconX
  },
  data() {
    return {
      displayImage: "",
      imgId: "",
      interactId: "", // "interact_"+this.imgId , //"interact"+this.pageId+ "_" +this.index,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  },
  methods: {
    setInteract() {
      interact(`[id='${this.interactId}']`)
        .resizable({
          // resize from all edges and corners
          edges: { left: true, right: true, bottom: true, top: true },

          listeners: {
            move: (event) => {
              var target = event.target;
              var x = parseFloat(target.getAttribute("data-x")) || 0;
              var y = parseFloat(target.getAttribute("data-y")) || 0;

              // update the element's style
              target.style.width = event.rect.width + "px";
              target.style.height = event.rect.height + "px";

              // translate when resizing from top or left edges
              x += event.deltaRect.left;
              y += event.deltaRect.top;

              target.style.transform = "translate(" + x + "px," + y + "px)";

              // target.setAttribute('data-x', x)
              // target.setAttribute('data-y', y)

              // target.setAttribute('data-img-w',event.rect.width)
              // target.setAttribute('data-img-h',event.rect.height)

              this.x = x;
              this.y = y;

              this.width = event.rect.width;
              this.height = event.rect.height;
              // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
            },
            // call this function on every dragend event
            end: this.updateImageAttachment,
            // end (event) {
            //    var target = event.target

            //    target.setAttribute('data-img-w',event.rect.width)
            //    target.setAttribute('data-img-h',event.rect.height)

            //   // var textEl = target.querySelector('p.resize')

            //   // textEl && (textEl.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height))

            //   this.updateImageAttachment()
            // }
          },
          modifiers: [
            // keep the edges inside the parent
            interact.modifiers.restrictEdges({
              outer: "parent",
            }),

            // minimum size
            interact.modifiers.restrictSize({
              // min: { width: 100, height: 50 }
              min: { width: 0, height: 0 },
            }),
          ],

          inertia: true,
        })
        .draggable({
          listeners: {
            // call this function on every dragmove event
            move: (event) => {
              // this.dragMoveListenerImg
              var target = event.target;

              // keep the dragged position in the data-x/data-y attributes
              var x =
                (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
              var y =
                (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

              // // translate the element
              target.style.transform = "translate(" + x + "px, " + y + "px)";

              // update the posiion attributes
              target.setAttribute("data-x", x);
              target.setAttribute("data-y", y);

              this.x = x;
              this.y = y;
            },
            // call this function on every dragend event

            end: this.updateImageAttachment,
            // end (event) {
            //   // var textEl = event.target.querySelector('p.distance')

            //   // console.log('pageX',event.pageX , event.x0);
            //   // console.log('pageY',event.pageY , event.y0);

            //   // textEl && (textEl.textContent =
            //   //   'moved a distance of ' +
            //   //   (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
            //   //             Math.pow(event.pageY - event.y0, 2) | 0))
            //   //     .toFixed(2) + 'px')

            // }
          },
          inertia: true,
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: "parent",
              endOnly: true,
            }),
          ],
        });
    },
    // dragMoveListenerImg (event) {
    //   var target = event.target

    //   // console.log("dragMoveListenerImg", event.dx, event.dy, event.pageX, event.pageY)

    //   // keep the dragged position in the data-x/data-y attributes
    //   var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    //   var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    //   // translate the element
    //   target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

    //   // update the posiion attributes
    //   target.setAttribute('data-x', x)
    //   target.setAttribute('data-y', y)
    // },
    updateImageAttachment() {
      //get position x,y
      this.attachment.x = this.x;
      this.attachment.y = this.y;

      //get img size
      this.attachment.width = this.width;
      this.attachment.height = this.height;

      //emit attachment
      this.$emit("update", this.attachment);
    },
    removeImg() {
      this.$emit("delete", this.attachment.id);
    },
    // setTransform(x,y){
    //   // translate the element
    //   target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

    //   // update the posiion attributes
    //   target.setAttribute('data-x', x)
    //   target.setAttribute('data-y', y)
    // },
    // setWidthHeight(width,height){

    //   //  target.setAttribute('data-img-w',width)
    //   //  target.setAttribute('data-img-h',height)
    // }
  },
  async mounted() {
    if (this.attachment) {
      const { id, x, y, width, height, file, img } = this.attachment;

      this.imgId = id;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;

      this.interactId = "i_" + id;
      this.displayImage = await readAsDataURL(file);

      this.setInteract();
    }
  },
};
</script>

<style lang="scss">
.image-dd {
  width: fit-content;
  transform: translate(0px, 0px);
  border: 1px solid #ddd;
}

.image-dd>img {
  /* object-fit: contain; */
  /* width: -webkit-fill-available; */
  /* height: -webkit-fill-available; */
  width: 100%;
  height: 100%;
}

.image-dd>img[src] {
  border: 1px dashed gray;
}
</style>
