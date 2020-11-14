<template>
  <div class="video-upload">
    <!-- <a-button @click="changeCover">Change cover</a-button>
    <input type="file" />-->
    <a-alert type="warning" message="请不要上传太大的视频，腾讯云点播存储还是要费用滴。最好10-30MB左右，谢谢。" style="margin-bottom:20px;"></a-alert>
    <a-upload-dragger
      v-show="isSelectedFile===false"
      :multiple="false"
      accept="video/mp4"
      :customRequest="uploadVideo"
    >
      <div class="upload-inner">
        <p class="ant-upload-drag-icon">
          <c-icon value="icon-shangchuanshipin" size="50px" />
        </p>
        <p class="ant-upload-title">点击上传或将文件拖入此区域</p>
        <p class="ant-upload-hint">鼓励发布优质原创视频</p>
        <ul class="upload-recommend">
          <li class="upload-recommend-item">
            <c-icon value="icon-shipin" size="34px"></c-icon>
            <div class="upload-recommend-details">
              <p>推荐尺寸</p>16:9、18:9、21:9的横板视频
            </div>
          </li>
          <li class="upload-recommend-item">
            <c-icon value="icon-shouye-chaofenbianshuai" size="31px"></c-icon>
            <div class="upload-recommend-details">
              <p>推荐分辨率</p>≥1080P（支持2k、4k及以上）
            </div>
          </li>
          <li class="upload-recommend-item">
            <c-icon value="icon-shipinwenjian" size="35px"></c-icon>
            <div class="upload-recommend-details">
              <p>视频大小</p>≤2G
            </div>
          </li>
        </ul>
      </div>
    </a-upload-dragger>
    <div class="publist" v-show="isSelectedFile">
      <div class="upload-details">
        <div class="upload-detail-header">
          <h2 class="upload-file-name">{{ uploadFileName }}</h2>
          <a-upload class="upliad-file-change" v-show="uploadStatus==='success'">
            <a-button type="link">更换视频</a-button>
          </a-upload>
        </div>
        <div class="upload-detail-body">
          <span class="upload-file-size">上传详情：{{ uploadedSize }}MB/{{ uploadTotalSize }}MB</span>
          <div
            class="upload-file-status upload-file-status-success"
            v-show="uploadStatus==='success'"
          >
            <c-icon value="icon-roundcheckfill"></c-icon>上传完成
          </div>
          <div
            class="upload-file-status upload-file-status-active"
            v-show="uploadStatus==='active'"
          >
            <c-icon value="icon-timefill"></c-icon>上传中
          </div>
          <div
            class="upload-file-status upload-file-status-error"
            v-show="uploadStatus==='exception'"
          >
            <c-icon value="icon-timefill"></c-icon>上传失败
          </div>
        </div>
        <a-progress class="upload-progress" :percent="uploadProgress" :status="uploadStatus" />
        <div class="upload-error-message">{{ uploadErrorMessage }}</div>
      </div>
      <a-form class="publish-form" labelAlign="left" :labelCol="{span:3}">
        <!-- <a-form-item label="标题" required>
          <a-input placeholder="please enter title" size="large" v-model="thread.title"></a-input>
        </a-form-item> -->
        <!-- <a-form-item label="Cover" required>
          <a-upload accept="image/*">
            <div class="upload-cover" v-show="false">
              <c-icon value="icon-pic"></c-icon>upload cover
            </div>
            <div class="upload-cover">
              <img
                src="http://baidu-rmb-videopic-1.bj.bcebos.com/hk/2011/1604981643123a87004d467871a9d5691c9debf5ae.jpg"
              />
              <div class="upload-cover-change">Change</div>
            </div>
          </a-upload>
          <div class="upload-cover-tips">建议比例16:9，画面清晰，不小于660x370像素，最大5M</div>
        </a-form-item> -->
        <a-form-item label="简介" required>
          <a-input
            type="textarea"
            placeholder="输入简介，收录率更高哦"
            size="large"
            :autoSize="{minRows:5,minRows:5}"
            v-model="thread.content"
          ></a-input>
        </a-form-item>
        <a-form-item class="publish-form-operate">
          <a-button size="large" type="primary" @click="save" :loading="submitLoading">发布</a-button>
          <a-button size="large">取消</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { Upload, Progress, Form, Input,Alert } from "ant-design-vue";
