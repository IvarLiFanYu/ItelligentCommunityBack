import request from '@/utils/request'

const api_name = '/shop/report'

export default {
  dayReport() {
    return request({
      url: `${api_name}/dayReport`,
      method: 'get',
    })
  },
  monthReport() {
    return request({
      url: `${api_name}/monthReport`,
      method: 'get',
    })
  }
}
