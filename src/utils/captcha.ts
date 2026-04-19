/**
 * 计算图片和滑块的实际尺寸（支持百分比或固定值）
 * @param vm - 组件实例
 * @returns 包含实际宽高（带单位）的对象
 */
export function resetImgBarSize(vm: any): {
  imgWidth: string
  imgHeight: string
  barWidth: string
  barHeight: string
} {
  let imgWidth: string, imgHeight: string
  let barWidth: string, barHeight: string

  // 原代码中使用了 EmployeeWindow 作为 fallback，保持逻辑不变
  const fallbackWindow = window as any
  const parentNode = vm.$el.parentNode
  const parentWidth = parentNode?.offsetWidth ?? fallbackWindow.offsetWidth
  const parentHeight = parentNode?.offsetHeight ?? fallbackWindow.offsetHeight

  // 处理图片宽度
  if (vm.imgSize.width.includes('%')) {
    imgWidth = (parseInt(vm.imgSize.width, 10) / 100) * parentWidth + 'px'
  } else {
    imgWidth = vm.imgSize.width
  }

  // 处理图片高度
  if (vm.imgSize.height.includes('%')) {
    imgHeight = (parseInt(vm.imgSize.height, 10) / 100) * parentHeight + 'px'
  } else {
    imgHeight = vm.imgSize.height
  }

  // 处理滑块宽度
  if (vm.barSize.width.includes('%')) {
    barWidth = (parseInt(vm.barSize.width, 10) / 100) * parentWidth + 'px'
  } else {
    barWidth = vm.barSize.width
  }

  // 处理滑块高度
  if (vm.barSize.height.includes('%')) {
    barHeight = (parseInt(vm.barSize.height, 10) / 100) * parentHeight + 'px'
  } else {
    barHeight = vm.barSize.height
  }

  return { imgWidth, imgHeight, barWidth, barHeight }
}

// 验证码字符集（数字 + 大小写字母）
export const codeChars: (number | string)[] = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
]

// 验证码背景色数组
export const codeBackgroundColors: string[] = ['#fffff0', '#f0ffff', '#f0fff0', '#fff0f0']

// 验证码前景色数组
export const codeForegroundColors: string[] = [
  '#FF0033',
  '#006699',
  '#993366',
  '#FF9900',
  '#66CC66',
  '#FF33CC'
]
