import { defineStore } from 'pinia'

// const state = {
//   // pageCurrentIndex: 0,
//   allPageAttachments: [], // attachmentPdf
// };

// const attachmentPdf = {
//   pageCurrentIndex: 0,
//   attachments: [], // attachmentList
// };

// const attachmentList = {
//   id: 0,
//   type: "",
//   width: 0,
//   height: 0,
//   x: 0,
//   y: 0,
//   img: null,
//   file: null,
// };

export const useImageStore = defineStore('image', {
  state: () => {
    return {
      pageCurrentIndex: 0,
      allPageAttachments: []
    }
  },
  // mutations, :: VUE3 > actions
  getters: {
    listImageCurrent: (state) => {
      const result =
        state.allPageAttachments.filter((f) => {
          return f.pageCurrentIndex == state.pageCurrentIndex;
        }) || [];

      if (result.length != 0) {
        const _image = result[0].attachments || [];
        return _image;
      }

      return [];
    }
  },
  actions: {
    clearPageCurrentIndex() {
      this.pageCurrentIndex = 0;
    },
    pageCurrentIndexIncrement() {
      this.pageCurrentIndex++;
    }, pageCurrentIndexDecrement() {
      this.pageCurrentIndex--;
    },
    ADD_ATTACHMENT(data) {
      const isFind =
        this.allPageAttachments.filter((f) => {
          return f.pageCurrentIndex == this.pageCurrentIndex;
        }).length != 0;

      if (isFind) {
        //push
        this.allPageAttachments.map((m) => {
          if (m.pageCurrentIndex == this.pageCurrentIndex) {
            return m.attachments.push({ ...data.attachment });
          }
        });
      } else {
        //add new
        this.allPageAttachments.push({
          pageCurrentIndex: this.pageCurrentIndex,
          attachments: [{ ...data.attachment }],
        });
      }
    },
    UPDATE_ATTACHMENT(data) {
      const attachment = { ...data.attachment };

      this.allPageAttachments = this.allPageAttachments.map((m) => {
        if (m.pageCurrentIndex == this.pageCurrentIndex) {
          m.attachments = m.attachments.map((m2) => {
            if (m2.id == attachment.id) {
              return { ...attachment };
            } else {
              return { ...m2 };
            }
          });
        }

        return { ...m };
      });
    },
    DELETE_ATTACHMENT(data) {
      const { id } = { ...data };
      this.allPageAttachments.map((m) => {
        if (m.pageCurrentIndex == this.pageCurrentIndex) {
          const inxDelete = m.attachments.findIndex((object) => {
            return object.id == id;
          });

          if (inxDelete >= 0) {
            m.attachments.splice(inxDelete, 1);
          }
        }
        return m;
      });
    },
    CLEAR_ATTACHMENT() {
      this.clearPageCurrentIndex(); // pageCurrentIndex = 0
      this.allPageAttachments = [];
    },
  }
})