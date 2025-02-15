<script setup>
import { ref, computed, useTemplateRef, inject, reactive } from 'vue';

import { useImageStore } from '@/store/image-temp';
import ImageComp from '@/components/ImageComp.vue';

import DownloadIcon from '@/components/icons/IconDownload.vue'
import ImageIcon from '@/components/icons/IconImage.vue'
import PDFIcon from '@/components/icons/IconPDFFile.vue'

const _$utils = inject("$utils");
const $store = useImageStore();

const filePdfName = ref("");
const fileUploadPdfTemp = ref(null);

// let displayImage = reactive(null);


//for useTemplateRef
const refFileUploadPdf = useTemplateRef('fileUpload-pdf')
const refPdfPreview = useTemplateRef('the-canvas-pdf')
const refImageUpload = useTemplateRef('imageUpload')


//for pdf file
let _$pdf = reactive(null);
// let imgAttachments = reactive([]);
const pdfPageCount = ref(0);
const scale = ref(1);

const currentPage = computed(() => {
    return $store.pageCurrentIndex + 1;
})

const chooseFilesPdf = () => {
    refFileUploadPdf.value.click();
}

const uploadImage = () => {
    refImageUpload.value.click();
}

const resetUploadAll = () => {
    clearPdf();
    clearImageAttachment();
}

const getImage = async (imgVal) => {

    const file = imgVal.target.files[0];

    if (file) {
        const result = await _$utils.uploader.handlers.image(file, {
            w: 200,
            h: 100,
        });

        $store.ADD_ATTACHMENT({
            pageCurrentIndex: $store.pageCurrentIndex,
            attachment: { ...result },
        });

        // //re-render img
        // imgAttachments = [...$store.listImageCurrent]

        // let reader = new FileReader();
        // reader.onload = (e) => {
        //     displayImage = e.target.result;
        // };
        // reader.readAsDataURL(file);
    }
};

// const disableDrawImage = computed(() => {
//     return !displayImage;
// });

const getFilesPdf = async (val) => {

    const file = val.target.files[0];

    if (file) {
        resetUploadAll();

        filePdfName.value = file.name;
        fileUploadPdfTemp.value = file;

        const localPdf = await _$utils.uploader.handlers.pdf(file);

        _$pdf = localPdf;

        pdfPageCount.value = localPdf.numPages;

        // page
        const page = await localPdf.getPage(currentPage.value);

        // canvas
        const viewport = page.getViewport({ scale: scale.value });
        // Support HiDPI-screens.
        const outputScale = window.devicePixelRatio || 1;

        const canvas = refPdfPreview.value;
        if (canvas == null) return;
        const context = canvas.getContext("2d");

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        // canvas.style.width = "100%"; // `${Math.floor(viewport.width)}px`;
        // canvas.style.height = "100%"; // `${Math.floor(viewport.height)}px`;

        const transform =
            outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        // page
        const renderContext = {
            canvasContext: context,
            transform,
            viewport,
        };

        await page.render(renderContext);
    }
}

const clearPdf = () => {
    filePdfName.value = null;
    pdfPageCount.value = 0;
    fileUploadPdfTemp.value = null;

    _$pdf = null;

    //clear canvas
    const canvas = refPdfPreview.value;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    $store.clearPageCurrentIndex();
}

const disabledPrevButton = computed(() => {
    return currentPage.value == 1
})

const disabledNextButton = computed(() => {
    return !isPDFUploaded.value || (currentPage.value == pdfPageCount.value)
})

const isPDFUploaded = computed(() => pdfPageCount.value > 0)

const getPdf2Prev = async () => {
    // if (disabledPrevButton) return;

    $store.pageCurrentIndexDecrement();

    const page = await _$pdf.getPage(currentPage.value);
    await renderPdf(page);

    // //re-render img
    // imgAttachments = [...$store.listImageCurrent]
}

const getPdf2Next = async () => {

    // if (disabledNextButton) return;

    $store.pageCurrentIndexIncrement();

    const page = await _$pdf.getPage(currentPage.value);

    await renderPdf(page);

    // //re-render img
    // imgAttachments = [...$store.listImageCurrent]
}
const renderPdf = async (_page) => {
    const viewport = _page.getViewport({ scale: scale.value });
    // Support HiDPI-screens.
    const outputScale = window.devicePixelRatio || 1;

    const canvas = refPdfPreview.value;
    if (canvas == null) return;
    const context = canvas.getContext("2d");

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    const transform =
        outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

    const renderContext = {
        canvasContext: context,
        transform,
        viewport,
    };

    await _page.render(renderContext);
}

const updateImageAttachment = (data) => {
    //update store
    $store.UPDATE_ATTACHMENT({
        pageCurrentIndex: $store.pageCurrentIndex,
        attachment: { ...data },
    });
}
const deleteImageAttachment = (imgUUID) => {

    $store.DELETE_ATTACHMENT({
        pageCurrentIndex: $store.pageCurrentIndex,
        id: imgUUID,
    })

    // //re-render img
    // imgAttachments = [...$store.listImageCurrent]
}
const clearImageAttachment = () => {

    //clear image attachment
    $store.CLEAR_ATTACHMENT();

    // //re-render img
    // imgAttachments = [] //  [...$store.listImageCurrent];
}

