<template>
  <div class="login">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <h3 class="title">域名管理后台</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <!-- 二次修改  验证码 -->
      <!-- <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="validCode"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" />
        </div>
      </el-form-item> -->
      <el-checkbox
        v-model="loginForm.rememberMe"
        style="margin: 0px 0px 25px 0px"
        >记住密码</el-checkbox
      >
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <!-- 谷歌验证弹窗 -->
    <el-dialog
      title="验证码"
      :visible.sync="codeVisible"
      :before-close="handleClose"
      width="300px"
    >
      <div class="qrcode-2fa">
        <p v-if="qrcode" class="">密钥：{{ secret }}</p>

        <div v-if="qrcode" v-html="qrcode" />
        <el-input
          v-model="code"
          placeholder="请输入Google Authenticator验证码"
        />

        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%; margin-top: 20px"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 获取验证码接口
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";

export default {
  name: "Login",
  data () {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        // code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [{ required: true, trigger: "blur", message: "密码不能为空" }]
        // 二次修改  验证码的验证逻辑
        // code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined,

      qrcode: null,
      code: undefined,
      secret: undefined,
      codeNum: 1,
      codeVisible: false,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created () {
    // 二次修改 accessRoutes
    // this.getCode();
    this.getCookie();
  },
  methods: {
    getCode () {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie () {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          // 6.30 ====
          const obj = { ...this.loginForm };
          if (this.code) {
            obj.code = this.code;
            obj.secret = this.secret;
            delete obj.captcha;
          }
          if (obj.code === "") {
            delete obj.code;
          }
          this.$store
            .dispatch("Login", obj)
            .then(res => {
              // console.log(res, "=======参数==")
              const { code, msg, data } =res 
              this.loading = false;
              if (code === 407) {
                this.qrcode = data.qr_code;
                this.secret = data.secret;
                this.codeVisible = true;
                return;
              }
              if (code === 402) {
                if (this.codeNum === 1) {
                  this.code = "";
                  this.codeVisible = true;
                  this.codeNum = 2;
                  return;
                }
                if (this.codeNum === 2) {
                  this.$message.error(msg);
                  return;
                }
              }
              this.getSiteData();
            })
            .catch(err => {
              console.log(err);
              this.loading = false;
              // this.getCode();
            });
        }
      });
    },
    // 是否有站点
    getSiteData () {
      this.$store.dispatch("getUserSiteData").then(res => {
        if (res.status === 200) {
          this.$message.success("登录成功");
          this.$router.push({ path: "/index" });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 谷歌弹窗关闭
    handleClose () {
      this.codeNum = 1;
      this.code = "";
      this.qrcode = "";
      this.codeVisible = false
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../assets/image/login-background.jpg');
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.qrcode-2fa {
  text-align: center;
}
</style>
