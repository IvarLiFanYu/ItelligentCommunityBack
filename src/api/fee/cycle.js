import request from '@/utils/request'

const api_name = '/fee/cycle'

export default {
    findAll() {
        return request({
          url: `${api_name}/findAll`,
          method: 'get',
        })
      },
    save(item) {
      return request({
        url: `${api_name}/saveCycle`,
        method: 'post',
        data: item
      })
    },
    updateById(item) {
      return request({
        url: `${api_name}/updateCycle`,
        method: 'put',
        data: item
      })
    },
    removeById(id){
      return request({
        url: `${api_name}/${id}`,
        method: 'delete'
      })
    }
}