const downloadClick = async () => {
    const d = new Date();
    const _dt = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}_${d.getHours()}${d.getMinutes()}${d.getSeconds()}`

    const pdfComplete = await _$utils.pdf.save(
        fileUploadPdfTemp.value,
        $store.allPageAttachments ? $store.allPageAttachments : [],
        `savePdf-${_dt}.pdf`
    );
    console.log("genaratePdf", pdfComplete);
    return;
}

</script>

<template>
    <div id="HomeView" class="p-2">

        <div class="lg:grid lg:grid-cols-3 lg:gap-4">

            <div class="border border-gray-400 rounded-md my-4 grid grid-cols-3 gap-4 lg:grid-cols-1 p-2.5 h-fit">

                <div>
                    <label class="block text-gray-700 font-bold mb-2">PDF file
                    </label>
                    <div>
                        <button type="button"
                            class="items-center inline-flex cursor-pointer bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline rounded-md disabled:opacity-50 disabled:pointer-events-none"
                            @click="chooseFilesPdf()">
                            <PDFIcon /><span class="pl-1.5"></span>Upload PDF
                        </button>
                        <input ref="fileUpload-pdf" type="file" accept="application/pdf"
                            @change="(val) => getFilesPdf(val)" hidden />
                    </div>
                </div>

                <div>
                    <label class="block text-gray-700 font-bold mb-2">Add Image/Logo
                    </label>
                    <button type="button"
                        class="items-center inline-flex cursor-pointer bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline rounded-md disabled:opacity-50 disabled:pointer-events-none"
                        @click="uploadImage" :disabled="!isPDFUploaded">
                        <image-icon></image-icon>
                        <span class="pl-1.5">Add</span>
                    </button>

                    <input ref="imageUpload" type="file" accept="image/*" @change="(val) => getImage(val)" hidden />
                </div>

                <div>
                    <!-- RESET -->
                    <label class="block text-gray-700 font-bold mb-2">Reset
                    </label>
                    <button type="button"
                        class="cursor-pointer bg-white border border-red-500 hover:bg-red-500 hover:text-white text-red-500 font-bold py-2 px-4 focus:outline-none focus:shadow-outline rounded-md disabled:opacity-50 disabled:pointer-events-none"
                        @click="resetUploadAll">
                        Reset All
                    </button>
                </div>

                <!-- <div class="col-span-2">
                    <label class="block text-gray-700 font-bold mb-2">รูปภาพ<span class="mark-required"></span>
                    </label>
                    <div>
                        <img id="displayImage" :src="displayImage" style="object-fit: contain" alt="" width="220"
                            height="100" srcset="" :class="{ 'd-none': disableDrawImage }" />
                    </div>
                </div> -->
            </div>

            <div class="lg:col-span-2">

                <div class="flex my-3">
                    <div class="flex-1 text-center">
                        <input type="text"
                            class="bg-white border border-sky-200  focus:!border-sky-200 px-3 rounded-md text-black text-xl"
                            id="filepdfN" v-model="filePdfName" />
                    </div>
                    <div class="">
                        <button
                            class="items-center inline-flex cursor-pointer rounded-md px-2.5 py-1.5 shadow-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none"
                            v-on:click="downloadClick()" :disabled="!isPDFUploaded">
                            <download-icon></download-icon>
                            <span class="pl-2.5">Download</span></button>
                    </div>
                </div>
                <div class="my-2 text-center">
                    <div class="inline-flex align-middle">
                        <button type="button"
                            class="rounded-full px-2 bg-gray-400 text-black cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                            @click="getPdf2Prev" :disabled="disabledPrevButton">
                            < </button>

                                <div class="mx-2 text-xl">
                                    {{ pdfPageCount == 0 ? 0 : currentPage }} / {{ pdfPageCount }}
                                </div>

                                <button type="button"
                                    class="rounded-full px-2 bg-gray-400 text-black cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                                    @click="getPdf2Next" :disabled="disabledNextButton"> > </button>
                    </div>
                </div>

                <div class="p-2.5 mt-4">
                    <div style="position: relative; display: table; margin: auto">

                        <canvas ref="the-canvas-pdf" id="the-canvas-pdf"
                            class="border border-gray-400 canvas-dd canvas-dropzone"
                            style="width: 612px; height: 792px;"></canvas>

                        <template v-for="(data, index) in $store.listImageCurrent"
                            :key="`${$store.pageCurrentIndex}-${data.id}`">
                            <image-comp :dataId="data.id" :index="index" :pageId="$store.pageCurrentIndex"
                                :attachment="data" @update="updateImageAttachment"
                                @delete="deleteImageAttachment"></image-comp>
                        </template>


                        <span class="text-gray-500 text-5xl opacity-60"
                            style="position: absolute;margin: auto;top: 50%;left: 50%;transform: translate(-50%, -50%)">PDF
                            Preview</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>