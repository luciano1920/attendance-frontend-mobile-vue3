/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-06
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-06
 * @FilePath     : /attendance-frontend-mobile/src/composables/useInfiniteList.ts
 * @Description  : 无限滚动加载列表组合式函数
 */
import { computed, onMounted, onUnmounted, ref, toValue, watch, type Ref } from 'vue'

/** 外部必须传入的查询参数结构，必须包含 pageSize，但不含 pageNo */
export type SearchParams = Record<string, any> & { pageSize: number }

/** 分页请求完整参数（包含完整业务参数） */
export interface PageParams extends Record<string, any> {
  pageNo: number
  pageSize: number
}

/** 分页请求归一化返回结果 */
export interface PageResult<T> {
  list: T[]
  total: number
}

export interface UseInfiniteListOptions<T> {
  /** 核心请求函数*/
  fetchMethod: (params: PageParams, signal?: AbortSignal) => Promise<PageResult<T>>
  /** 外部统一的查询参数（必须包含 pageSize，禁止包含 pageNo），支持响应式对象或 getter 函数 */
  searchParams: SearchParams | (() => SearchParams)
  /** 是否 onMounted 自动加载首页，默认 true */
  immediate?: boolean
  /** 请求失败回调（不传则仅 console.error） */
  onError?: (error: any) => void
}

/**
 * 无限滚动列表组合式函数
 *
 * @param options 配置选项对象
 */
export const useInfiniteList = <T = any>(options: UseInfiniteListOptions<T>) => {
  const { fetchMethod, searchParams, immediate = true, onError } = options

  const isFetching = ref<boolean>(false) // 请求锁：防止并发请求
  const isFinished = ref<boolean>(false) // 截断锁：数据到底 or 接口报错，停止滚动加载
  const pageNo = ref<number>(1)
  const dataList = ref<T[]>([]) as Ref<T[]>
  const listTotal = ref<number>(0)

  const initLoading = computed(() => isFetching.value && pageNo.value === 1) // 首屏骨架loading 态
  const scrollLoading = computed(() => (isFetching.value && pageNo.value > 1 ? 'loading' : '')) // TDesign t-list async-loading 绑定值

  /**
   * 获取查询参数
   * @returns Record 对象
   */
  const resolveSearchParams = (): SearchParams => {
    return toValue(searchParams) as SearchParams
  }

  /*
    用于取消进行中网络请求的控制器，在发起新请求前，主动取消上一次未完成的请求
    当用户快速切换筛选条件时，会连续触发多次请求。由于网络返回顺序不确定，如果前一次请求比后一次请求晚返回，会发生旧数据覆盖新数据的竞态错误。
  */
  let abortController: AbortController | null = null

  /** 获取列表数据 */
  const fetchListData = async (): Promise<void> => {
    // 取消上一次未完成的请求
    if (abortController) {
      abortController.abort()
    }
    const currentController = new AbortController()
    abortController = currentController

    // 发请求开始就加上请求锁
    isFetching.value = true

    try {
      const params = {
        ...resolveSearchParams(),
        pageNo: pageNo.value,
      }

      const result = await fetchMethod(params, currentController.signal)
      const newList = result.list ?? []
      if (pageNo.value === 1) {
        dataList.value = newList
      } else {
        // dataList.value = dataList.value.concat(newList)
        dataList.value = [...dataList.value, ...newList]
      }
      listTotal.value = result.total ?? 0

      // 如果当前数据量 >= 分页总量，说明数据已全量加载，则上截断锁
      if (dataList.value.length >= listTotal.value) {
        isFinished.value = true
      }
    } catch (error: any) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        return
      }

      if (onError) {
        onError(error)
      } else {
        console.error('[useInfiniteList] 请求异常:', error)
      }

      // 如果获取数据失败，接口异常，也要上截断锁
      isFinished.value = true
    } finally {
      if (!currentController?.signal.aborted) {
        isFetching.value = false // 无论成功失败，只解请求锁
      }
      abortController = null // 断开引用，防止闭包导致内存泄漏
    }
  }

  /** 列表加载更多数据 */
  const loadMore = (): Promise<void> => {
    if (isFetching.value || isFinished.value) {
      return Promise.resolve()
    }

    pageNo.value += 1
    return fetchListData()
  }

  /** 列表刷新数据 */
  const onRefresh = (): Promise<void> => {
    pageNo.value = 1
    dataList.value = []
    listTotal.value = 0

    // 下拉刷新时，打开截断锁
    isFinished.value = false
    return fetchListData()
  }

  /** 重置列表数据 */
  const onReset = () => {
    pageNo.value = 1
    dataList.value = []
    listTotal.value = 0
    isFinished.value = false
  }

  /** 处理列表滚动 */
  const onScroll = (scrollBottom: number): void => {
    if (scrollBottom < 1 && !isFetching.value && !isFinished.value) {
      loadMore()
    }
  }

  // ------------------- 生命周期 -------------------
  const stopWatch = watch(
    () => resolveSearchParams(),
    () => onRefresh(),
    { deep: true },
  )

  onMounted(() => {
    if (immediate) fetchListData()
  })

  onUnmounted(() => {
    abortController?.abort() // 组件卸载时取消正在进行的请求，防止内存泄漏
    stopWatch() // 并停止监听查询参数变化
  })

  return {
    // 状态
    dataList,
    isFetching,
    isFinished,
    initLoading,
    scrollLoading,
    listTotal,
    pageNo,

    // 方法
    onScroll,
    onRefresh,
    onReset,
    loadMore,
    fetchListData,
  }
}
