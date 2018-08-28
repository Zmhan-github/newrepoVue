<template>
  <div class="home">
    <v-dialog name="login" :width="250" :height="200" />
    <form v-if="isLogin === 'regStep1'" @submit.prevent="registerStep1">
      <phone-input :phone="phone"/>
      <button>Далее</button><br />
      <li><a @click="ChangePassword">У меня есть аккаунт</a></li>
    </form>

     <form v-else-if="isLogin === 'regStep2'" @submit.prevent="registerStep2" >
        <input id="code" type="text" v-model="register.codeSMS" value="register.codeSMS" placeholder="Код подтверждения">
        <button>Далее</button> <br />
        <li><a @click="ChangePassword">У меня есть аккаунт</a></li>
      </form>

    <form v-else-if="isLogin === 'regStep3'" @submit.prevent="registerStep3" >
      <ul>
      <li>
        <img src="../assets/name.png">
        <input type="text" v-model.trim="register.name" placeholder="Введите имя" @input="changeName">
        <span class="wr" v-if="msgValid.name">Заполните это поле.</span>
      </li>
      <li>
        <img src="../assets/sname.png">
        <input type="text" v-model.trim="register.lastname" placeholder="Введите фамилию" @input="changeLastName">
        <span class="wr" v-if="msgValid.lastname">Заполните это поле.</span>
      </li>
      <li>
        <div class="boxB">
          <img src="../assets/calendar.png">
        </div>
        <div class="dateB">
          <datepicker :language="ru"></datepicker>
        </div>
      </li>
      <li class="mg-5">
        <img src="../assets/gender.png">
      <select v-model="selected">
        <option disabled value="">Выберите пол</option>
        <option>Мужской</option>
        <option>Женский</option>
      </select>
      </li>
      <li>
        <img src="../assets/password.png">
        <input id="name" type="password" v-model="register.password" @input="changePass" placeholder="Введите пароль"> <br />
        <span class="wr" v-if="msgValid.password">Введите пароль</span>
        <span class="wr" v-if="msgValid.minSimbol">Минимум 8-символов.</span>
      </li>
      <li>
        <img src="../assets/password.png">
        <input id="name" type="password" v-model="register.confirmPassword" @input="changePass2" placeholder="Повторите пароль"> <br />
        <span class="wr" v-if="msgValid.confirmPassword">Повторите пароль.</span>
        <span class="wr" v-if="msgValid.passAndpassConf">Пароли не совподают</span>
      </li>
      <li><button type="submit">Регистрация</button></li>
      <li><a @click="ChangePassword">У меня есть аккаунт</a></li>
      </ul>
    </form>
  </div>
</template>

<script>
import PhoneInput from 'vue2-phone-input';
import Datepicker from 'vuejs-datepicker';
import {ru} from 'vuejs-datepicker/dist/locale'


