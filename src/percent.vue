<template>
  <div class='percentageRingWrap'>
    <canvas ref='percentageRing'/>
  </div>
</template>

<script>
export default {
  name: 'percent',
  props: {
    percent: {
      type: Number,
      default: 50
    },
    textName: {
      type: String,
      default: '省列重点项目'
    },
    theme: {
      type: String,
      default: 'orange'
    }
  },
  data () {
    return {
      location: {},
      size: '',
      canvas: '',
      ctx: '',
      value: 0,
      speed: 1,
      themes: {
        orange: {
          startColor1: '#0e2c57',
          endColor1: '#C24747',
          startColor2: '#FFD783',
          endColor2: '#C24747'
        },
        blueLight: {
          startColor1: '#1CD7E4',
          endColor1: '#082968',
          startColor2: '#1cd6e4',
          endColor2: '#0a3470'
        },
        blueDark: {
          startColor1: '#005EFB',
          endColor1: '#072F82',
          startColor2: '#055BEC',
          endColor2: '#072F82'
        }
      },
      lineWidth: 20,
      scale: 1
    }
  },
  watch: {
    percent (to, from) {
      to !== from && this.rerenderCanvas()
    },
    textName (to, from) {
      to !== from && this.rerenderCanvas()
    },
    theme (to, from) {
      to !== from && this.rerenderCanvas()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initCanvas()
    })
  },
  updated () {
    this.initCanvas()
  },
  methods: {
    rerenderCanvas () {
      this.value = 0
      this.scale = 1
      this.lineWidth = 20
      this.initCanvas()
    },
    initCanvas () {
      const canvas = this.$refs.percentageRing
      const wrap = canvas.parentNode
      const ctx = canvas.getContext('2d')
      this.canvas = canvas
      this.ctx = ctx
      canvas.width = wrap.clientWidth
      canvas.height = wrap.clientHeight
      this.size =
        wrap.clientWidth > wrap.clientHeight
          ? Math.floor(canvas.height / 2)
          : Math.floor(canvas.width / 2)
      this.location = {
        x: Math.floor(canvas.width / 2),
        y: Math.floor(canvas.height / 2)
      }
      this.scale = this.size / 150
      this.lineWidth = this.lineWidth * this.scale
      this.animate()
    },
    // 绘制最外层圈
    drawCircleWrap () {
      const ctx = this.ctx
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 4 * this.scale
      ctx.lineCap = 'round'
      ctx.arc(
        this.location.x,
        this.location.y,
        this.size - 20 * this.scale,
        0,
        Math.PI * 2,
        false
      )
      ctx.stroke()
    },

    // 设定渐变背影的起始结束点
    linearLocation () {
      let start = this.location.y - ((this.size - 15 * this.scale) * 2 + this.lineWidth * this.scale) / 2
      let end = start + (this.size - 15 * this.scale) * 2 + this.lineWidth * this.scale
      return { start: start, end: end }
    },

    // 绘制中心圆周边的那圈
    drawCenterBorderCircle () {
      const ctx = this.ctx
      ctx.beginPath()
      const gradient = ctx.createLinearGradient(
        0,
        this.linearLocation().start,
        0,
        this.linearLocation().end
      )
      gradient.addColorStop(0, this.themes[this.theme]['startColor1'])
      gradient.addColorStop(1, this.themes[this.theme]['endColor1'])
      ctx.strokeStyle = gradient
      ctx.lineWidth = 3 * this.scale
      ctx.lineCap = 'round'
      ctx.arc(
        this.location.x,
        this.location.y,
        this.size - 32 * this.scale,
        -Math.PI / 2,
        Math.PI * 2 - Math.PI / 2 + ((100 - this.value) / 100) * Math.PI,
        true
      )
      ctx.stroke()
    },

    // 绘制中心背景圆
    drawCenterCircle () {
      const ctx = this.ctx
      ctx.beginPath()
      const round = ctx.createRadialGradient(
        this.location.x,
        this.location.y,
        20 * this.scale,
        this.location.x,
        this.location.y,
        this.size - 30 * this.scale
      )
      round.addColorStop(0.5, 'rgba(255,255,255,0)')
      round.addColorStop(1, 'rgba(255,255,255,0.1)')
      ctx.fillStyle = round
      ctx.arc(
        this.location.x,
        this.location.y,
        this.size - 30 * this.scale,
        0,
        Math.PI * 2,
        false
      )
      ctx.fill()
    },

    // 绘制进度百分比文字
    drawTextPercent (percent) {
      const ctx = this.ctx
      ctx.beginPath()
      ctx.font = `${26 * this.scale}px 'PingFangSC-Regular'`
      ctx.textAlign = 'center'
      ctx.fillStyle = '#fff'
      ctx.fillText(`${percent}%`, this.location.x, this.location.y)
      ctx.stroke()
    },

    // 绘制二级文字
    drawTextName (text) {
      const ctx = this.ctx
      ctx.beginPath()
      ctx.font = `${14 * this.scale}px "PingFangSC-Regular"`
      ctx.textAlign = 'center'
      ctx.fillStyle = '#fff'
      ctx.fillText(text, this.location.x, this.location.y + 25 * this.scale)
      ctx.stroke()
    },

    // 绘制进度条
    drawCircleLay () {
      const ctx = this.ctx
      const x =
        this.location.x +
        (this.size - 40 * this.scale) * Math.sin(((this.percent / 100) * Math.PI) / 180)
      const y =
        this.location.y +
        (this.size - 40 * this.scale) * Math.cos(((this.percent / 100) * Math.PI) / 180)
      ctx.beginPath()
      const gradient = ctx.createLinearGradient(this.location.x, 0, x, y)
      // const gradient = ctx.createLinearGradient(0,this.linearLocation().start,0,this.linearLocation().end)
      gradient.addColorStop(0, this.themes[this.theme]['startColor2'])
      gradient.addColorStop(1, this.themes[this.theme]['endColor2'])
      ctx.strokeStyle = gradient
      ctx.lineWidth = this.lineWidth
      ctx.lineCap = 'round'
      ctx.arc(
        this.location.x,
        this.location.y,
        this.size - 40 * this.scale,
        -Math.PI / 2,
        (1 - this.value / 100) * Math.PI * 2 - Math.PI / 2,
        true
      )
      ctx.stroke()
    },
    animate () {
      const ctx = this.ctx
      const canvas = this.canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.drawCircleWrap()
      this.drawCenterCircle()
      this.drawCenterBorderCircle()
      this.drawTextPercent(this.percent)
      this.drawTextName(this.textName)
      this.drawCircleLay()
      if (this.value < this.percent - 1) {
        this.value += this.speed
        window.requestAnimationFrame(this.animate)
      }
    }
  }
}
</script>

<style scoped >
.percentageRingWrap {
  width: 100%;
  height: 100%;
}
</style>
