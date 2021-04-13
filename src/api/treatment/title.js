import request from '@/utils/request'

const api_name = '/treatment/title'

export default {
    findAll() {
      return request({
        url: `${api_name}/findAll`,
        method: 'get',
      })
    }
}
