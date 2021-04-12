import request from '@/utils/request'

const api_name = '/flow'

export default {
    findAll() {
        return request({
          url: `${api_name}/flow/findAll`,
          method: 'get',
        })
      },
      deploy(id) {
        return request({
          url: `${api_name}/flow/deployment/${id}`,
          method: 'put'
        })
      },
      updateById(item) {
        return request({
          url: `${api_name}/update`,
          method: 'put',
          data: item
        })
      },
      taskList(id) {
        return request({
          url: `${api_name}/flow/findFlowTask/${id}`,
          method: 'get',
        })
      }
}
