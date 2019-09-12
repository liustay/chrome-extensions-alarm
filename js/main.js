// 设置 alarm
function setAlarm(data) {
  if (!data.length) {
    return
  }
  data.forEach(item => {
    chrome.alarms.create(JSON.stringify(item), {
      when: new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${item.time}`).valueOf()
    });
  });
}
// 清除所有 alarm
function clearAlarm() {
  chrome.alarms.clearAll();
}
// 获取所有 alarm
function getAll() {
  return new Promise((resolve, reject) => {
    chrome.alarms.getAll(function (info) {
      resolve(info || [])
    })
  })
}


var app = new Vue({
  el: '#app',
  data: {
    nav: 0,
    form: {},
    all: 0,
    todo: 0
  },
  computed: {
    // 进度条百分比
    percentage(){
      return Math.round((this.all-this.todo)/this.all*100)
    }
  },
  async mounted() {
    this.form = await this.getStorageForm() || this.initForm()
    this.setProgress()
  },
  methods: {
    // 设置首页统计数量
    async setProgress() {
      let alarms = await getAll()
      let schedule = this.form.schedule
      this.all = schedule.length
      this.todo = alarms.length
    },

    // 初始化表单
    initForm() {
      this.form = {
        on: true,
        schedule: []
      }
      this.add()
    },

    // 保存表单 设置通知
    save() {
      clearAlarm()
      if (this.form.on) {
        setAlarm(this.form.schedule)
        chrome.browserAction.setBadgeText({ text: '' })
      } else {
        chrome.browserAction.setBadgeText({ text: 'Off' })
        chrome.browserAction.setBadgeBackgroundColor({ color: '#F00' });
      }
      chrome.storage.sync.set({ form: JSON.stringify(this.form) });
      window.close()
    },

    //添加
    add() {
      this.form.schedule.push({ time: `${String(new Date().getHours()).padStart(2, 0)}:${String(new Date().getMinutes()).padStart(2, 0)}` })
    },
    // 删除
    remove(i) {
      this.form.schedule.splice(i, 1)
    },
    // 获取本地缓存表单
    getStorageForm() {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['form'], result => {
          console.log('Value currently is ' + result.form);
          if (result.form && JSON.parse(result.form)) {
            resolve(JSON.parse(result.form))
          } else {
            resolve(null)
          }
        });
      })
    },
    // 进度条颜色
    customColorMethod(percentage) {
      if (percentage < 25) {
        return '#909399';
      } else if (percentage < 50) {
        return '#e6a23c';
      } else if (percentage < 75) {
        return '#67c23a';
      } else {
        return '#409eff'
      }
    },
  }
})