export default {
  name: 'home',
  components: {
    PhoneInput,
    Datepicker,
  },
  data() {
    return {
      isLogin: 'regStep3',
      isRegister1: true,
      ru: ru,
      phone: {
        code: '',
        number: ''
      },
      isValid: false,
      msgValid: {
        name: false,
        lastname: false,
        password: false,
        confirmPassword: false,
        minSimbol: false,
        passAndpassConf: false,
      },
      register: {
        codeSMS: '',
        password: '',
        confirmPassword: '',
        name: '',
        lastname: '',
        birthday: '',
        gender: '',
        token: '',
      },
      selected: '',
      date: '2016-10-16',
      loginValidate: {
        login: false,
      },
    };
  },

  //================== Methods ==========================/
  methods: {

    // ================ REGister Step - 1 ===============//
    registerStep1() {
      console.log('ru ', ru);
      this.phone.number = (this.phone.number.length === 10) ? '7' + this.phone.number : '7' + this.phone.number.slice(1);
      this.$http.post('/signup', { phone: this.phone.number })
      .then(res => {
        this.isLogin = 'regStep2';
      })
      .catch(err => {
        this.$modal.show('dialog', {
        text: 'Введите валидный номер телефона!',
        buttons: [
          {
            title: 'Закрыть'
          }
        ]});
      });


    },

    // ================= Register Step - 2 ===============//
    registerStep2() {
      let codeSMS = this.register.codeSMS.trim();
      if (codeSMS.length > 5 || codeSMS.length < 5) {
         this.$modal.show('dialog', {
            text: 'Введите 5 - символов!',
            buttons: [
              {
                title: 'Закрыть'
              }
          ]});
      } else {
          this.$http.post('/signup/verify-phone', {
            phone: this.phone.number,
            code: this.register.codeSMS,
          })
          .then(res => {
            this.register.token = res.data.access_token;
            this.isLogin = 'regStep3';
          })
          .catch(err => {
            this.$modal.show('dialog', {
            text: 'Ошибка!',
            buttons: [
              {
                title: 'Закрыть'
              }
          ]});
          });
      }
    },
   

    // =========== Change Password ============ //
    ChangePassword() {
      console.log('You clicked Button!');
    },



  },
};
  //================== Login Validate ===================/
  // computed: {
  //   loginValidateChange() {
  //     return {
  //       borderBottom: this.loginValidate.login ? '1px solid var(--color-primary-notific)' : '',
  //     };
  //   }
  // },
  // methods: {
  //   show () {
  //     this.$modal.show('hello-world');
  //   },
  //   hide () {
  //     this.$modal.hide('hello-world');
  //   },
  //   changeName(e) {
  //     console.log(e.target.value);
  //     this.msgValid.name = false;
  //   },
  //   changeLastName(e) {
  //     console.log(e.target.value);
  //     this.msgValid.lastname = false;
  //   },
  //   changePass(e) {
  //     this.msgValid.password = false;
  //     this.msgValid.minSimbol = false;
  //     this.msgValid.passAndpassConf = false;
  //   },
  //   changePass2(e) {
  //     this.msgValid.confirmPassword = false;
  //     this.msgValid.passAndpassConf = false;
  //   },
  //   toLogin() {
  //     this.isLogin = 'login';
  //   },
  //   onInput(e) {
  //     console.log("number ", e);
  //     if (isValid) {
  //       this.isValid = isValid;
  //     }
  //   },
  //   registration() {
  //     this.isLogin = 'regStep1';
  //   },
  //   registerStep1() {
 
  //     if (this.phone.number.length === 11) {
  //       this.phone.number = 7 + this.phone.number.slice(1);
        
  //       this.$http.post('/signup', {
  //         phone: this.phone.number,
  //       })
  //       .then(res => {
  //         this.isLogin = 'regStep2';
  //       })
  //       .catch(err => {
  //         this.$modal.show('dialog', {
  //           text: 'Введите валидный номер телефона!',
  //           buttons: [
  //             {
  //               title: 'Закрыть'
  //             }
  //         ]});
  //       });
  //     }

  //     if (this.phone.number.length === 10) {
  //       this.phone.number = 7 + this.phone.number;
        
  //       this.$http.post('/signup', {
  //         phone: this.phone.number,
  //       })
  //       .then(res => {
  //         this.isLogin = 'regStep2';
          
  //       })
  //       .catch(err => {
  //           this.$modal.show('dialog', {
  //           text: 'Введите валидный номер телефона!',
  //           buttons: [
  //             {
  //               title: 'Закрыть'
  //             }
  //         ]});
  //       });
  //     }
  //   },
    // registerStep2() {
    //   let codeSMS = this.register.codeSMS.trim();
    //   if (codeSMS.length > 5 || codeSMS.length < 5) {
    //     alert('введите 5 символов');
    //   } else {
    //       this.$http.post('/signup/verify-phone', {
    //         phone: this.phone.number,
    //         code: this.register.codeSMS,
    //       })
    //       .then(res => {
    //         this.register.token = res.data.access_token;
    //         this.isLogin = 'regStep3';
    //       })
    //       .catch(err => {
    //         this.$modal.show('dialog', {
    //         text: 'Ошибка!',
    //         buttons: [
    //           {
    //             title: 'Закрыть'
    //           }
    //       ]});
    //       });
    //   }
    // },
    // registerStep3() {
    //   let password = this.register.password.trim();
    //   let cPassword = this.register.confirmPassword.trim();

    //   const config = {
    //     headers: { 'Authorization': `Bearer ${this.register.token}` }
    //   };

    //   if (this.register.name.length < 1) {
    //     this.msgValid.name = true;
    //     return;
    //   }
      
    //   if (this.register.lastname.length < 1) {
    //     this.msgValid.lastname = true;
    //     return;
    //   }

    //   if (this.register.password.length < 1) {
    //     this.msgValid.password = true;
    //     return;
    //   }

    //   if (this.register.confirmPassword < 1) {
    //     this.msgValid.confirmPassword = true;
    //     return;
    //   }

    //   if (this.register.password !== this.register.confirmPassword) {
    //     this.msgValid.passAndpassConf = true;
    //     return;
    //   }

      

    //   if (password === cPassword && password.length > 7) {
    //     let obj = {
    //       name: this.register.name,
    //       lastname: this.register.lastname,
    //       birthday: this.date,
    //       gender: (this.selected === 'Мужской') ? 'male' : 'female',
    //       password: this.register.password
    //     };
    //     console.log("data ", obj);

    //     this.$http.post('/signup/data', obj, config)
    //       .then(res => {
    //       this.$modal.show('dialog', {
    //       text: 'Вы успешно зарегистрировались!',
    //       buttons: [
    //         {
    //           title: 'Ок'
    //         }
    //       ]});

    //       setTimeout(()=>{
    //         this.isLogin = 'login';
    //       }, 4000);
            

    //       })
    //       .catch(err => {
    //         this.$modal.show('dialog', {
    //         text: 'Ошибка введеных данных!',
    //         buttons: [
    //           {
    //             title: 'Закрыть'
    //           }
    //       ]});
    //       });

    //   } else {
    //     this.msgValid.minSimbol = true;
    //   }
    // },

    // //================= Login =========================/
    // loginPhoneChange(e){
    //   this.loginValidate.login = false;
    //   this.$modal.hide('dialog');
    //   if (this.phoneLogin[0]==='8'){
    //     this.phoneLogin = '+7';
    //   }

    //   if (!Number(this.phoneLogin.slice(1))) {
    //     const first = Number(this.phoneLogin.slice(1));
    //     if (first === 0) {
    //       return;
    //     }
    //     console.log('==========Введите число!============');
    //     this.loginValidate.login = true;
    //     this.$modal.show('dialog', {
    //       text: 'Введите номер телефона!',
    //       buttons: [
    //         {
    //           title: 'Закрыть'
    //         }
    //     ]});
    //   }
    // },
    // logIn() {
    //   this.$http.post('/login', {
    //     phone: this.phoneLogin,
    //     password: this.password,
    //   })
    //   .then(res => {
    //     console.log('response ', res.data);
    //     let token = res.data.access_token;
    //     if (token) {
    //       localStorage.setItem('token', token);
    //       this.$emit('logged');
    //       this.$router.push('/profile');
    //     };
    //   }).catch(err => {
    //     console.log('error ', err.response.data);
    //       this.$modal.show('dialog', {
    //       text: 'Ошибка логина или пароля!',
    //       buttons: [
    //         {
    //           title: 'Закрыть'
    //         }
    //     ]});
    //     });
    // },
  // },

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.mg-5 {
  margin: 10px 0;
}
.wr {
  color: red;
}
.home {
  text-align: center;
  width: 750px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.home__slogan {
  width: 400px;
  padding-top: 35px;
  letter-spacing: .2rem;
}

.home__slogan-text {
  text-transform: uppercase;
  font-size: 3.2rem;
  text-align: right;
  font-weight: 500;
  letter-spacing: .2rem;
}
.home__started {
  font-size: 1.4rem;
  width: 305px;
  background: rgba(255, 255, 255, 0.4);
  padding: 20px;
  margin: 25px;
  border-radius: 15px;
}
.logo{
  width: 95px;
  padding-bottom: 10px;
}
ul {
  margin-left: 0;
  padding-left: 0;
}
li {
  margin: 6px;
  list-style-type: none;
}
input {
  border: none;
  outline: none;
  background: none;
  font-size: 16px;
  width: 60%;
  margin-bottom: 15px;
}

select {
  border: none;
  outline: none;
  background: none;
  font-size: 16px;
  padding-left: -5px;
  width: 60%;
  color: inherit;
}
.boxB {
  float: left;
  margin-right: 18px;
  margin-left: 29px;
}

.boxB > img {
  margin-right: 0;
  margin-top: 2px;
}
.dateB {
  background: none;
  font-size: 16px;
  width: 220px;
  font-weight: 800;
  color: inherit;
}
img {
  width: 18px;
  margin-right: 20px;
}

button {
  height: 32px;
  width: 68%;
  color: white;
  background-color: #078add;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 14px;
  margin-top: 8px;
  cursor: pointer;
}
button:hover {
  background-color: #0776bd;
}
a {
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  color: #078add;
}

label {
  margin-top: 20px;
  font-size: 20px;
}

a:hover, a:active {
  text-decoration: none;
  color: #044e7c;
}

</style>