import CDiscuzQ from "../../function/CDiscuzQ";
export default {
  data() {
    return {
      thread: {
        title: "",
        content: "",
        type: 2,
        file_id: 0,
      },
      isSelectedFile: false,
      uploadProgress: 0,
      uploadTotalSize: 0,
      uploadedSize: 0,
      uploadStatus: "normal",
      uploadFileName: "",
      uploadSignature: "",
      threadVideo: null,
      uploadErrorMessage: "",
      submitLoading: false,
    };
  },
  methods: {
    uploadVideo({ file }) {
      let tcVod = new TcVod.default({
        getSignature: this.getUploadSignature,
      });
      this.uploadFileName = file.name;
      this.uploadStatus = "active";
      this.uploadTotalSize = (file.size / 1024 / 1024).toFixed(1);
      const uploader = tcVod.upload({
        mediaFile: file,
      });
      this.isSelectedFile = true;
      uploader.on("media_progress", (info) => {
        this.uploadProgress = Number((100 * info.percent).toFixed(0));
        this.uploadedSize = Number((info.loaded / 1024 / 1024).toFixed(1));
      });
      uploader
        .done()
        .then((doneResult) => {
          this.uploadStatus = "success";
          this.thread.file_id = doneResult.fileId;
          CDiscuzQ.request
            .postData(
              "/thread/video",
              {
                file_id: doneResult.fileId,
              },
              {},
              {
                type: "thread-video",
              }
            )
            .then((res) => {
              this.threadVideo = res.data["attributes"];
            });
        })
        .catch((err) => {
          console.log(err);
          this.uploadStatus = "exception";
          // deal with error
        });
    },
    getUploadSignature() {
      return CDiscuzQ.request.get("/signature").then((res) => {
        let data = CDiscuzQ.serializer(res)["data"];
        let signature = data["signature"];
        return signature;
      });
    },
    async changeCover(e) {
      // let file = e.target.files[0];
      let signature = await this.getUploadSignature();

      CDiscuzQ.http
        .get(
          "https://vod.tencentcloudapi.com/?Action=ModifyMediaInfo&FileId=5285890809741411848&Name=新的视频名称&Version=2018-07-17&Timestamp=" +
            Date.now() * 1000 +
            "&Nonce=45648956&SecretId=AKID9QWTAd6xkIlz1ozfjbEk12oLeiY9rolT&Signature=" +
            signature
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    save() {
      if (this.thread.file_id === 0) {
        this.$message.warn("请上传视频");
        return;
      }
      if (this.uploadStatus !== "success") {
        this.$message.warn("请等待视频上传完成");
        return;
      }
      this.submitLoading = true;
      CDiscuzQ.request
        .postData(
          "/threads",
          this.thread,
          {
            category: {
              type: "categories",
              id: 1,
            },
          },
          {
            type: "threads",
          }
        )
        .then((res) => {
          this.$message.success("发布成功");
          this.submitLoading = false;
          let thread = CDiscuzQ.serializer(res)["data"];
          setTimeout(() => {
            this.$router.replace("/v/" + thread._source.id);
          }, 1000);
        });
    },
  },
  components: {
    AUpload: Upload,
    AUploadDragger: Upload.Dragger,
    AProgress: Progress,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    AAlert:Alert
  },
};
</script>

<style scoped>
.video-upload {
  padding: 60px;
}

.ant-upload-drag-icon {
  margin-top: 80px;
  color: #d7d7d7;
}
.ant-upload-title {
  font-size: 20px;
  color: #000;
}
.upload-recommend {
  display: flex;
  justify-content: space-evenly;
  margin: 102px 0 30px;
}
.upload-recommend-item {
  display: flex;
  align-items: center;
}
.upload-recommend .c-icon {
  margin-right: 7px;
  color: #d7d7d7;
}
.upload-recommend-details {
  text-align: left;
  font-size: 12px;
}
.upload-recommend-details p {
  font-size: 14px;
  color: #666;
}

.upload-detail-header {
  display: flex;
  justify-content: space-between;
}
.upliad-file-change {
  margin-left: 10px;
  flex-shrink: 0;
}
.upload-detail-body {
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
  font-size: 14px;
  color: #999;
}
.upload-file-status {
  font-size: 18px;
}
.upload-file-status .c-icon {
  margin-right: 5px;
}
.upload-file-status-success {
  color: var(--success-color);
}
.upload-file-status-active {
  color: var(--primary-color);
}
.upload-file-status-error {
  color: var(--error-color);
}
.upload-progress {
  margin-top: 14px;
}

.publish-form {
  margin-top: 24px;
}
.upload-cover {
  display: block;
  position: relative;
  width: 296px;
  height: 168px;
  line-height: 168px;
  text-align: center;
  font-size: 20px;
  cursor: pointer;
  background: #f5f5f5;
  border: 1px dashed #b3b3b3;
  border-radius: 5px;
  overflow: hidden;
}
.upload-cover:hover {
  background-color: #f9f9f9;
}
.upload-cover .c-icon {
  margin-right: 10px;
}
.upload-cover img {
  vertical-align: top;
  width: 100%;
  height: 100%;
}
.upload-cover-change {
  display: none;
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  bottom: 18px;
  margin: 0 auto;
  width: 70px;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 5px;
}
.upload-cover:hover .upload-cover-change {
  display: block;
}
.upload-cover-tips {
  margin-left: 115px;
  line-height: 14px;
  font-size: 12px;
}

.publish-form-operate {
  text-align: right;
}
.publish-form-operate button {
  margin-left: 10px;
}
</style>